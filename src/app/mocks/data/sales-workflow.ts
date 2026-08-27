import { ChartPoint, DashboardData, StatCardData } from '../../core/models/common.models';
import { ExportDocStage, ExportOrder, Invoice } from '../../core/models/sales.models';
import { nextGenerated } from '../../shared/crud/serial';
import { MockApiError } from '../mock-backend.interceptor';
import { MOCK_EXPORT_SHIPMENTS } from './logistics.mock';
import { MOCK_PRODUCTION_ORDERS } from './quality.mock';
import { MOCK_CUSTOMERS, MOCK_EXPORT_ORDERS, MOCK_INVOICES, MOCK_WORK_ORDERS } from './sales.mock';
import { MOCK_MOVEMENTS } from './warehouse.mock';

const TARGET_EGP = 6000000;
const RETURNS_EGP = 62000;
const OPEN_WO = ['warehouse-check', 'partially-fulfilled', 'in-production', 'ready'];

const NEXT: Record<ExportDocStage, ExportDocStage | null> = {
  quotation: 'proforma',
  'internal-approval': 'proforma',
  proforma: 'supply-order',
  'supply-order': 'warehouse',
  warehouse: 'production-scheduled',
  'production-scheduled': 'logistics',
  logistics: 'production',
  production: 'issued',
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

export function advanceExportOrder(id: string, body: unknown): ExportOrder {
  const row = MOCK_EXPORT_ORDERS.find((item) => item.id === id);
  if (!row) throw new MockApiError(404, 'not-found');
  const next = NEXT[row.stage];
  if (!next) throw new MockApiError(400, 'invalid-request');
  const patch = (body ?? {}) as Partial<ExportOrder>;
  if (next === 'warehouse') {
    row.rollsCount = Number(patch.rollsCount || row.rollsCount);
    row.containersCount = Number(patch.containersCount || row.containersCount);
    if (!row.rollsCount || !row.containersCount) throw new MockApiError(400, 'invalid-request');
  }
  if (next === 'production-scheduled') {
    row.productionDeadline = String(patch.productionDeadline || '');
    if (!row.productionDeadline) throw new MockApiError(400, 'invalid-request');
    MOCK_PRODUCTION_ORDERS.unshift({
      id: `prd-${Date.now()}`,
      number: nextGenerated(MOCK_PRODUCTION_ORDERS, 'number', 'PRD'),
      date: new Date().toISOString(),
      workOrderNumber: row.number,
      specCode: row.itemCode || '',
      specName: row.itemName || '',
      quantityKg: row.quantityKg || 0,
      producedKg: 0,
      wastePercent: 0,
      rollsTarget: row.rollsCount,
      rollsProduced: 0,
      status: 'open',
      expectedFinish: row.productionDeadline,
      autoCreated: true,
    });
  }
  if (next === 'logistics') {
    row.loadingDate = String(patch.loadingDate || '');
    if (!row.loadingDate) throw new MockApiError(400, 'invalid-request');
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
  }
  row.stage = next;
  return row;
}

export function createExportQuotation(body: unknown): ExportOrder {
  const incoming = body as Partial<ExportOrder>;
  const customer = MOCK_CUSTOMERS.find((row) => row.code === incoming.customerCode);
  if (!customer || !incoming.itemName) throw new MockApiError(400, 'invalid-request');
  const row: ExportOrder = {
    id: `eo-${Date.now()}`,
    number: nextGenerated(MOCK_EXPORT_ORDERS, 'number', 'EXP'),
    customerCode: customer.code,
    customerName: customer.name,
    stage: 'supply-order',
    itemCode: incoming.itemCode || '',
    itemName: incoming.itemName,
    quantityKg: Number(incoming.quantityKg || 0),
    rollsCount: 0,
    containersCount: 0,
    totalUsd: Number(incoming.totalUsd || 0),
  };
  MOCK_EXPORT_ORDERS.unshift(row);
  return row;
}

export function salesDashboard(): DashboardData {
  const billed = MOCK_INVOICES.filter((row) => row.kind !== 'packing-list');
  const sales = billed.reduce((sum, row) => sum + egp(row.total, row.exchangeRate), 0);
  const collected = billed.reduce((sum, row) => sum + egp(row.collected, row.exchangeRate), 0);
  const late = MOCK_WORK_ORDERS.filter((row) => row.status === 'late');
  const due = MOCK_CUSTOMERS.filter((row) => row.balance > 0);
  return {
    stats: [
      stat('total', 'sales.stats.totalSales', sales, 'money', { unitKey: 'units.egp', route: '/sales', query: { tab: 'invoices' } }),
      stat('orders', 'sales.stats.ordersCount', MOCK_WORK_ORDERS.length, 'sales', { route: '/sales', query: { tab: 'workOrders' } }),
      stat('quotations', 'sales.stats.quotationsCount', MOCK_EXPORT_ORDERS.filter((row) => row.stage === 'quotation').length, 'document', {
        route: '/sales',
        query: { tab: 'exportOrders', status: 'quotation' },
      }),
      stat('invoices', 'sales.stats.invoicesCount', billed.length, 'invoice', { route: '/sales', query: { tab: 'invoices' } }),
      stat('collections', 'sales.stats.totalCollections', collected, 'bank', { unitKey: 'units.egp', route: '/sales', query: { tab: 'statement' } }),
      stat('due', 'sales.stats.customersDue', due.reduce((sum, row) => sum + row.balance, 0), 'alert', {
        unitKey: 'units.egp',
        toneToken: 'warning',
        route: '/sales',
        query: { tab: 'customers' },
      }),
      stat('inProgress', 'sales.stats.inProgress', MOCK_WORK_ORDERS.filter((row) => OPEN_WO.includes(row.status)).length, 'clock', {
        route: '/sales',
        query: { tab: 'workOrders', status: OPEN_WO.join(',') },
      }),
      stat('late', 'sales.stats.lateOrders', late.length, 'close', {
        toneToken: 'danger',
        route: '/sales',
        query: { tab: 'workOrders', status: 'late' },
      }),
      stat('target', 'sales.stats.targetPercent', Math.round((sales / TARGET_EGP) * 100), 'percent', { unitKey: 'units.percent' }),
      stat('returns', 'sales.stats.returnsValue', RETURNS_EGP, 'return', { unitKey: 'units.egp' }),
    ],
    charts: [
      { id: 'top-customers', titleKey: 'sales.charts.topCustomers', points: ranked(billed.map((row) => [row.customerName, egp(row.total, row.exchangeRate)])) },
      {
        id: 'top-items',
        titleKey: 'sales.charts.topItems',
        kind: 'columns',
        points: ranked(MOCK_WORK_ORDERS.map((row) => [row.itemName, row.quantityKg * (row.agreedPrice || 0) * (row.exchangeRate || 1)])),
      },
      {
        id: 'by-region',
        titleKey: 'sales.charts.byRegion',
        points: ranked(
          billed.map((row) => {
            const customer = MOCK_CUSTOMERS.find((item) => item.code === row.customerCode);
            return [customer?.region || row.customerName, egp(row.total, row.exchangeRate)] as [string, number];
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
