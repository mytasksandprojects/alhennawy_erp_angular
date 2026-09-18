import { ExportDocStage, ExportOrder, Invoice } from '../../core/models/sales.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { nextGenerated } from '../../shared/crud/serial';
import { MockApiError } from '../mock-backend.interceptor';
import { MOCK_EXPORT_SHIPMENTS } from './logistics.mock';
import { MOCK_PRODUCTION_ORDERS } from './quality.mock';
import {
  MOCK_CUSTOMERS,
  MOCK_EXPORT_ORDERS,
  MOCK_INVOICES,
  MOCK_TAX_INVOICES,
  parseSalesLines,
  salesLinesTotal,
} from './sales.mock';
import { applyStockPlan, deductPlannedStock, planStock, spawnSalesOrder } from './stock-alloc';
import { MOCK_MOVEMENTS } from './warehouse.mock';

/**
 * Export pipeline — production is scheduled and approved in الإنتاج before
 * logistics picks a loading date, so production comes before logistics.
 */
const NEXT: Record<ExportDocStage, ExportDocStage | null> = {
  quotation: 'proforma',
  'internal-approval': 'proforma',
  proforma: 'supply-order',
  'supply-order': 'warehouse',
  warehouse: 'production-scheduled',
  'production-scheduled': 'production',
  production: 'logistics',
  logistics: 'issued',
  issued: 'invoiced',
  invoiced: null,
};

export function nextExportStage(stage: ExportDocStage): ExportDocStage | null {
  return NEXT[stage];
}

function linkedProduction(row: ExportOrder): ProductionOrder | undefined {
  return MOCK_PRODUCTION_ORDERS.find(
    (item) => item.id === row.productionOrderId || item.workOrderNumber === row.number,
  );
}

/** Merge requested rolls-per-line back into the stored lines. */
function applyLineRolls(row: ExportOrder, patch: Partial<ExportOrder>): void {
  const lines = parseSalesLines(row.linesJson);
  const rolls = (patch as Record<string, unknown>)['lineRolls'];
  if (Array.isArray(rolls) && lines.length) {
    rolls.forEach((count, index) => {
      if (lines[index]) lines[index].rolls = Math.max(0, Number(count) || 0);
    });
    row.linesJson = JSON.stringify(lines);
  }
  row.rollsCount = parseSalesLines(row.linesJson).reduce(
    (sum, line) => sum + Number(line.rolls || 0),
    0,
  ) || Number(patch.rollsCount || row.rollsCount);
  row.containersCount = Number(patch.containersCount || row.containersCount);
  if (!row.rollsCount || !row.containersCount) throw new MockApiError(400, 'invalid-request');
}

/** Warehouse step — deduct the stock-covered quantity for every line. */
function deductReservedStock(row: ExportOrder): void {
  const parts = parseSalesLines(row.linesJson).map((line) => ({
    itemCode: String(line.itemCode || ''),
    itemName: String(line.itemName || ''),
    available: Number(line.available ?? line.quantity ?? 0),
  }));
  deductPlannedStock(row.number, parts, 'export');
  row.stockDeducted = true;
}

export function advanceExportOrder(id: string, body: unknown): ExportOrder {
  const row = MOCK_EXPORT_ORDERS.find((item) => item.id === id);
  if (!row) throw new MockApiError(404, 'not-found');
  const next = NEXT[row.stage];
  if (!next) throw new MockApiError(400, 'invalid-request');
  const patch = (body ?? {}) as Partial<ExportOrder>;
  if (next === 'proforma') {
    // طلب تجريبي + الشروط والأحكام قبل إصدار البروفورما.
    row.trialOrder = patch.trialOrder === true || String(patch.trialOrder) === 'true';
    row.proformaStatus = 'pending';
  }
  if (row.stage === 'proforma' && row.proformaStatus !== 'approved') {
    throw new MockApiError(400, 'proforma-not-approved');
  }
  if (next === 'warehouse') {
    applyLineRolls(row, patch);
  }
  if (next === 'production-scheduled') {
    row.productionDeadline = String(patch.productionDeadline || '');
    if (!row.productionDeadline) throw new MockApiError(400, 'invalid-request');
    deductReservedStock(row);
    row.productionOrderId = spawnSalesOrder(
      row.number,
      row.id,
      'export-order',
      planStock(row as unknown as Record<string, unknown>).parts,
      row as unknown as Record<string, unknown>,
    );
  }
  if (next === 'production') {
    const order = linkedProduction(row);
    if (!order || order.approvalStatus !== 'approved') {
      throw new MockApiError(400, 'production-not-approved');
    }
    row.productionDate = order.scheduledDate || row.productionDate;
  }
  if (next === 'logistics') {
    row.loadingDate = String(patch.loadingDate || '');
    if (!row.loadingDate) throw new MockApiError(400, 'invalid-request');
    // موعد التحميل لا يسبق تاريخ الإنتاج.
    const floor = (row.productionDate || '').slice(0, 10);
    if (floor && row.loadingDate.slice(0, 10) < floor) {
      throw new MockApiError(400, 'loading-before-production');
    }
    MOCK_EXPORT_SHIPMENTS.unshift({
      id: `exs-${Date.now()}`,
      number: nextGenerated(MOCK_EXPORT_SHIPMENTS, 'number', 'SHP'),
      customerCode: row.customerCode,
      customerName: row.customerName,
      stage: 'booking',
      containersCount: row.containersCount,
      loadingDate: row.loadingDate,
      telexReleased: false,
      isLate: false,
    });
  }
  if (next === 'issued') {
    MOCK_MOVEMENTS.unshift({
      id: `mv-${Date.now()}`,
      number: nextGenerated(MOCK_MOVEMENTS, 'number', 'ISS'),
      date: new Date().toISOString(),
      type: 'issue',
      itemCode: row.itemCode || '',
      itemName: row.itemName || '',
      quantity: row.quantityKg || 0,
      unitKey: 'units.kg',
      fromWarehouseId: 'wh-fin1',
      referenceKey: 'warehouse.refs.salesOrder',
      reference: row.number,
      byUser: 'STORE1',
    });
  }
  if (next === 'invoiced') {
    const make = (kind: Invoice['kind'], prefix: string, total: number): Invoice => ({
      id: `inv-${kind}-${Date.now()}`,
      number: nextGenerated(MOCK_INVOICES, 'number', prefix),
      kind,
      date: new Date().toISOString(),
      customerCode: row.customerCode,
      customerName: row.customerName,
      currency: 'USD',
      exchangeRate: 48.5,
      total,
      collected: 0,
    });
    MOCK_INVOICES.unshift(make('commercial', 'CI', row.totalUsd || 0), make('packing-list', 'PL', 0));
    row.eInvoiceNumber = MOCK_INVOICES[0].number;
    MOCK_TAX_INVOICES.unshift({
      id: `tax-${Date.now()}`,
      number: nextGenerated(MOCK_TAX_INVOICES, 'number', 'TAX'),
      date: new Date().toISOString(),
      customerCode: row.customerCode,
      customerName: row.customerName,
      currency: 'USD',
      total: row.totalUsd || 0,
      status: 'ready',
    });
  }
  row.stage = next;
  return row;
}

/** اعتماد أو رفض البروفورما — لا طباعة ولا تقدم قبل الاعتماد. */
export function decideProforma(id: string, body: unknown): ExportOrder {
  const row = MOCK_EXPORT_ORDERS.find((item) => item.id === id);
  if (!row) throw new MockApiError(404, 'not-found');
  if (row.stage !== 'proforma') throw new MockApiError(400, 'invalid-request');
  const decision = String((body as Record<string, unknown>)?.['decision'] ?? '');
  if (decision !== 'approved' && decision !== 'rejected') {
    throw new MockApiError(400, 'invalid-request');
  }
  row.proformaStatus = decision;
  return row;
}

/** طلب تعديل موعد التحميل — يُعرض على الإنتاج للاعتماد أو الرفض. */
export function requestLoadingChange(id: string, body: unknown): ExportOrder {
  const row = MOCK_EXPORT_ORDERS.find((item) => item.id === id);
  if (!row) throw new MockApiError(404, 'not-found');
  if (!row.loadingDate) throw new MockApiError(400, 'invalid-request');
  const requested = String((body as Record<string, unknown>)?.['requestedDate'] ?? '');
  if (!requested) throw new MockApiError(400, 'invalid-request');
  row.requestedLoadingDate = requested;
  row.loadingRequestStatus = 'pending';
  const order = linkedProduction(row);
  if (order) {
    order.rescheduleDate = requested;
    order.rescheduleStatus = 'pending';
  }
  return row;
}

export function createExportQuotation(body: unknown): ExportOrder {
  const incoming = body as Partial<ExportOrder>;
  const customer = MOCK_CUSTOMERS.find((row) => row.code === incoming.customerCode);
  const linesJson = String(incoming.linesJson || '');
  if (!customer || customer.channel !== 'export' || (!incoming.itemName && (!linesJson || linesJson === '[]'))) {
    throw new MockApiError(400, 'invalid-request');
  }
  const planned = applyStockPlan(
    {
      number: nextGenerated(MOCK_EXPORT_ORDERS, 'number', 'EXP'),
      itemCode: incoming.itemCode || '',
      itemName: incoming.itemName,
      quantityKg: Number(incoming.quantityKg || 0),
      linesJson,
    },
    false,
  );
  const lines = parseSalesLines(String(planned['linesJson'] || linesJson));
  const row: ExportOrder = {
    id: `eo-${Date.now()}`,
    number: String(planned['number']),
    customerCode: customer.code,
    customerName: customer.name,
    stage: 'quotation',
    itemCode: String(planned['itemCode'] || ''),
    itemName: String(planned['itemName'] || incoming.itemName),
    quantityKg: Number(planned['quantityKg'] || 0),
    availableFromStockKg: Number(planned['availableFromStockKg'] || 0),
    toProduceKg: Number(planned['toProduceKg'] || 0),
    linesJson: String(planned['linesJson'] || linesJson || '') || undefined,
    rollsCount: 0,
    containersCount: 0,
    totalUsd: salesLinesTotal(lines) || Number(incoming.totalUsd || 0),
  };
  MOCK_EXPORT_ORDERS.unshift(row);
  return row;
}

export function prepareExportOrder(row: Record<string, unknown>): Record<string, unknown> {
  const customer = MOCK_CUSTOMERS.find((item) => item.code === row['customerCode']);
  const planned = applyStockPlan(row, false);
  if (customer) {
    planned['customerCode'] = customer.code;
    planned['customerName'] = customer.name;
  }
  const lines = parseSalesLines(planned['linesJson']);
  if (lines.length) planned['totalUsd'] = salesLinesTotal(lines);
  return planned;
}
