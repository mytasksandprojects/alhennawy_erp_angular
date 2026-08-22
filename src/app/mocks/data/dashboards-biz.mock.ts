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
    stat('revenue', 'finance.stats.totalRevenue', 18450000, 'money', { unitKey: 'units.egp', trendPercent: 9, route: '/finance', query: { tab: 'pnl' } }),
    stat('expenses', 'finance.stats.totalExpenses', 12280000, 'expense', { unitKey: 'units.egp', trendPercent: 5, route: '/finance', query: { tab: 'expenses' } }),
    stat('netProfit', 'finance.stats.netProfit', 6170000, 'chart', { unitKey: 'units.egp', toneToken: 'success', trendPercent: 14, route: '/finance', query: { tab: 'pnl' } }),
    stat('customersBalance', 'finance.stats.customersBalance', 1166700, 'customers', { unitKey: 'units.egp', route: '/sales', query: { tab: 'customers' } }),
    stat('suppliersBalance', 'finance.stats.suppliersBalance', 862500, 'purchasing', { unitKey: 'units.egp', route: '/purchasing', query: { tab: 'suppliers' } }),
    stat('cash', 'finance.stats.cashAndBanks', 7110000, 'bank', { unitKey: 'units.egp', route: '/finance', query: { tab: 'banks' } }),
    stat('receivables', 'finance.stats.dueReceivables', 685000, 'inbox', { unitKey: 'units.egp', toneToken: 'warning', route: '/sales', query: { tab: 'statement' } }),
    stat('payables', 'finance.stats.duePayables', 402000, 'outbox', { unitKey: 'units.egp', toneToken: 'warning', route: '/purchasing', query: { tab: 'orders' } }),
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
    { id: 'fa-1', messageKey: 'finance.alerts.duePayment', params: ['SUP-002', 126000], severity: 'warning', date: daysAgo(0), route: '/purchasing', query: { tab: 'suppliers', q: 'SUP-002' } },
    { id: 'fa-2', messageKey: 'finance.alerts.dueCollection', params: ['CUS-014', 199375], severity: 'info', date: daysAgo(0), route: '/sales', query: { tab: 'customers', q: 'CUS-014' } },
  ],
};

export const SALES_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'sales.stats.totalSales', 5230000, 'money', { unitKey: 'units.egp', trendPercent: 11, route: '/sales', query: { tab: 'invoices' } }),
    stat('orders', 'sales.stats.ordersCount', 38, 'sales', { route: '/sales', query: { tab: 'workOrders' } }),
    stat('quotations', 'sales.stats.quotationsCount', 12, 'document', { route: '/sales', query: { tab: 'exportOrders' } }),
    stat('invoices', 'sales.stats.invoicesCount', 31, 'invoice', { route: '/sales', query: { tab: 'invoices' } }),
    stat('collections', 'sales.stats.totalCollections', 3890000, 'bank', { unitKey: 'units.egp', route: '/sales', query: { tab: 'statement' } }),
    stat('due', 'sales.stats.customersDue', 1166700, 'alert', { unitKey: 'units.egp', toneToken: 'warning', route: '/sales', query: { tab: 'statement' } }),
    stat('inProgress', 'sales.stats.inProgress', 5, 'clock', { route: '/sales', query: { tab: 'workOrders' } }),
    stat('late', 'sales.stats.lateOrders', 1, 'close', { toneToken: 'danger', route: '/sales', query: { tab: 'workOrders' } }),
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
    { id: 'sa-1', messageKey: 'sales.alerts.lateOrder', params: ['SO-2026-0120'], severity: 'warning', date: daysAgo(0), route: '/sales', query: { tab: 'workOrders', q: 'SO-2026-0120' } },
    { id: 'sa-2', messageKey: 'sales.alerts.dueCollection', params: ['CUS-009', 200000], severity: 'info', date: daysAgo(1), route: '/sales', query: { tab: 'customers', q: 'CUS-009' } },
  ],
};

export const PURCHASING_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'purchasing.stats.totalValue', 3820000, 'money', { unitKey: 'units.egp', route: '/purchasing', query: { tab: 'orders' } }),
    stat('requests', 'purchasing.stats.requestsCount', 21, 'document', { route: '/purchasing', query: { tab: 'requests' } }),
    stat('orders', 'purchasing.stats.ordersCount', 17, 'purchasing', { route: '/purchasing', query: { tab: 'orders' } }),
    stat('open', 'purchasing.stats.openOrders', 4, 'clock', { route: '/purchasing', query: { tab: 'orders' } }),
    stat('late', 'purchasing.stats.lateOrders', 1, 'alert', { toneToken: 'danger', route: '/purchasing', query: { tab: 'orders' } }),
    stat('leadTime', 'purchasing.stats.avgLeadDays', 5.8, 'timer', { unitKey: 'units.day', route: '/purchasing', query: { tab: 'orders' } }),
    stat('returns', 'purchasing.stats.returnsValue', 84000, 'return', { unitKey: 'units.egp', route: '/purchasing', query: { tab: 'orders' } }),
    stat('onTime', 'purchasing.stats.onTimePercent', 87, 'percent', { unitKey: 'units.percent', toneToken: 'success', route: '/purchasing', query: { tab: 'suppliers' } }),
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
    { id: 'pua-1', messageKey: 'purchasing.alerts.lateOrder', params: ['PO-2026-0079'], severity: 'danger', date: daysAgo(0), route: '/purchasing', query: { tab: 'orders', q: 'PO-2026-0079' } },
  ],
};

export const LOGISTICS_DASHBOARD: DashboardData = {
  stats: [
    stat('imports', 'logistics.stats.importsCount', 13, 'inbox', { route: '/logistics', query: { tab: 'imports' } }),
    stat('exports', 'logistics.stats.exportsCount', 44, 'outbox', { route: '/logistics', query: { tab: 'exports' } }),
    stat('inProgress', 'logistics.stats.inProgress', 5, 'clock', { route: '/logistics', query: { tab: 'imports' } }),
    stat('cleared', 'logistics.stats.cleared', 9, 'check', { toneToken: 'success', route: '/logistics', query: { tab: 'imports' } }),
    stat('late', 'logistics.stats.lateShipments', 2, 'alert', { toneToken: 'danger', route: '/logistics', query: { tab: 'imports' } }),
    stat('clearanceDays', 'logistics.stats.avgClearanceDays', 6.5, 'timer', { unitKey: 'units.day', route: '/logistics', query: { tab: 'imports' } }),
    stat('shippingCosts', 'logistics.stats.totalShippingCosts', 412000, 'money', { unitKey: 'units.egp', route: '/logistics', query: { tab: 'exports' } }),
    stat('customsCosts', 'logistics.stats.totalCustomsCosts', 243600, 'customs', { unitKey: 'units.egp', route: '/logistics', query: { tab: 'imports' } }),
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
    { id: 'la-1', messageKey: 'logistics.alerts.lateShipment', params: ['IMP-2026-0012'], severity: 'danger', date: daysAgo(0), route: '/logistics', query: { tab: 'imports', q: 'IMP-2026-0012' } },
    { id: 'la-2', messageKey: 'logistics.alerts.missingDocuments', params: ['SHP-2026-0044'], severity: 'warning', date: daysAgo(1), route: '/logistics', query: { tab: 'exports', q: 'SHP-2026-0044' } },
  ],
};

export const HR_DASHBOARD: DashboardData = {
  stats: [
    stat('total', 'hr.stats.totalEmployees', 214, 'hr', { route: '/hr', query: { tab: 'employees' } }),
    stat('new', 'hr.stats.newEmployees', 6, 'plus', { toneToken: 'success', route: '/hr', query: { tab: 'employees' } }),
    stat('left', 'hr.stats.leftEmployees', 2, 'minus', { route: '/hr', query: { tab: 'employees' } }),
    stat('turnover', 'hr.stats.turnoverPercent', 2.9, 'percent', { unitKey: 'units.percent', route: '/hr', query: { tab: 'employees' } }),
    stat('attendance', 'hr.stats.attendancePercent', 94, 'check', { unitKey: 'units.percent', toneToken: 'success', route: '/hr', query: { tab: 'attendance' } }),
    stat('absence', 'hr.stats.absencePercent', 6, 'close', { unitKey: 'units.percent', route: '/hr', query: { tab: 'attendance' } }),
    stat('onLeave', 'hr.stats.onLeaveCount', 9, 'calendar', { route: '/hr', query: { tab: 'leaves' } }),
    stat('overtime', 'hr.stats.overtimeHours', 380, 'timer', { unitKey: 'units.hour', route: '/hr', query: { tab: 'attendance' } }),
    stat('penalties', 'safety.stats.monthPenalties', 3, 'audit', { route: '/hr', query: { tab: 'penalties' } }),
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
    { id: 'ha-1', messageKey: 'hr.alerts.contractExpiring', params: ['EMP-0101'], severity: 'warning', date: daysAgo(0), route: '/hr', query: { tab: 'employees', q: 'EMP-0101' } },
    { id: 'ha-2', messageKey: 'hr.alerts.deviceSyncFailed', params: ['ZK-WH-3'], severity: 'danger', date: daysAgo(1), route: '/hr', query: { tab: 'zk', q: 'ZK-WH-3' } },
  ],
};

export const ADMINISTRATION_DASHBOARD: DashboardData = {
  stats: [
    stat('vehicles', 'administration.stats.activeVehicles', 2, 'fleet', { route: '/administration', query: { tab: 'fleet' } }),
    stat('maintenance', 'administration.stats.inMaintenance', 1, 'wrench', { toneToken: 'warning', route: '/administration', query: { tab: 'fleet' } }),
    stat('fuel', 'administration.stats.fuelLiters', 2890, 'fuel', { unitKey: 'units.liter', route: '/administration', query: { tab: 'fleet' } }),
    stat('expiring', 'administration.stats.expiringContracts', 1, 'calendar', { toneToken: 'warning', route: '/administration', query: { tab: 'contracts' } }),
    stat('expenses', 'administration.stats.adminExpenses', 134500, 'money', { unitKey: 'units.egp', route: '/finance', query: { tab: 'expenses' } }),
    stat('custody', 'administration.stats.openCustody', 2, 'items', { route: '/administration', query: { tab: 'custody' } }),
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
    { id: 'aa-1', messageKey: 'administration.alerts.insuranceExpired', params: ['م ص ر 1188'], severity: 'danger', date: daysAgo(0), route: '/administration', query: { tab: 'fleet', q: '1188' } },
    { id: 'aa-2', messageKey: 'administration.alerts.licenseExpiring', params: ['ق ل م 7710', 15], severity: 'warning', date: daysAgo(0), route: '/administration', query: { tab: 'fleet', q: '7710' } },
  ],
};
