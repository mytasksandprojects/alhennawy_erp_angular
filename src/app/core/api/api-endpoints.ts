/**
 * Single registry of every backend endpoint.
 * When the real API is ready, only this file (and environment.ts) may need
 * touching — feature code never builds URLs by hand.
 */
export const API_ENDPOINTS = {
  config: {
    bundle: '/config/bundle',
    translations: (lang: string) => `/config/translations/${lang}`,
    theme: (mode: string) => `/config/theme/${mode}`,
    themeToken: (mode: string) => `/config/theme/${mode}/token`,
    translationValue: (lang: string) => `/config/translations/${lang}/value`,
    languages: '/config/languages',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  dashboards: (moduleId: string) => `/dashboards/${moduleId}`,
  alerts: '/alerts',
  factory: {
    profile: '/factory/profile',
  },
  finance: {
    accounts: '/finance/accounts',
    journalEntries: '/finance/journal-entries',
    banks: '/finance/banks',
    profitLoss: '/finance/profit-loss',
    balanceSheet: '/finance/balance-sheet',
    expenses: '/finance/expenses',
    currencies: '/finance/currencies',
  },
  purchasing: {
    requests: '/purchasing/requests',
    orders: '/purchasing/orders',
    suppliers: '/purchasing/suppliers',
    quotations: '/purchasing/quotations',
  },
  administration: {
    fleet: '/administration/fleet',
    custody: '/administration/custody',
    contracts: '/administration/contracts',
    permits: '/administration/permits',
    documents: '/administration/documents',
  },
  safety: {
    certificates: '/safety/certificates',
    insurance: '/safety/insurance',
  },
  clinic: {
    visits: '/clinic/visits',
    clinics: '/clinic/clinics',
    doctors: '/clinic/doctors',
    medicines: '/clinic/medicines',
    dispenses: '/clinic/dispenses',
  },
  chemicals: {
    output: '/chemicals/output',
    staff: '/chemicals/staff',
    rawPurchases: '/chemicals/raw-purchases',
    operationalPurchases: '/chemicals/operational-purchases',
  },
  hr: {
    employees: '/hr/employees',
    attendance: '/hr/attendance',
    leaves: '/hr/leaves',
    zkSyncLogs: '/hr/zk-sync-logs',
    employeeReviews: '/hr/employee-reviews',
    managerReviews: '/hr/manager-reviews',
    penalties: '/hr/penalties',
    attendancePolicy: '/hr/attendance-policy',
    attendanceLocations: '/hr/attendance-locations',
  },
  roles: '/roles',
  checkin: '/hr/attendance',
  logistics: {
    imports: '/logistics/imports',
    exports: '/logistics/exports',
  },
  warehouse: {
    warehouses: '/warehouse/warehouses',
    items: '/warehouse/items',
    movements: '/warehouse/movements',
    receipts: '/warehouse/receipts',
    purchaseRequests: '/warehouse/purchase-requests',
  },
  quality: {
    dashtInspections: '/quality/dasht-inspections',
    materialInspections: '/quality/material-inspections',
    chemicalConsumption: '/quality/chemical-consumption',
    maintenance: '/quality/maintenance',
  },
  production: {
    orders: '/production/orders',
    purchaseRequests: '/production/purchase-requests',
  },
  sales: {
    customers: '/sales/customers',
    workOrders: '/sales/work-orders',
    exportOrders: '/sales/export-orders',
    invoices: '/sales/invoices',
    customerStatement: (code: string) => `/sales/customers/${code}/statement`,
  },
  weighbridge: {
    tickets: '/weighbridge/tickets',
    complete: '/weighbridge/tickets/complete',
  },
  cutter: {
    rolls: '/cutter/rolls',
    specs: '/cutter/specs',
    print: (rollId: string) => `/cutter/rolls/${rollId}/print`,
  },
  backups: {
    list: '/backups',
    run: '/backups/run',
    schedule: '/backups/schedule',
    importFile: '/backups/import',
    download: (id: string) => `/backups/${id}/download`,
  },
  system: {
    auditLogs: '/system/audit-logs',
    toggles: '/system/toggles',
    toggle: (id: string) => `/system/toggles/${id}`,
    lookups: '/system/lookups',
  },
} as const;
