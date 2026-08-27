import { ChartPoint, DashboardData, StatCardData } from '../../core/models/common.models';
import { PurchaseOrder, PurchaseRequest, SupplierQuotation } from '../../core/models/purchasing.models';
import { nextGenerated } from '../../shared/crud/serial';
import { MockApiError } from '../mock-backend.interceptor';
import {
  listPurchaseRequests,
  MOCK_PURCHASE_ORDERS,
  MOCK_PURCHASE_REQUESTS,
  MOCK_QUOTATIONS,
  MOCK_SUPPLIERS,
} from './purchasing.mock';
import { MOCK_STOCK_ITEMS } from './warehouse.mock';

const RETURNS_EGP = 84000;

const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const egpOf = (row: { totalValue: number; exchangeRate?: number }) =>
  row.totalValue * (row.exchangeRate || 1);

function ranked(pairs: [string, number][]): ChartPoint[] {
  const totals = new Map<string, number>();
  for (const [label, value] of pairs) totals.set(label, (totals.get(label) ?? 0) + value);
  return [...totals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));
}

function lineCost(itemCode: string, itemName: string, quantity: number): number {
  const item = MOCK_STOCK_ITEMS.find((row) => row.code === itemCode || row.name === itemName);
  return quantity * (item?.unitCost ?? 0);
}

export function approvePurchaseRequest(id: string): PurchaseRequest {
  const row = MOCK_PURCHASE_REQUESTS.find((item) => item.id === id);
  if (!row) throw new MockApiError(404, 'not-found');
  if (row.status === 'rejected' || row.status === 'ordered') {
    throw new MockApiError(400, 'invalid-request');
  }
  row.status = 'approved';
  return listPurchaseRequests().find((item) => item.id === id) as PurchaseRequest;
}

export function selectQuotation(id: string): SupplierQuotation {
  const quote = MOCK_QUOTATIONS.find((item) => item.id === id);
  if (!quote) throw new MockApiError(404, 'not-found');
  for (const row of MOCK_QUOTATIONS) {
    if (row.requestId === quote.requestId) row.selected = row.id === id;
  }
  const request = MOCK_PURCHASE_REQUESTS.find((item) => item.id === quote.requestId);
  if (request && request.status === 'pending') request.status = 'approved';
  return quote;
}

export function issuePurchaseOrder(requestId: string): PurchaseOrder {
  const request = MOCK_PURCHASE_REQUESTS.find((item) => item.id === requestId);
  if (!request) throw new MockApiError(404, 'not-found');
  const quote = MOCK_QUOTATIONS.find((item) => item.requestId === requestId && item.selected);
  if (!quote || request.status === 'rejected' || request.status === 'ordered') {
    throw new MockApiError(400, 'invalid-request');
  }
  const order: PurchaseOrder = {
    id: `po-${Date.now()}`,
    number: nextGenerated(MOCK_PURCHASE_ORDERS, 'number', 'PO'),
    date: new Date().toISOString(),
    supplierCode: quote.supplierCode,
    supplierName: quote.supplierName,
    status: 'open',
    currency: quote.currency,
    exchangeRate: quote.exchangeRate,
    totalValue: quote.totalValue,
    expectedDelivery: new Date(Date.now() + quote.deliveryDays * 86400000).toISOString(),
    leadTimeDays: quote.deliveryDays,
    requestId: request.id,
  };
  MOCK_PURCHASE_ORDERS.unshift(order);
  request.status = 'ordered';
  return order;
}

export function purchasingDashboard(): DashboardData {
  const orders = MOCK_PURCHASE_ORDERS;
  const leads = orders.map((row) => row.leadTimeDays).filter((value): value is number => value != null);
  const onTime =
    MOCK_SUPPLIERS.reduce((sum, row) => sum + row.onTimeDeliveryPercent, 0) / MOCK_SUPPLIERS.length;
  const late = orders.filter((row) => row.status === 'late');
  return {
    stats: [
      stat('total', 'purchasing.stats.totalValue', orders.reduce((sum, row) => sum + egpOf(row), 0), 'money', {
        unitKey: 'units.egp',
        route: '/purchasing',
        query: { tab: 'orders' },
      }),
      stat('requests', 'purchasing.stats.requestsCount', MOCK_PURCHASE_REQUESTS.length, 'document', {
        route: '/purchasing',
        query: { tab: 'requests' },
      }),
      stat('orders', 'purchasing.stats.ordersCount', orders.length, 'purchasing', {
        route: '/purchasing',
        query: { tab: 'orders' },
      }),
      stat('open', 'purchasing.stats.openOrders', orders.filter((row) => row.status === 'open' || row.status === 'partially-received').length, 'clock', {
        route: '/purchasing',
        query: { tab: 'orders', status: 'open,partially-received' },
      }),
      stat('late', 'purchasing.stats.lateOrders', late.length, 'alert', {
        toneToken: 'danger',
        route: '/purchasing',
        query: { tab: 'orders', status: 'late' },
      }),
      stat('leadTime', 'purchasing.stats.avgLeadDays', leads.length ? leads.reduce((sum, value) => sum + value, 0) / leads.length : 0, 'timer', {
        unitKey: 'units.day',
        route: '/purchasing',
        query: { tab: 'orders' },
      }),
      stat('returns', 'purchasing.stats.returnsValue', RETURNS_EGP, 'return', {
        unitKey: 'units.egp',
        route: '/purchasing',
        query: { tab: 'orders' },
      }),
      stat('onTime', 'purchasing.stats.onTimePercent', Math.round(onTime), 'percent', {
        unitKey: 'units.percent',
        toneToken: 'success',
        route: '/purchasing',
        query: { tab: 'suppliers' },
      }),
    ],
    charts: [
      {
        id: 'top-suppliers',
        titleKey: 'purchasing.charts.topSuppliers',
        points: ranked(orders.map((row) => [row.supplierName, egpOf(row)])),
      },
      {
        id: 'top-items',
        titleKey: 'purchasing.charts.topItems',
        kind: 'columns',
        points: ranked(
          MOCK_PURCHASE_REQUESTS.flatMap((row) =>
            row.lines.map((line) => [line.itemName, lineCost(line.itemCode, line.itemName, line.quantity)] as [string, number]),
          ),
        ),
      },
    ],
    alerts: late.map((row) => ({
      id: `late-${row.id}`,
      messageKey: 'purchasing.alerts.lateOrder',
      params: [row.number],
      severity: 'danger' as const,
      date: row.expectedDelivery,
      route: '/purchasing',
      query: { tab: 'orders', q: row.number },
    })),
  };
}
