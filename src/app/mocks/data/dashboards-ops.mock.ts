import { DashboardData, StatCardData } from '../../core/models/common.models';

/** MOCK LAYER — operational dashboards (weighbridge, warehouse, quality, production). */
const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const WEIGHBRIDGE_DASHBOARD: DashboardData = {
  stats: [
    stat('daily', 'weighbridge.stats.dailyOperations', 18, 'scale', { trendPercent: 12 }),
    stat('net', 'weighbridge.stats.totalNet', 214300, 'weight', { unitKey: 'units.kg' }),
    stat('purchases', 'weighbridge.stats.purchases', 7, 'purchasing'),
    stat('sales', 'weighbridge.stats.sales', 6, 'sales'),
    stat('returns', 'weighbridge.stats.returns', 2, 'return'),
    stat('transfers', 'weighbridge.stats.transfers', 3, 'transfer'),
    stat('incomplete', 'weighbridge.stats.incomplete', 1, 'clock', { toneToken: 'warning' }),
    stat('avgTime', 'weighbridge.stats.avgCompletionMinutes', 42, 'timer', { unitKey: 'units.minute' }),
  ],
  charts: [
    {
      id: 'weekly-net',
      titleKey: 'weighbridge.charts.weeklyNet',
      points: [
        { labelKey: 'days.sat', value: 182000 }, { labelKey: 'days.sun', value: 205000 },
        { labelKey: 'days.mon', value: 168000 }, { labelKey: 'days.tue', value: 231000 },
        { labelKey: 'days.wed', value: 197000 }, { labelKey: 'days.thu', value: 214300 },
      ],
    },
  ],
  alerts: [
    { id: 'wa-1', messageKey: 'weighbridge.alerts.overdueSecond', params: [3020, 'م ص ر 1188'], severity: 'warning', date: daysAgo(0) },
    { id: 'wa-2', messageKey: 'weighbridge.alerts.abnormalDiff', params: [3012, 18], severity: 'danger', date: daysAgo(3) },
  ],
};

export const WAREHOUSE_DASHBOARD: DashboardData = {
  stats: [
    stat('value', 'warehouse.stats.totalValue', 11616000, 'money', { unitKey: 'units.egp' }),
    stat('items', 'warehouse.stats.itemsCount', 499, 'items'),
    stat('warehouses', 'warehouse.stats.warehousesCount', 7, 'warehouse'),
    stat('receipts', 'warehouse.stats.receipts', 42, 'inbox', { trendPercent: 6 }),
    stat('issues', 'warehouse.stats.issues', 57, 'outbox', { trendPercent: -3 }),
    stat('transfers', 'warehouse.stats.transfers', 11, 'transfer'),
    stat('belowMin', 'warehouse.stats.belowMinimum', 4, 'alert', { toneToken: 'danger' }),
    stat('outOfStock', 'warehouse.stats.outOfStock', 2, 'empty', { toneToken: 'warning' }),
  ],
  charts: [
    {
      id: 'occupancy',
      titleKey: 'warehouse.charts.occupancy',
      points: [
        { labelKey: 'warehouse.names.dashtRaw', value: 81 },
        { labelKey: 'warehouse.names.spareParts', value: 62 },
        { labelKey: 'warehouse.names.finishedFirst', value: 57 },
        { labelKey: 'warehouse.names.chemicals', value: 48 },
        { labelKey: 'warehouse.names.greaseOils', value: 35 },
        { labelKey: 'warehouse.names.finishedSecond', value: 22 },
      ],
    },
  ],
  alerts: [
    { id: 'wha-1', messageKey: 'warehouse.alerts.belowMinimum', params: ['CHM-011'], severity: 'danger', date: daysAgo(0) },
    { id: 'wha-2', messageKey: 'warehouse.alerts.belowMinimum', params: ['SPR-318'], severity: 'warning', date: daysAgo(1) },
  ],
};

export const QUALITY_DASHBOARD: DashboardData = {
  stats: [
    stat('inspections', 'quality.stats.dailyInspections', 9, 'quality'),
    stat('accepted', 'quality.stats.accepted', 7, 'check', { toneToken: 'success' }),
    stat('rejected', 'quality.stats.rejected', 2, 'close', { toneToken: 'danger' }),
    stat('acceptRate', 'quality.stats.acceptanceRate', 78, 'percent', { unitKey: 'units.percent' }),
    stat('secondGrade', 'quality.stats.secondGrade', 14, 'grade'),
    stat('chemCost', 'quality.stats.chemicalsDailyCost', 13395, 'chemistry', { unitKey: 'units.egp' }),
    stat('ncr', 'quality.stats.openNonConformities', 3, 'alert', { toneToken: 'warning' }),
    stat('certificates', 'quality.stats.certificatesIssued', 12, 'certificate'),
  ],
  charts: [
    {
      id: 'accept-reject',
      titleKey: 'quality.charts.acceptReject',
      points: [
        { labelKey: 'days.sat', value: 82 }, { labelKey: 'days.sun', value: 91 },
        { labelKey: 'days.mon', value: 75 }, { labelKey: 'days.tue', value: 88 },
        { labelKey: 'days.wed', value: 79 }, { labelKey: 'days.thu', value: 78 },
      ],
    },
  ],
  alerts: [
    { id: 'qa-1', messageKey: 'quality.alerts.rejectedBatch', params: ['CHM-2026-19'], severity: 'danger', date: daysAgo(2) },
  ],
};

export const PRODUCTION_DASHBOARD: DashboardData = {
  stats: [
    stat('open', 'production.stats.openOrders', 2, 'production'),
    stat('completed', 'production.stats.completedOrders', 14, 'check', { toneToken: 'success' }),
    stat('produced', 'production.stats.totalProduced', 52100, 'weight', { unitKey: 'units.kg' }),
    stat('daily', 'production.stats.dailyOutput', 8100, 'chart', { unitKey: 'units.kg', trendPercent: 4 }),
    stat('rawConsumption', 'production.stats.rawConsumption', 9400, 'items', { unitKey: 'units.kg' }),
    stat('waste', 'production.stats.wastePercent', 3.1, 'percent', { unitKey: 'units.percent' }),
    stat('downtime', 'production.stats.downtimeHours', 4, 'timer', { unitKey: 'units.hour', toneToken: 'warning' }),
    stat('avgLead', 'production.stats.avgOrderDays', 3.2, 'calendar', { unitKey: 'units.day' }),
  ],
  charts: [
    {
      id: 'daily-output',
      titleKey: 'production.charts.dailyOutput',
      points: [
        { labelKey: 'days.sat', value: 7200 }, { labelKey: 'days.sun', value: 7900 },
        { labelKey: 'days.mon', value: 6800 }, { labelKey: 'days.tue', value: 8400 },
        { labelKey: 'days.wed', value: 7600 }, { labelKey: 'days.thu', value: 8100 },
      ],
    },
  ],
  alerts: [
    { id: 'pa-1', messageKey: 'production.alerts.lateOrder', params: ['PRD-2026-0221'], severity: 'warning', date: daysAgo(0) },
  ],
};
