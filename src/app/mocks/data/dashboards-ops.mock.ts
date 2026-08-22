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
    stat('daily', 'weighbridge.stats.dailyOperations', 18, 'scale', { trendPercent: 12, route: '/weighbridge', fragment: 'tickets' }),
    stat('net', 'weighbridge.stats.totalNet', 214300, 'weight', { unitKey: 'units.kg', route: '/weighbridge', fragment: 'tickets' }),
    stat('purchases', 'weighbridge.stats.purchases', 7, 'purchasing', { route: '/weighbridge', query: { type: 'purchase' }, fragment: 'tickets' }),
    stat('sales', 'weighbridge.stats.sales', 6, 'sales', { route: '/weighbridge', query: { type: 'sales' }, fragment: 'tickets' }),
    stat('returns', 'weighbridge.stats.returns', 2, 'return', { route: '/weighbridge', query: { type: 'returns' }, fragment: 'tickets' }),
    stat('transfers', 'weighbridge.stats.transfers', 3, 'transfer', { route: '/weighbridge', query: { type: 'internal-transfer' }, fragment: 'tickets' }),
    stat('incomplete', 'weighbridge.stats.incomplete', 1, 'clock', { toneToken: 'warning', route: '/weighbridge', query: { status: 'first-done' }, fragment: 'tickets' }),
    stat('avgTime', 'weighbridge.stats.avgCompletionMinutes', 42, 'timer', { unitKey: 'units.minute', route: '/weighbridge', fragment: 'tickets' }),
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
    { id: 'wa-1', messageKey: 'weighbridge.alerts.overdueSecond', params: [3020, 'م ص ر 1188'], severity: 'warning', date: daysAgo(0), route: '/weighbridge', query: { status: 'first-done', q: '3020' }, fragment: 'tickets' },
    { id: 'wa-2', messageKey: 'weighbridge.alerts.abnormalDiff', params: [3018, 18], severity: 'danger', date: daysAgo(3), route: '/weighbridge', query: { q: '3018' }, fragment: 'tickets' },
  ],
};

export const WAREHOUSE_DASHBOARD: DashboardData = {
  stats: [
    stat('value', 'warehouse.stats.totalValue', 11616000, 'money', { unitKey: 'units.egp', route: '/warehouse', query: { tab: 'items' } }),
    stat('items', 'warehouse.stats.itemsCount', 499, 'items', { route: '/warehouse', query: { tab: 'items' } }),
    stat('warehouses', 'warehouse.stats.warehousesCount', 7, 'warehouse', { route: '/warehouse', query: { tab: 'warehouses' } }),
    stat('receipts', 'warehouse.stats.receipts', 42, 'inbox', { trendPercent: 6, route: '/warehouse', query: { tab: 'receipts' } }),
    stat('issues', 'warehouse.stats.issues', 57, 'outbox', { trendPercent: -3, route: '/warehouse', query: { tab: 'movements' } }),
    stat('transfers', 'warehouse.stats.transfers', 11, 'transfer', { route: '/warehouse', query: { tab: 'movements' } }),
    stat('belowMin', 'warehouse.stats.belowMinimum', 4, 'alert', { toneToken: 'danger', route: '/warehouse', query: { tab: 'items', stock: 'below' } }),
    stat('outOfStock', 'warehouse.stats.outOfStock', 2, 'empty', { toneToken: 'warning', route: '/warehouse', query: { tab: 'items', stock: 'out' } }),
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
    { id: 'wha-1', messageKey: 'warehouse.alerts.belowMinimum', params: ['CHM-011'], severity: 'danger', date: daysAgo(0), route: '/warehouse', query: { tab: 'items', stock: 'below', q: 'CHM-011' } },
    { id: 'wha-2', messageKey: 'warehouse.alerts.belowMinimum', params: ['SPR-318'], severity: 'warning', date: daysAgo(1), route: '/warehouse', query: { tab: 'items', stock: 'below', q: 'SPR-318' } },
  ],
};

export const QUALITY_DASHBOARD: DashboardData = {
  stats: [
    stat('inspections', 'quality.stats.dailyInspections', 9, 'quality', { route: '/quality', query: { tab: 'dasht' } }),
    stat('accepted', 'quality.stats.accepted', 7, 'check', { toneToken: 'success', route: '/quality', query: { tab: 'dasht' } }),
    stat('rejected', 'quality.stats.rejected', 2, 'close', { toneToken: 'danger', route: '/quality', query: { tab: 'dasht' } }),
    stat('acceptRate', 'quality.stats.acceptanceRate', 78, 'percent', { unitKey: 'units.percent', route: '/quality', query: { tab: 'dasht' } }),
    stat('secondGrade', 'quality.stats.secondGrade', 14, 'grade', { route: '/quality', query: { tab: 'dasht' } }),
    stat('chemCost', 'quality.stats.chemicalsDailyCost', 13395, 'chemistry', { unitKey: 'units.egp', route: '/quality', query: { tab: 'chemicals' } }),
    stat('ncr', 'quality.stats.openNonConformities', 3, 'alert', { toneToken: 'warning', route: '/quality', query: { tab: 'materials' } }),
    stat('certificates', 'quality.stats.certificatesIssued', 12, 'certificate', { route: '/safety', query: { tab: 'certificates' } }),
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
    { id: 'qa-1', messageKey: 'quality.alerts.rejectedBatch', params: ['CHM-2026-19'], severity: 'danger', date: daysAgo(2), route: '/quality', query: { tab: 'materials', q: 'CHM-2026-19' } },
  ],
};

export const PRODUCTION_DASHBOARD: DashboardData = {
  stats: [
    stat('open', 'production.stats.openOrders', 2, 'production', { route: '/production', query: { tab: 'orders' } }),
    stat('completed', 'production.stats.completedOrders', 14, 'check', { toneToken: 'success', route: '/production', query: { tab: 'orders' } }),
    stat('produced', 'production.stats.totalProduced', 52100, 'weight', { unitKey: 'units.kg', route: '/production', query: { tab: 'orders' } }),
    stat('daily', 'production.stats.dailyOutput', 8100, 'chart', { unitKey: 'units.kg', trendPercent: 4, route: '/production', query: { tab: 'orders' } }),
    stat('rawConsumption', 'production.stats.rawConsumption', 9400, 'items', { unitKey: 'units.kg', route: '/production', query: { tab: 'orders' } }),
    stat('waste', 'production.stats.wastePercent', 3.1, 'percent', { unitKey: 'units.percent', route: '/production', query: { tab: 'orders' } }),
    stat('downtime', 'production.stats.downtimeHours', 4, 'timer', { unitKey: 'units.hour', toneToken: 'warning', route: '/quality', query: { tab: 'maintenance' } }),
    stat('avgLead', 'production.stats.avgOrderDays', 3.2, 'calendar', { unitKey: 'units.day', route: '/production', query: { tab: 'orders' } }),
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
    { id: 'pa-1', messageKey: 'production.alerts.lateOrder', params: ['PRD-2026-0221'], severity: 'warning', date: daysAgo(0), route: '/production', query: { tab: 'orders', q: 'PRD-2026-0221' } },
  ],
};
