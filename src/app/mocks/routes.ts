import { ACCESS_ROUTES } from './access-routes';
import { MockRoute } from './mock-registry';
import { filterBy } from './data/crud.util';
import { MOCK_MENU, MOCK_SETTINGS } from './data/settings.mock';
import { MOCK_THEME, MOCK_THEMES } from './data/theme.mock';
import { ThemeMode } from '../core/models/config.models';
import { TRANSLATIONS } from './data/i18n';
import { mockLogin } from './data/auth.mock';
import {
  completeWeighing,
  createWeighing,
  getWeighing,
  listWeighings,
} from './data/weighbridge.mock';
import { MOCK_SPECS, createRoll, listRolls, registerPrint } from './data/cutter.mock';
import { createReceipt, listReceipts, MOCK_MOVEMENTS, MOCK_STOCK_ITEMS, MOCK_WAREHOUSES } from './data/warehouse.mock';
import { MOCK_ACCOUNT_FLAT, MOCK_BANKS, MOCK_JOURNAL_ENTRIES } from './data/finance.mock';
import { MOCK_BALANCE_SHEET, MOCK_EXPENSES, MOCK_PNL } from './data/finance-reports.mock';
import {
  MOCK_PURCHASE_ORDERS,
  MOCK_PURCHASE_REQUESTS,
  MOCK_QUOTATIONS,
  MOCK_SUPPLIERS,
} from './data/purchasing.mock';
import {
  MOCK_CUSTOMERS,
  MOCK_EXPORT_ORDERS,
  MOCK_INVOICES,
  MOCK_STATEMENTS,
  MOCK_WORK_ORDERS,
} from './data/sales.mock';
import { MOCK_EXPORT_SHIPMENTS, MOCK_IMPORTS } from './data/logistics.mock';
import {
  listEmployees,
  MOCK_ATTENDANCE,
  MOCK_EMPLOYEE_REVIEWS,
  MOCK_LEAVES,
  MOCK_MANAGER_REVIEWS,
  MOCK_ZK_LOGS,
} from './data/hr.mock';
import {
  CLINIC_DASHBOARD,
  MOCK_CLINIC_MEDICINES,
  MOCK_CLINICS,
  MOCK_CLINIC_VISITS,
  MOCK_DOCTORS,
  MOCK_INSURANCE,
  MOCK_MEDICINE_DISPENSES,
  MOCK_PENALTIES,
  MOCK_SAFETY_CERTIFICATES,
  SAFETY_DASHBOARD,
} from './data/safety.mock';
import {
  MOCK_COMPANY_DOCUMENTS,
  MOCK_CONTRACTS,
  MOCK_CUSTODY,
  MOCK_FLEET,
  MOCK_PERMITS,
} from './data/administration.mock';
import {
  MOCK_CHEMICAL_CONSUMPTION,
  MOCK_DASHT_INSPECTIONS,
  MOCK_MAINTENANCE,
  MOCK_MATERIAL_INSPECTIONS,
  MOCK_PRODUCTION_ORDERS,
} from './data/quality.mock';
import {
  ADMINISTRATION_DASHBOARD,
  FINANCE_DASHBOARD,
  HR_DASHBOARD,
  LOGISTICS_DASHBOARD,
  PURCHASING_DASHBOARD,
  SALES_DASHBOARD,
} from './data/dashboards-biz.mock';
import { SYSTEM_ALERTS } from './data/alerts.mock';
import { getFactoryProfile, saveFactoryProfile } from './data/factory.mock';
import { HOME_DASHBOARD } from './data/dashboards-home.mock';
import {
  PRODUCTION_DASHBOARD,
  QUALITY_DASHBOARD,
  WAREHOUSE_DASHBOARD,
  WEIGHBRIDGE_DASHBOARD,
} from './data/dashboards-ops.mock';
import { MOCK_AUDIT_LOGS, listToggles, updateToggle } from './data/system.mock';
import {
  addCurrency,
  deleteCurrency,
  listCurrencies,
  liveLookups,
  MOCK_LOOKUP_VALUES,
  updateCurrency,
} from './data/lookups.mock';
import {
  CHEMICALS_DASHBOARD,
  MOCK_CHEM_OP_PURCHASES,
  MOCK_CHEM_OUTPUT,
  MOCK_CHEM_RAW_PURCHASES,
  MOCK_CHEM_STAFF,
} from './data/chemicals.mock';
import { addLanguage, setThemeToken, setTranslationValue } from './data/customization.mock';
import { MOCK_TICKETS } from './data/weighbridge.mock';
import { MOCK_ROLLS } from './data/cutter.mock';
import {
  downloadBackup,
  getBackupSchedule,
  importBackup,
  MOCK_BACKUPS,
  runBackup,
  saveBackupSchedule,
} from './data/backup.mock';
import { crudRoutes } from './data/crud.util';
import { DashboardData } from '../core/models/common.models';
import { MockApiError } from './mock-backend.interceptor';

const DASHBOARDS: Record<string, DashboardData> = {
  home: HOME_DASHBOARD,
  finance: FINANCE_DASHBOARD,
  sales: SALES_DASHBOARD,
  purchasing: PURCHASING_DASHBOARD,
  logistics: LOGISTICS_DASHBOARD,
  hr: HR_DASHBOARD,
  administration: ADMINISTRATION_DASHBOARD,
  safety: SAFETY_DASHBOARD,
  clinic: CLINIC_DASHBOARD,
  chemicals: CHEMICALS_DASHBOARD,
  weighbridge: WEIGHBRIDGE_DASHBOARD,
  warehouse: WAREHOUSE_DASHBOARD,
  quality: QUALITY_DASHBOARD,
  production: PRODUCTION_DASHBOARD,
};

/** MOCK LAYER — full route table mirroring `core/api/api-endpoints.ts`. */
export const MOCK_ROUTES: MockRoute[] = [
  { method: 'GET', pattern: '/config/bundle', handler: () => ({ settings: MOCK_SETTINGS, theme: MOCK_THEME, menu: MOCK_MENU }) },
  { method: 'GET', pattern: '/config/translations/:lang', handler: ({ path }) => {
      const lang = path.split('/').pop() ?? '';
      const map = TRANSLATIONS[lang];
      if (!map) throw new MockApiError(404, 'unknown-language');
      return map;
    } },
  { method: 'GET', pattern: '/config/theme/:mode', handler: ({ path }) => {
      const mode = (path.split('/').pop() ?? '') as ThemeMode;
      const theme = MOCK_THEMES[mode];
      if (!theme) throw new MockApiError(404, 'unknown-theme');
      return theme;
    } },
  { method: 'POST', pattern: '/config/theme/:mode/token', handler: ({ path, body }) => setThemeToken(path.split('/')[3] ?? '', body) },
  { method: 'POST', pattern: '/config/translations/:lang/value', handler: ({ path, body }) => setTranslationValue(path.split('/')[3] ?? '', body) },
  { method: 'POST', pattern: '/config/languages', handler: ({ body }) => addLanguage(body) },
  { method: 'POST', pattern: '/auth/login', handler: ({ body }) => mockLogin(body) },
  { method: 'POST', pattern: '/auth/logout', handler: () => ({ ok: true }) },
  { method: 'GET', pattern: '/alerts', handler: () => SYSTEM_ALERTS },
  { method: 'GET', pattern: '/factory/profile', handler: () => getFactoryProfile() },
  { method: 'PUT', pattern: '/factory/profile', handler: ({ body }) => saveFactoryProfile(body) },
  { method: 'GET', pattern: '/dashboards/:id', handler: ({ path }) => {
      const id = path.split('/').pop() ?? '';
      const dashboard = DASHBOARDS[id];
      if (!dashboard) throw new MockApiError(404, 'unknown-dashboard');
      return dashboard;
    } },
  { method: 'GET', pattern: '/weighbridge/tickets', handler: ({ query }) => listWeighings(query) },
  { method: 'GET', pattern: '/weighbridge/tickets/:id', handler: ({ path }) => getWeighing(path.split('/').pop() ?? '') },
  { method: 'POST', pattern: '/weighbridge/tickets', handler: ({ body }) => createWeighing(body) },
  { method: 'POST', pattern: '/weighbridge/tickets/complete', handler: ({ body }) => completeWeighing(body) },

  { method: 'GET', pattern: '/cutter/rolls', handler: ({ query }) => listRolls(query) },
  { method: 'POST', pattern: '/cutter/rolls', handler: ({ body }) => createRoll(body) },
  { method: 'POST', pattern: '/cutter/rolls/:id/print', handler: ({ path }) => registerPrint(path.split('/')[3] ?? '') },
  { method: 'GET', pattern: '/cutter/specs', handler: () => MOCK_SPECS },

  { method: 'GET', pattern: '/warehouse/warehouses', handler: () => MOCK_WAREHOUSES },
  { method: 'GET', pattern: '/warehouse/items', handler: ({ query }) => filterBy(MOCK_STOCK_ITEMS, 'warehouseId', query.get('warehouseId')) },
  { method: 'GET', pattern: '/warehouse/movements', handler: ({ query }) => filterBy(MOCK_MOVEMENTS, 'type', query.get('type')) },
  { method: 'GET', pattern: '/warehouse/receipts', handler: () => listReceipts() },
  { method: 'POST', pattern: '/warehouse/receipts', handler: ({ body }) => createReceipt(body) },

  { method: 'GET', pattern: '/finance/accounts', handler: () => MOCK_ACCOUNT_FLAT },
  { method: 'GET', pattern: '/finance/journal-entries', handler: () => MOCK_JOURNAL_ENTRIES },
  { method: 'GET', pattern: '/finance/banks', handler: () => MOCK_BANKS },
  { method: 'GET', pattern: '/finance/profit-loss', handler: () => MOCK_PNL },
  { method: 'GET', pattern: '/finance/balance-sheet', handler: () => MOCK_BALANCE_SHEET },
  { method: 'GET', pattern: '/finance/expenses', handler: () => MOCK_EXPENSES },

  { method: 'GET', pattern: '/purchasing/requests', handler: () => MOCK_PURCHASE_REQUESTS },
  { method: 'GET', pattern: '/purchasing/orders', handler: () => MOCK_PURCHASE_ORDERS },
  { method: 'GET', pattern: '/purchasing/suppliers', handler: () => MOCK_SUPPLIERS },
  { method: 'GET', pattern: '/purchasing/quotations', handler: () => MOCK_QUOTATIONS },

  { method: 'GET', pattern: '/sales/customers', handler: () => MOCK_CUSTOMERS },
  { method: 'GET', pattern: '/sales/customers/:code/statement', handler: ({ path }) => MOCK_STATEMENTS[path.split('/')[3] ?? ''] ?? [] },
  { method: 'GET', pattern: '/sales/work-orders', handler: () => MOCK_WORK_ORDERS },
  { method: 'GET', pattern: '/sales/export-orders', handler: () => MOCK_EXPORT_ORDERS },
  { method: 'GET', pattern: '/sales/invoices', handler: () => MOCK_INVOICES },

  { method: 'GET', pattern: '/logistics/imports', handler: () => MOCK_IMPORTS },
  { method: 'GET', pattern: '/logistics/exports', handler: () => MOCK_EXPORT_SHIPMENTS },

  { method: 'GET', pattern: '/hr/employees', handler: () => listEmployees() },
  { method: 'GET', pattern: '/hr/attendance', handler: () => MOCK_ATTENDANCE },
  { method: 'GET', pattern: '/hr/leaves', handler: () => MOCK_LEAVES },
  { method: 'GET', pattern: '/hr/zk-sync-logs', handler: () => MOCK_ZK_LOGS },
  { method: 'GET', pattern: '/hr/employee-reviews', handler: () => MOCK_EMPLOYEE_REVIEWS },
  { method: 'GET', pattern: '/hr/manager-reviews', handler: () => MOCK_MANAGER_REVIEWS },

  { method: 'GET', pattern: '/administration/fleet', handler: () => MOCK_FLEET },
  { method: 'GET', pattern: '/administration/custody', handler: () => MOCK_CUSTODY },
  { method: 'GET', pattern: '/administration/contracts', handler: () => MOCK_CONTRACTS },
  { method: 'GET', pattern: '/administration/permits', handler: () => MOCK_PERMITS },
  { method: 'GET', pattern: '/administration/documents', handler: () => MOCK_COMPANY_DOCUMENTS },
  { method: 'GET', pattern: '/safety/certificates', handler: () => MOCK_SAFETY_CERTIFICATES },
  { method: 'GET', pattern: '/hr/penalties', handler: () => MOCK_PENALTIES },
  { method: 'GET', pattern: '/safety/insurance', handler: () => MOCK_INSURANCE },
  { method: 'GET', pattern: '/clinic/visits', handler: () => MOCK_CLINIC_VISITS },
  { method: 'GET', pattern: '/clinic/clinics', handler: () => MOCK_CLINICS },
  { method: 'GET', pattern: '/clinic/doctors', handler: () => MOCK_DOCTORS },
  { method: 'GET', pattern: '/clinic/medicines', handler: () => MOCK_CLINIC_MEDICINES },
  { method: 'GET', pattern: '/clinic/dispenses', handler: () => MOCK_MEDICINE_DISPENSES },
  { method: 'GET', pattern: '/chemicals/output', handler: () => MOCK_CHEM_OUTPUT },
  { method: 'GET', pattern: '/chemicals/staff', handler: () => MOCK_CHEM_STAFF },
  { method: 'GET', pattern: '/chemicals/raw-purchases', handler: () => MOCK_CHEM_RAW_PURCHASES },
  { method: 'GET', pattern: '/chemicals/operational-purchases', handler: () => MOCK_CHEM_OP_PURCHASES },

  { method: 'GET', pattern: '/quality/dasht-inspections', handler: () => MOCK_DASHT_INSPECTIONS },
  { method: 'GET', pattern: '/quality/material-inspections', handler: () => MOCK_MATERIAL_INSPECTIONS },
  { method: 'GET', pattern: '/quality/chemical-consumption', handler: () => MOCK_CHEMICAL_CONSUMPTION },
  { method: 'GET', pattern: '/quality/maintenance', handler: () => MOCK_MAINTENANCE },
  { method: 'GET', pattern: '/production/orders', handler: () => MOCK_PRODUCTION_ORDERS },

  { method: 'GET', pattern: '/backups', handler: () => MOCK_BACKUPS },
  { method: 'GET', pattern: '/backups/schedule', handler: () => getBackupSchedule() },
  { method: 'POST', pattern: '/backups/schedule', handler: ({ body }) => saveBackupSchedule(body) },
  { method: 'POST', pattern: '/backups/run', handler: () => runBackup() },
  { method: 'POST', pattern: '/backups/import', handler: ({ body }) => importBackup(body) },
  { method: 'GET', pattern: '/backups/:id/download', handler: ({ path }) => downloadBackup(path.split('/')[2] ?? '') },

  { method: 'GET', pattern: '/system/audit-logs', handler: () => MOCK_AUDIT_LOGS },
  { method: 'GET', pattern: '/system/lookups', handler: () => [...MOCK_LOOKUP_VALUES, ...liveLookups()] },
  { method: 'GET', pattern: '/finance/currencies', handler: () => listCurrencies() },
  { method: 'POST', pattern: '/finance/currencies', handler: ({ body }) => addCurrency(body) },
  { method: 'PUT', pattern: '/finance/currencies/:id', handler: ({ path, body }) => updateCurrency(decodeURIComponent(path.split('/').pop() ?? ''), body) },
  { method: 'DELETE', pattern: '/finance/currencies/:id', handler: ({ path }) => deleteCurrency(decodeURIComponent(path.split('/').pop() ?? '')) },
  { method: 'GET', pattern: '/system/toggles', handler: () => listToggles() },
  { method: 'POST', pattern: '/system/toggles/:id', handler: ({ path, body }) => updateToggle(path.split('/')[3] ?? '', body) },

  ...crudRoutes('/weighbridge/tickets', MOCK_TICKETS, 'id', false),
  ...crudRoutes('/cutter/rolls', MOCK_ROLLS, 'id', false),
  ...crudRoutes('/cutter/specs', MOCK_SPECS, 'specCode'),
  ...crudRoutes('/warehouse/warehouses', MOCK_WAREHOUSES),
  ...crudRoutes('/warehouse/items', MOCK_STOCK_ITEMS, 'code'),
  ...crudRoutes('/warehouse/movements', MOCK_MOVEMENTS),
  ...crudRoutes('/warehouse/receipts', MOCK_MOVEMENTS, 'id', false),
  ...crudRoutes('/finance/accounts', MOCK_ACCOUNT_FLAT, 'code'),
  ...crudRoutes('/finance/journal-entries', MOCK_JOURNAL_ENTRIES),
  ...crudRoutes('/finance/banks', MOCK_BANKS),
  ...crudRoutes('/finance/expenses', MOCK_EXPENSES),
  ...crudRoutes('/system/audit-logs', MOCK_AUDIT_LOGS),
  ...crudRoutes('/system/lookups', MOCK_LOOKUP_VALUES),
  ...crudRoutes('/purchasing/requests', MOCK_PURCHASE_REQUESTS),
  ...crudRoutes('/purchasing/orders', MOCK_PURCHASE_ORDERS),
  ...crudRoutes('/purchasing/suppliers', MOCK_SUPPLIERS, 'code'),
  ...crudRoutes('/purchasing/quotations', MOCK_QUOTATIONS),
  ...crudRoutes('/sales/customers', MOCK_CUSTOMERS, 'code'),
  ...crudRoutes('/sales/work-orders', MOCK_WORK_ORDERS),
  ...crudRoutes('/sales/export-orders', MOCK_EXPORT_ORDERS),
  ...crudRoutes('/sales/invoices', MOCK_INVOICES),
  ...crudRoutes('/logistics/imports', MOCK_IMPORTS),
  ...crudRoutes('/logistics/exports', MOCK_EXPORT_SHIPMENTS),
  ...crudRoutes('/hr/attendance', MOCK_ATTENDANCE),
  ...crudRoutes('/hr/leaves', MOCK_LEAVES),
  ...crudRoutes('/hr/zk-sync-logs', MOCK_ZK_LOGS),
  ...crudRoutes('/hr/employee-reviews', MOCK_EMPLOYEE_REVIEWS),
  ...crudRoutes('/hr/manager-reviews', MOCK_MANAGER_REVIEWS),
  ...crudRoutes('/administration/fleet', MOCK_FLEET),
  ...crudRoutes('/administration/custody', MOCK_CUSTODY),
  ...crudRoutes('/administration/contracts', MOCK_CONTRACTS),
  ...crudRoutes('/administration/permits', MOCK_PERMITS),
  ...crudRoutes('/administration/documents', MOCK_COMPANY_DOCUMENTS),
  ...crudRoutes('/safety/certificates', MOCK_SAFETY_CERTIFICATES),
  ...crudRoutes('/hr/penalties', MOCK_PENALTIES),
  ...crudRoutes('/safety/insurance', MOCK_INSURANCE),
  ...crudRoutes('/clinic/visits', MOCK_CLINIC_VISITS),
  ...crudRoutes('/clinic/clinics', MOCK_CLINICS),
  ...crudRoutes('/clinic/doctors', MOCK_DOCTORS),
  ...crudRoutes('/clinic/medicines', MOCK_CLINIC_MEDICINES),
  ...crudRoutes('/clinic/dispenses', MOCK_MEDICINE_DISPENSES),
  ...crudRoutes('/chemicals/output', MOCK_CHEM_OUTPUT),
  ...crudRoutes('/chemicals/staff', MOCK_CHEM_STAFF),
  ...crudRoutes('/chemicals/raw-purchases', MOCK_CHEM_RAW_PURCHASES),
  ...crudRoutes('/chemicals/operational-purchases', MOCK_CHEM_OP_PURCHASES),
  ...crudRoutes('/quality/dasht-inspections', MOCK_DASHT_INSPECTIONS),
  ...crudRoutes('/quality/material-inspections', MOCK_MATERIAL_INSPECTIONS),
  ...crudRoutes('/quality/chemical-consumption', MOCK_CHEMICAL_CONSUMPTION),
  ...crudRoutes('/quality/maintenance', MOCK_MAINTENANCE),
  ...crudRoutes('/production/orders', MOCK_PRODUCTION_ORDERS),
  ...ACCESS_ROUTES,
];
