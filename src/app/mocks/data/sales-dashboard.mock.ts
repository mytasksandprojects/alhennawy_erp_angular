import { ChartPoint, DashboardData, StatCardData } from '../../core/models/common.models';
import { listCurrencies } from './lookups.mock';
import {
  MOCK_CUSTOMERS,
  MOCK_EXPORT_ORDERS,
  MOCK_INVOICES,
  MOCK_WORK_ORDERS,
} from './sales.mock';

const TARGET_EGP = 6000000;
const RETURNS_EGP = 62000;
const OPEN_WO = ['warehouse-check', 'partially-fulfilled', 'in-production', 'ready'];

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
