import { DashboardData, StatCardData } from '../../core/models/common.models';

/** MOCK LAYER — Reports Center executive dashboard (same factory figures as home). */
const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const REPORTS_DASHBOARD: DashboardData = {
  stats: [
    stat('sales', 'home.stats.monthSales', 5230000, 'sales', {
      unitKey: 'units.egp',
      trendPercent: 11,
      route: '/reports',
      query: { tab: 'invoices' },
    }),
    stat('production', 'home.stats.monthProduction', 186000, 'production', {
      unitKey: 'units.kg',
      trendPercent: 4,
      route: '/reports',
      query: { tab: 'productionOrders' },
    }),
    stat('invoices', 'sales.stats.invoicesCount', 31, 'invoice', {
      route: '/reports',
      query: { tab: 'invoices' },
    }),
    stat('orders', 'sales.stats.ordersCount', 38, 'sales', {
      route: '/reports',
      query: { tab: 'workOrders' },
    }),
    stat('stock', 'home.stats.stockValue', 11616000, 'warehouse', {
      unitKey: 'units.egp',
      route: '/reports',
      query: { tab: 'stockItems' },
    }),
    stat('profit', 'finance.stats.netProfit', 6170000, 'chart', {
      unitKey: 'units.egp',
      trendPercent: 14,
      route: '/reports',
      query: { tab: 'journal' },
    }),
    stat('people', 'home.stats.presentToday', 201, 'hr', {
      route: '/reports',
      query: { tab: 'attendance' },
    }),
    stat('alerts', 'home.stats.activeAlerts', 3, 'alert', {
      toneToken: 'warning',
      route: '/alerts',
    }),
  ],
  charts: [
    {
      id: 'monthly-sales',
      titleKey: 'home.charts.monthlySales',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 4620000 },
        { labelKey: 'months.apr', value: 4180000 },
        { labelKey: 'months.may', value: 4950000 },
        { labelKey: 'months.jun', value: 4470000 },
        { labelKey: 'months.jul', value: 5510000 },
        { labelKey: 'months.aug', value: 5230000 },
      ],
    },
    {
      id: 'monthly-production',
      titleKey: 'home.charts.monthlyProduction',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 171000 },
        { labelKey: 'months.apr', value: 158000 },
        { labelKey: 'months.may', value: 176000 },
        { labelKey: 'months.jun', value: 169000 },
        { labelKey: 'months.jul', value: 181000 },
        { labelKey: 'months.aug', value: 186000 },
      ],
    },
    {
      id: 'by-area',
      titleKey: 'reports.charts.byArea',
      kind: 'donut',
      points: [
        { labelKey: 'reports.categories.commercial', value: 8 },
        { labelKey: 'reports.categories.operations', value: 11 },
        { labelKey: 'reports.categories.finance', value: 3 },
        { labelKey: 'reports.categories.people', value: 6 },
        { labelKey: 'reports.categories.facility', value: 10 },
        { labelKey: 'reports.categories.chemicals', value: 4 },
      ],
    },
    {
      id: 'by-region',
      titleKey: 'sales.charts.byRegion',
      kind: 'donut',
      points: [
        { label: 'القاهرة', value: 1900000 },
        { label: 'الجيزة', value: 1450000 },
        { label: 'الإسكندرية', value: 830000 },
        { label: 'Export', value: 1050000 },
      ],
    },
    {
      id: 'top-customers',
      titleKey: 'home.charts.topCustomers',
      points: [
        { label: 'شركة الورق الحديثة', value: 1420000 },
        { label: 'مصنع الأمل للتغليف', value: 980000 },
        { label: 'Jordan Paper Mills', value: 860000 },
        { label: 'الشركة المصرية للكرتون', value: 710000 },
      ],
    },
  ],
  alerts: [
    {
      id: 'rp-1',
      messageKey: 'sales.alerts.dueCollection',
      params: ['CUS-009', 200000],
      severity: 'info',
      date: daysAgo(1),
      route: '/reports',
      query: { tab: 'customers' },
    },
    {
      id: 'rp-2',
      messageKey: 'warehouse.alerts.belowMinimum',
      params: ['CHM-011'],
      severity: 'danger',
      date: daysAgo(0),
      route: '/reports',
      query: { tab: 'stockItems' },
    },
  ],
};
