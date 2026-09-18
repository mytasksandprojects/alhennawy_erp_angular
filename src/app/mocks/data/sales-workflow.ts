import { ChartPoint, DashboardData, StatCardData } from '../../core/models/common.models';
import { ExportDocStage, ExportOrder, Invoice } from '../../core/models/sales.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { nextGenerated } from '../../shared/crud/serial';
import { MockApiError } from '../mock-backend.interceptor';
import { MOCK_EXPORT_SHIPMENTS } from './logistics.mock';
import { listCurrencies } from './lookups.mock';
import { MOCK_PRODUCTION_ORDERS } from './quality.mock';
import {
  MOCK_CUSTOMERS,
  MOCK_EXPORT_ORDERS,
  MOCK_INVOICES,
  MOCK_TAX_INVOICES,
  MOCK_WORK_ORDERS,
  parseSalesLines,
  salesLinesTotal,
} from './sales.mock';
import {
  applyStockPlan,
  deductPlannedStock,
  planStock,
  spawnSalesOrder,
  statusFromPlan,
  syncQcParent,
} from './stock-alloc';
import { MOCK_TAX_API_SETTINGS } from './tax-api.mock';
import { MOCK_MOVEMENTS } from './warehouse.mock';

const TARGET_EGP = 6000000;
const RETURNS_EGP = 62000;
const OPEN_WO = ['warehouse-check', 'partially-fulfilled', 'in-production', 'ready'];

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

const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const egp = (total: number, rate?: number) => total * (rate || 1);

function ranked(pairs: [string, number][]): ChartPoint[] {
  const totals = new Map<string, number>();
  for (const [label, value] of pairs) totals.set(label, (totals.get(label) ?? 0) + value);
  return [...totals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));
}

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

/**
 * Production-order writes: when production approves an order, its schedule
 * date flows back to the sales order; approving a reschedule request moves
 * the export order's loading date.
 */
export function prepareProductionOrder(row: Record<string, unknown>): Record<string, unknown> {
  const id = String(row['id'] || '');
  const previous = MOCK_PRODUCTION_ORDERS.find((item) => item.id === id);
  const next = { ...row };
  const linked = MOCK_EXPORT_ORDERS.find(
    (item) => item.productionOrderId === id || item.number === row['workOrderNumber'],
  );
  if (next['approvalStatus'] === 'approved' && previous?.approvalStatus !== 'approved') {
    if (!next['scheduledDate']) {
      next['scheduledDate'] = new Date().toISOString().slice(0, 10);
    }
    if (linked) linked.productionDate = String(next['scheduledDate']);
    const work = MOCK_WORK_ORDERS.find((item) => item.number === row['workOrderNumber']);
    if (work && !['invoiced', 'closed'].includes(work.status)) work.status = 'in-production';
  }
  if (next['approvalStatus'] === 'rejected' && previous?.approvalStatus !== 'rejected') {
    const work = MOCK_WORK_ORDERS.find((item) => item.number === row['workOrderNumber']);
    if (work && !['invoiced', 'closed'].includes(work.status)) work.status = 'new';
  }
  if (next['rescheduleStatus'] === 'approved' && previous?.rescheduleStatus === 'pending') {
    if (linked && linked.loadingRequestStatus === 'pending') {
      linked.loadingDate = String(next['rescheduleDate'] || linked.requestedLoadingDate || linked.loadingDate);
      linked.loadingRequestStatus = 'approved';
    }
  }
  if (next['rescheduleStatus'] === 'rejected' && previous?.rescheduleStatus === 'pending') {
    if (linked) linked.loadingRequestStatus = 'rejected';
  }
  return syncQcParent(next);
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

/** Local work order — محلي فقط، ويُرسل إلى أوامر الإنتاج للاعتماد. */
export function prepareWorkOrder(row: Record<string, unknown>): Record<string, unknown> {
  const next = applyStockPlan({ ...row, channel: 'local', currency: 'EGP', exchangeRate: 1 }, false);
  const lines = parseSalesLines(next['linesJson']);
  if (lines.length) next['totalPrice'] = salesLinesTotal(lines);
  if (!next['productName']) next['productName'] = lines[0]?.itemName || next['itemName'] || '';
  if (!next['id']) {
    next['id'] = `wo-${Date.now()}`;
    next['status'] = statusFromPlan(Number(next['availableFromStockKg']), Number(next['toProduceKg']));
    const parts = planStock(next).parts;
    spawnSalesOrder(
      String(next['number'] || ''),
      String(next['id']),
      'work-order',
      parts,
      next,
    );
    // المخازن تخصم الكمية المتاحة وتسجّل إذن صرف — الباقي يُصنَّع.
    deductPlannedStock(String(next['number'] || ''), parts, 'local');
    next['stockDeducted'] = true;
  }
  if (!next['date']) next['date'] = new Date().toISOString();
  return syncQcParent(next);
}

/** إرسال الفاتورة للمنظومة الضريبية — placeholder until the ETA API lands. */
export function prepareTaxInvoice(row: Record<string, unknown>): Record<string, unknown> {
  const next = { ...row };
  if (next['status'] === 'sent' && !next['sentAt']) {
    next['sentAt'] = new Date().toISOString();
    if (!next['eInvoiceUid']) {
      const issuer = MOCK_TAX_API_SETTINGS.posSerial || 'POS';
      next['eInvoiceUid'] = `EG-ETA-${issuer}-${String(Math.floor(10000 + Math.random() * 89999))}`;
    }
  }
  if (next['status'] === 'ready') {
    delete next['sentAt'];
  }
  return next;
}

export function salesDashboard(query?: URLSearchParams): DashboardData {
  const from = query?.get('from') ?? '';
  const to = query?.get('to') ?? '';
  const currency = query?.get('currency') ?? '';
  const inRange = (date: string) => {
    const day = String(date || '').slice(0, 10);
    return (!from || day >= from) && (!to || day <= to);
  };
  const billed = MOCK_INVOICES.filter(
    (row) =>
      row.kind !== 'packing-list' &&
      inRange(row.date) &&
      (!currency || row.currency === currency),
  );
  const orders = MOCK_WORK_ORDERS.filter((row) => inRange(row.date));
  /**
   * Money display: no currency picked → everything normalized to EGP.
   * A picked currency → invoice rows sum in that currency and the
   * EGP-stored constants (target, returns, customer balances) convert
   * through the currency's lookup rate.
   */
  const rate = listCurrencies().find((row) => row.value === currency)?.rate || 1;
  const moneyUnit: Partial<StatCardData> =
    !currency || currency === 'EGP' ? { unitKey: 'units.egp' } : { unitLabel: currency };
  const toDisplay = (egpValue: number) => (currency ? egpValue / rate : egpValue);
  const rowMoney = (amount: number, exchangeRate?: number) =>
    currency ? amount : egp(amount, exchangeRate);
  const sales = billed.reduce((sum, row) => sum + rowMoney(row.total, row.exchangeRate), 0);
  const collected = billed.reduce((sum, row) => sum + rowMoney(row.collected, row.exchangeRate), 0);
  const late = orders.filter((row) => row.status === 'late');
  const due = MOCK_CUSTOMERS.filter((row) => row.balance > 0);
  return {
    stats: [
      stat('total', 'sales.stats.totalSales', sales, 'money', { ...moneyUnit, route: '/sales', query: { tab: 'invoices' } }),
      stat('orders', 'sales.stats.ordersCount', orders.length, 'sales', { route: '/sales', query: { tab: 'workOrders' } }),
      stat('quotations', 'sales.stats.quotationsCount', MOCK_EXPORT_ORDERS.filter((row) => row.stage === 'quotation').length, 'document', {
        route: '/sales',
        query: { tab: 'exportOrders', status: 'quotation' },
      }),
      stat('invoices', 'sales.stats.invoicesCount', billed.length, 'invoice', { route: '/sales', query: { tab: 'invoices' } }),
      stat('collections', 'sales.stats.totalCollections', collected, 'bank', { ...moneyUnit, route: '/sales', query: { tab: 'statement' } }),
      stat('due', 'sales.stats.customersDue', due.reduce((sum, row) => sum + toDisplay(row.balance), 0), 'alert', {
        ...moneyUnit,
        toneToken: 'warning',
        route: '/sales',
        query: { tab: 'customers' },
      }),
      stat('inProgress', 'sales.stats.inProgress', orders.filter((row) => OPEN_WO.includes(row.status)).length, 'clock', {
        route: '/sales',
        query: { tab: 'workOrders', status: OPEN_WO.join(',') },
      }),
      stat('late', 'sales.stats.lateOrders', late.length, 'close', {
        toneToken: 'danger',
        route: '/sales',
        query: { tab: 'workOrders', status: 'late' },
      }),
      stat('target', 'sales.stats.targetPercent', Math.round((sales / toDisplay(TARGET_EGP)) * 100), 'percent', { unitKey: 'units.percent' }),
      stat('returns', 'sales.stats.returnsValue', toDisplay(RETURNS_EGP), 'return', { ...moneyUnit }),
    ],
    charts: [
      { id: 'top-customers', titleKey: 'sales.charts.topCustomers', points: ranked(billed.map((row) => [row.customerName, rowMoney(row.total, row.exchangeRate)])) },
      {
        id: 'top-items',
        titleKey: 'sales.charts.topItems',
        kind: 'columns',
        points: ranked(orders.map((row) => [row.itemName, toDisplay(row.quantityKg * (row.agreedPrice || 0) * (row.exchangeRate || 1))])),
      },
      {
        id: 'by-region',
        titleKey: 'sales.charts.byRegion',
        points: ranked(
          billed.map((row) => {
            const customer = MOCK_CUSTOMERS.find((item) => item.code === row.customerCode);
            return [customer?.region || row.customerName, rowMoney(row.total, row.exchangeRate)] as [string, number];
          }),
        ),
      },
    ],
    alerts: [
      ...late.map((row) => ({
        id: `late-${row.id}`,
        messageKey: 'sales.alerts.lateOrder',
        params: [row.number],
        severity: 'warning' as const,
        date: row.date,
        route: '/sales',
        query: { tab: 'workOrders', status: 'late' },
      })),
      ...due.slice(0, 3).map((row) => ({
        id: `due-${row.code}`,
        messageKey: 'sales.alerts.dueCollection',
        params: [row.code, row.balance],
        severity: 'info' as const,
        date: new Date().toISOString(),
        route: '/sales',
        query: { tab: 'customers', q: row.code },
      })),
    ],
  };
}
