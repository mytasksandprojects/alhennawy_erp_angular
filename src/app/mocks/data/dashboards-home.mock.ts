import { DashboardData, StatCardData } from '../../core/models/common.models';

/** MOCK LAYER — the cross-department home dashboard. */
const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const HOME_DASHBOARD: DashboardData = {
  stats: [
    stat('sales', 'home.stats.monthSales', 5230000, 'sales', { unitKey: 'units.egp', trendPercent: 11 }),
    stat('production', 'home.stats.monthProduction', 186000, 'production', { unitKey: 'units.kg', trendPercent: 4 }),
    stat('weighings', 'home.stats.todayWeighings', 18, 'scale'),
    stat('stockValue', 'home.stats.stockValue', 11616000, 'warehouse', { unitKey: 'units.egp' }),
    stat('openImports', 'home.stats.openImports', 2, 'inbox'),
    stat('openExports', 'home.stats.openExports', 2, 'outbox'),
    stat('employees', 'home.stats.presentToday', 201, 'hr'),
    stat('alerts', 'home.stats.activeAlerts', 7, 'alert', { toneToken: 'warning' }),
  ],
  charts: [
    {
      id: 'sales-vs-production',
      titleKey: 'home.charts.monthlyProduction',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 171000 }, { labelKey: 'months.apr', value: 158000 },
        { labelKey: 'months.may', value: 176000 }, { labelKey: 'months.jun', value: 169000 },
        { labelKey: 'months.jul', value: 181000 }, { labelKey: 'months.aug', value: 186000 },
      ],
    },
    {
      id: 'monthly-sales',
      titleKey: 'home.charts.monthlySales',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 4620000 }, { labelKey: 'months.apr', value: 4180000 },
        { labelKey: 'months.may', value: 4950000 }, { labelKey: 'months.jun', value: 4470000 },
        { labelKey: 'months.jul', value: 5510000 }, { labelKey: 'months.aug', value: 5230000 },
      ],
    },
    {
      id: 'sales-by-region',
      titleKey: 'sales.charts.byRegion',
      kind: 'donut',
      points: [
        { label: 'القاهرة', value: 1900000 }, { label: 'الجيزة', value: 1450000 },
        { label: 'الإسكندرية', value: 830000 }, { label: 'Export', value: 1050000 },
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
    {
      // Sums to the "stock value" stat card (11,616,000 EGP).
      id: 'stock-by-kind',
      titleKey: 'home.charts.stockByKind',
      kind: 'donut',
      points: [
        { labelKey: 'warehouse.kinds.dasht-raw', value: 5200000 },
        { labelKey: 'warehouse.kinds.finished-first', value: 3150000 },
        { labelKey: 'warehouse.kinds.finished-second', value: 1240000 },
        { labelKey: 'warehouse.kinds.chemicals', value: 1180000 },
        { labelKey: 'warehouse.kinds.spare-parts', value: 520000 },
        { labelKey: 'warehouse.kinds.grease-oils', value: 326000 },
      ],
    },
    {
      id: 'weighbridge-week',
      titleKey: 'home.charts.weighbridgeWeek',
      kind: 'columns',
      points: [
        { labelKey: 'days.sat', value: 148000 }, { labelKey: 'days.sun', value: 132000 },
        { labelKey: 'days.mon', value: 156000 }, { labelKey: 'days.tue', value: 141000 },
        { labelKey: 'days.wed', value: 162000 }, { labelKey: 'days.thu', value: 149000 },
      ],
    },
  ],
  alerts: [
    { id: 'ho-1', messageKey: 'weighbridge.alerts.overdueSecond', params: [3020, 'م ص ر 1188'], severity: 'warning', date: daysAgo(0) },
    { id: 'ho-2', messageKey: 'warehouse.alerts.belowMinimum', params: ['CHM-011'], severity: 'danger', date: daysAgo(0) },
    { id: 'ho-3', messageKey: 'administration.alerts.insuranceExpired', params: ['م ص ر 1188'], severity: 'danger', date: daysAgo(0) },
  ],
};
