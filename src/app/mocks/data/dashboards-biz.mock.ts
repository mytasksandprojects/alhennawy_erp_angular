import { DashboardData, StatCardData } from '../../core/models/common.models';

/** MOCK LAYER — business dashboards (finance, sales, purchasing, logistics, hr, administration, home). */
const stat = (
  id: string,
  labelKey: string,
  value: number,
  icon: string,
  extra?: Partial<StatCardData>,
): StatCardData => ({ id, labelKey, value, icon, ...extra });

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const FINANCE_DASHBOARD: DashboardData = {
  stats: [
    stat('revenue', 'finance.stats.totalRevenue', 18450000, 'money', { unitKey: 'units.egp', trendPercent: 9 }),
    stat('expenses', 'finance.stats.totalExpenses', 12280000, 'expense', { unitKey: 'units.egp', trendPercent: 5 }),
    stat('netProfit', 'finance.stats.netProfit', 6170000, 'chart', { unitKey: 'units.egp', toneToken: 'success', trendPercent: 14 }),
    stat('customersBalance', 'finance.stats.customersBalance', 1166700, 'customers', { unitKey: 'units.egp' }),
    stat('suppliersBalance', 'finance.stats.suppliersBalance', 862500, 'purchasing', { unitKey: 'units.egp' }),
    stat('cash', 'finance.stats.cashAndBanks', 7110000, 'bank', { unitKey: 'units.egp' }),
    stat('receivables', 'finance.stats.dueReceivables', 685000, 'inbox', { unitKey: 'units.egp', toneToken: 'warning' }),
    stat('payables', 'finance.stats.duePayables', 402000, 'outbox', { unitKey: 'units.egp', toneToken: 'warning' }),
  ],
  charts: [
    {
      id: 'cashflow',
      titleKey: 'finance.charts.cashflow',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 2100000 }, { labelKey: 'months.apr', value: 1850000 },
        { labelKey: 'months.may', value: 2420000 }, { labelKey: 'months.jun', value: 1980000 },
        { labelKey: 'months.jul', value: 2650000 }, { labelKey: 'months.aug', value: 2210000 },
      ],
    },
    {
      id: 'net-profit',
      titleKey: 'finance.charts.monthlyNetProfit',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 890000 }, { labelKey: 'months.apr', value: 760000 },
        { labelKey: 'months.may', value: 1120000 }, { labelKey: 'months.jun', value: 940000 },
        { labelKey: 'months.jul', value: 1290000 }, { labelKey: 'months.aug', value: 1170000 },
      ],
    },
    {
      id: 'expense-breakdown',
      titleKey: 'finance.charts.expenseBreakdown',
      kind: 'donut',
      points: [
        { labelKey: 'finance.expenseCategories.rawMaterials', value: 6200000 },
        { labelKey: 'finance.expenseCategories.salaries', value: 2750000 },
        { labelKey: 'finance.expenseCategories.energy', value: 1480000 },
        { labelKey: 'finance.expenseCategories.maintenance', value: 720000 },
        { labelKey: 'finance.expenseCategories.logistics', value: 640000 },
        { labelKey: 'finance.expenseCategories.other', value: 490000 },
      ],
    },
    {
      id: 'revenue-sources',
      titleKey: 'finance.charts.revenueSources',
      kind: 'donut',
      points: [
        { labelKey: 'finance.revenueSources.local', value: 11350000 },
        { labelKey: 'finance.revenueSources.export', value: 6480000 },
        { labelKey: 'finance.revenueSources.misc', value: 620000 },
      ],
    },
    {
      id: 'cost-centers',
      titleKey: 'finance.charts.expensesByCostCenter',
      points: [
        { labelKey: 'departments.production', value: 7400000 },
        { labelKey: 'departments.logistics', value: 1900000 },
        { labelKey: 'departments.administration', value: 1650000 },
        { labelKey: 'departments.sales', value: 1330000 },
      ],
    },
  ],
  alerts: [
    { id: 'fa-1', messageKey: 'finance.alerts.duePayment', params: ['SUP-002', 126000], severity: 'warning', date: daysAgo(0) },
    { id: 'fa-2', messageKey: 'finance.alerts.dueCollection', params: ['CUS-014', 199375], severity: 'info', date: daysAgo(0) },
  ],
};

export const SALES_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'sales.stats.totalSales', 5230000, 'money', { unitKey: 'units.egp', trendPercent: 11 }),
    stat('orders', 'sales.stats.ordersCount', 38, 'sales'),
    stat('quotations', 'sales.stats.quotationsCount', 12, 'document'),
    stat('invoices', 'sales.stats.invoicesCount', 31, 'invoice'),
    stat('collections', 'sales.stats.totalCollections', 3890000, 'bank', { unitKey: 'units.egp' }),
    stat('due', 'sales.stats.customersDue', 1166700, 'alert', { unitKey: 'units.egp', toneToken: 'warning' }),
    stat('inProgress', 'sales.stats.inProgress', 5, 'clock'),
    stat('late', 'sales.stats.lateOrders', 1, 'close', { toneToken: 'danger' }),
  ],
  charts: [
    {
      id: 'by-region',
      titleKey: 'sales.charts.byRegion',
      points: [
        { label: 'القاهرة', value: 1900000 }, { label: 'الجيزة', value: 1450000 },
        { label: 'الإسكندرية', value: 830000 }, { label: 'Export', value: 1050000 },
      ],
    },
  ],
  alerts: [
    { id: 'sa-1', messageKey: 'sales.alerts.lateOrder', params: ['SO-2026-0120'], severity: 'warning', date: daysAgo(0) },
    { id: 'sa-2', messageKey: 'sales.alerts.dueCollection', params: ['CUS-009', 200000], severity: 'info', date: daysAgo(1) },
  ],
};

export const PURCHASING_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'purchasing.stats.totalValue', 3820000, 'money', { unitKey: 'units.egp' }),
    stat('requests', 'purchasing.stats.requestsCount', 21, 'document'),
    stat('orders', 'purchasing.stats.ordersCount', 17, 'purchasing'),
    stat('open', 'purchasing.stats.openOrders', 4, 'clock'),
    stat('late', 'purchasing.stats.lateOrders', 1, 'alert', { toneToken: 'danger' }),
    stat('leadTime', 'purchasing.stats.avgLeadDays', 5.8, 'timer', { unitKey: 'units.day' }),
    stat('returns', 'purchasing.stats.returnsValue', 84000, 'return', { unitKey: 'units.egp' }),
    stat('onTime', 'purchasing.stats.onTimePercent', 87, 'percent', { unitKey: 'units.percent', toneToken: 'success' }),
  ],
  charts: [
    {
      id: 'top-suppliers',
      titleKey: 'purchasing.charts.topSuppliers',
      points: [
        { label: 'مورد دشت المنوفية', value: 1453500 },
        { label: 'Shandong Pulp Co.', value: 860000 },
        { label: 'شركة الكيماويات المتحدة', value: 495000 },
      ],
    },
  ],
  alerts: [
    { id: 'pua-1', messageKey: 'purchasing.alerts.lateOrder', params: ['PO-2026-0079'], severity: 'danger', date: daysAgo(0) },
  ],
};

export const LOGISTICS_DASHBOARD: DashboardData = {
  stats: [
    stat('imports', 'logistics.stats.importsCount', 13, 'inbox'),
    stat('exports', 'logistics.stats.exportsCount', 44, 'outbox'),
    stat('inProgress', 'logistics.stats.inProgress', 5, 'clock'),
    stat('cleared', 'logistics.stats.cleared', 9, 'check', { toneToken: 'success' }),
    stat('late', 'logistics.stats.lateShipments', 2, 'alert', { toneToken: 'danger' }),
    stat('clearanceDays', 'logistics.stats.avgClearanceDays', 6.5, 'timer', { unitKey: 'units.day' }),
    stat('shippingCosts', 'logistics.stats.totalShippingCosts', 412000, 'money', { unitKey: 'units.egp' }),
    stat('customsCosts', 'logistics.stats.totalCustomsCosts', 243600, 'customs', { unitKey: 'units.egp' }),
  ],
  charts: [
    {
      id: 'by-country',
      titleKey: 'logistics.charts.shipmentsByCountry',
      points: [
        { label: 'Italy', value: 18 }, { label: 'Jordan', value: 11 },
        { label: 'China', value: 8 }, { label: 'Germany', value: 5 },
      ],
    },
  ],
  alerts: [
    { id: 'la-1', messageKey: 'logistics.alerts.lateShipment', params: ['IMP-2026-0012'], severity: 'danger', date: daysAgo(0) },
    { id: 'la-2', messageKey: 'logistics.alerts.missingDocuments', params: ['SHP-2026-0044'], severity: 'warning', date: daysAgo(1) },
  ],
};

export const HR_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'hr.stats.totalEmployees', 214, 'hr'),
    stat('new', 'hr.stats.newEmployees', 6, 'plus', { toneToken: 'success' }),
    stat('left', 'hr.stats.leftEmployees', 2, 'minus'),
    stat('turnover', 'hr.stats.turnoverPercent', 2.9, 'percent', { unitKey: 'units.percent' }),
    stat('attendance', 'hr.stats.attendancePercent', 94, 'check', { unitKey: 'units.percent', toneToken: 'success' }),
    stat('absence', 'hr.stats.absencePercent', 6, 'close', { unitKey: 'units.percent' }),
    stat('onLeave', 'hr.stats.onLeaveCount', 9, 'calendar'),
    stat('overtime', 'hr.stats.overtimeHours', 380, 'timer', { unitKey: 'units.hour' }),
    stat('penalties', 'safety.stats.monthPenalties', 3, 'audit'),
  ],
  charts: [
    {
      id: 'by-dept',
      titleKey: 'hr.charts.employeesByDepartment',
      points: [
        { labelKey: 'departments.production', value: 118 },
        { labelKey: 'departments.warehouse', value: 32 },
        { labelKey: 'departments.administration', value: 24 },
        { labelKey: 'departments.quality', value: 18 },
        { labelKey: 'departments.finance', value: 12 },
        { labelKey: 'departments.sales', value: 10 },
      ],
    },
    {
      id: 'penalties-by-reason',
      titleKey: 'safety.charts.penaltiesByReason',
      kind: 'donut',
      points: [
        { labelKey: 'safety.penaltyReasons.noPpe', value: 7 },
        { labelKey: 'safety.penaltyReasons.smoking', value: 3 },
        { labelKey: 'safety.penaltyReasons.unsafeAct', value: 2 },
      ],
    },
  ],
  alerts: [
    { id: 'ha-1', messageKey: 'hr.alerts.contractExpiring', params: ['EMP-0101'], severity: 'warning', date: daysAgo(0) },
    { id: 'ha-2', messageKey: 'hr.alerts.deviceSyncFailed', params: ['ZK-WH-3'], severity: 'danger', date: daysAgo(1) },
  ],
};

export const ADMINISTRATION_DASHBOARD: DashboardData = {
  stats: [
    stat('vehicles', 'administration.stats.activeVehicles', 2, 'fleet'),
    stat('maintenance', 'administration.stats.inMaintenance', 1, 'wrench', { toneToken: 'warning' }),
    stat('fuel', 'administration.stats.fuelLiters', 2890, 'fuel', { unitKey: 'units.liter' }),
    stat('expiring', 'administration.stats.expiringContracts', 1, 'calendar', { toneToken: 'warning' }),
    stat('expenses', 'administration.stats.adminExpenses', 134500, 'money', { unitKey: 'units.egp' }),
    stat('custody', 'administration.stats.openCustody', 2, 'items'),
  ],
  charts: [
    {
      id: 'fuel-monthly',
      titleKey: 'administration.charts.monthlyFuel',
      points: [
        { labelKey: 'months.may', value: 2440 }, { labelKey: 'months.jun', value: 2710 },
        { labelKey: 'months.jul', value: 2580 }, { labelKey: 'months.aug', value: 2890 },
      ],
    },
  ],
  alerts: [
    { id: 'aa-1', messageKey: 'administration.alerts.insuranceExpired', params: ['م ص ر 1188'], severity: 'danger', date: daysAgo(0) },
    { id: 'aa-2', messageKey: 'administration.alerts.licenseExpiring', params: ['ق ل م 7710', 15], severity: 'warning', date: daysAgo(0) },
  ],
};
