import { TableColumn } from '../models/common.models';
import { CatalogModule, CatalogTab } from '../models/access.models';
import { WEIGHING_COLUMNS } from '../../features/weighbridge/weighbridge.columns';
import { ROLL_COLUMNS, SPEC_COLUMNS } from '../../features/cutter/cutter.columns';
import {
  MOVEMENT_COLUMNS,
  RECEIPT_COLUMNS,
  STOCK_ITEM_COLUMNS,
  WAREHOUSE_COLUMNS,
} from '../../features/warehouse/warehouse.columns';
import {
  CHEMICAL_CONSUMPTION_COLUMNS,
  DASHT_INSPECTION_COLUMNS,
  MAINTENANCE_COLUMNS,
  MATERIAL_INSPECTION_COLUMNS,
  TECH_SHEET_COLUMNS,
} from '../../features/quality/quality.columns';
import { PRODUCTION_ORDER_COLUMNS } from '../../features/production/production.columns';
import { OUTPUT_COLUMNS, PURCHASE_COLUMNS, STAFF_COLUMNS } from '../../features/chemicals/chemicals.columns';
import {
  CUSTOMER_COLUMNS,
  EXPORT_ORDER_COLUMNS,
  INVOICE_COLUMNS,
  workOrderColumns,
} from '../../features/sales/sales.columns';
import {
  PURCHASE_ORDER_COLUMNS,
  PURCHASE_REQUEST_COLUMNS,
  QUOTATION_COLUMNS,
  SUPPLIER_COLUMNS,
} from '../../features/purchasing/purchasing.columns';
import { EXPORT_SHIPMENT_COLUMNS, IMPORT_COLUMNS } from '../../features/logistics/logistics.columns';
import {
  ACCOUNT_COLUMNS,
  BANK_COLUMNS,
  CURRENCY_COLUMNS,
  EXPENSE_COLUMNS,
  JOURNAL_COLUMNS,
  LEDGER_COLUMNS,
  TRIAL_COLUMNS,
} from '../../features/finance/finance.columns';
import {
  ATTENDANCE_COLUMNS,
  EMPLOYEE_COLUMNS,
  LEAVE_COLUMNS,
  PENALTY_COLUMNS,
  ZK_SYNC_COLUMNS,
  reviewColumns,
} from '../../features/hr/hr.columns';
import { CUSTODY_COLUMNS, CONTRACT_COLUMNS, DOCUMENT_COLUMNS, FLEET_COLUMNS, PERMIT_COLUMNS } from '../../features/administration/administration.columns';
import { CERTIFICATE_COLUMNS, INSURANCE_COLUMNS } from '../../features/safety/safety.columns';
import {
  CLINIC_COLUMNS,
  DISPENSE_COLUMNS,
  DOCTOR_COLUMNS,
  MEDICINE_COLUMNS,
  VISIT_COLUMNS,
} from '../../features/clinic/clinic-page';
import { REPORT_CATEGORIES } from '../../features/reports/report-defs';
import { LOCATION_COLUMNS } from '../../features/hr/attendance-config.columns';
import { AUDIT_COLUMNS, LOOKUP_COLUMNS } from '../../features/system/system.columns';

function tab(id: string, labelKey: string, columns: TableColumn[]): CatalogTab {
  return {
    id,
    labelKey,
    columns: columns.map((col) => ({
      key: col.key,
      labelKey: col.labelKey,
      multilang: col.multilang,
    })),
  };
}

function dash(): CatalogTab {
  return tab('dashboard', 'common.dashboardTab', []);
}

function reports(): CatalogTab[] {
  return REPORT_CATEGORIES.flatMap((category) =>
    category.reports.map((report) => tab(report.id, report.labelKey, report.columns)),
  );
}

/** Every module, sub-module, and column the roles matrix can grant. */
export const PERMISSION_CATALOG: CatalogModule[] = [
  {
    id: 'weighbridge',
    labelKey: 'menu.weighbridge',
    tabs: [tab('tickets', 'weighbridge.ticketsTitle', WEIGHING_COLUMNS)],
  },
  {
    id: 'cutter',
    labelKey: 'menu.cutter',
    tabs: [
      tab('rolls', 'cutter.tabs.rolls', ROLL_COLUMNS),
      tab('specs', 'cutter.tabs.specs', SPEC_COLUMNS),
    ],
  },
  {
    id: 'warehouse',
    labelKey: 'menu.warehouse',
    tabs: [
      dash(),
      tab('warehouses', 'warehouse.tabs.warehouses', WAREHOUSE_COLUMNS),
      tab('items', 'warehouse.tabs.items', STOCK_ITEM_COLUMNS),
      tab('movements', 'warehouse.tabs.movements', MOVEMENT_COLUMNS),
      tab('receipts', 'warehouse.tabs.receipts', RECEIPT_COLUMNS),
      tab('purchaseRequests', 'purchasing.tabs.requests', PURCHASE_REQUEST_COLUMNS),
    ],
  },
  {
    id: 'quality',
    labelKey: 'menu.quality',
    tabs: [
      dash(),
      tab('dasht', 'quality.tabs.dasht', DASHT_INSPECTION_COLUMNS),
      tab('materials', 'quality.tabs.materials', MATERIAL_INSPECTION_COLUMNS),
      tab('chemicals', 'quality.tabs.consumptions', CHEMICAL_CONSUMPTION_COLUMNS),
      tab('techSheets', 'quality.tabs.techSheets', TECH_SHEET_COLUMNS),
      tab('maintenance', 'quality.tabs.maintenance', MAINTENANCE_COLUMNS),
    ],
  },
  {
    id: 'production',
    labelKey: 'menu.production',
    tabs: [
      dash(),
      tab('orders', 'production.tabs.orders', PRODUCTION_ORDER_COLUMNS),
      tab('purchaseRequests', 'purchasing.tabs.requests', PURCHASE_REQUEST_COLUMNS),
      tab('maintenance', 'quality.tabs.maintenance', MAINTENANCE_COLUMNS),
    ],
  },
  {
    id: 'maintenance',
    labelKey: 'menu.maintenance',
    tabs: [dash(), tab('jobs', 'maintenance.tabs.jobs', MAINTENANCE_COLUMNS)],
  },
  {
    id: 'chemicals',
    labelKey: 'menu.chemicals',
    tabs: [
      dash(),
      tab('output', 'chemicals.tabs.output', OUTPUT_COLUMNS),
      tab('staff', 'chemicals.tabs.staff', STAFF_COLUMNS),
      tab('rawPurchases', 'chemicals.tabs.rawPurchases', PURCHASE_COLUMNS),
      tab('opPurchases', 'chemicals.tabs.opPurchases', PURCHASE_COLUMNS),
      tab('rawWarehouse', 'chemicals.tabs.rawWarehouse', STOCK_ITEM_COLUMNS),
      tab('customers', 'chemicals.tabs.customers', CUSTOMER_COLUMNS),
      tab('movements', 'chemicals.tabs.movements', MOVEMENT_COLUMNS),
      tab('accounts', 'chemicals.tabs.accounts', ACCOUNT_COLUMNS),
      tab('journal', 'chemicals.tabs.journal', JOURNAL_COLUMNS),
    ],
  },
  {
    id: 'sales',
    labelKey: 'menu.sales',
    tabs: [
      dash(),
      tab('workOrders', 'sales.tabs.workOrders', workOrderColumns(true)),
      tab('exportOrders', 'sales.tabs.exportOrders', EXPORT_ORDER_COLUMNS),
      tab('invoices', 'sales.tabs.invoices', INVOICE_COLUMNS),
      tab('customers', 'sales.tabs.customers', CUSTOMER_COLUMNS),
      tab('statement', 'sales.tabs.statement', []),
    ],
  },
  {
    id: 'purchasing',
    labelKey: 'menu.purchasing',
    tabs: [
      dash(),
      tab('requests', 'purchasing.tabs.requests', PURCHASE_REQUEST_COLUMNS),
      tab('quotations', 'purchasing.tabs.quotations', QUOTATION_COLUMNS),
      tab('orders', 'purchasing.tabs.orders', PURCHASE_ORDER_COLUMNS),
      tab('suppliers', 'purchasing.tabs.suppliers', SUPPLIER_COLUMNS),
    ],
  },
  {
    id: 'logistics',
    labelKey: 'menu.logistics',
    tabs: [
      dash(),
      tab('imports', 'logistics.tabs.imports', IMPORT_COLUMNS),
      tab('exports', 'logistics.tabs.exports', EXPORT_SHIPMENT_COLUMNS),
    ],
  },
  {
    id: 'finance',
    labelKey: 'menu.finance',
    tabs: [
      dash(),
      tab('accounts', 'finance.tabs.accounts', ACCOUNT_COLUMNS),
      tab('journal', 'finance.tabs.journal', JOURNAL_COLUMNS),
      tab('banks', 'finance.tabs.banks', BANK_COLUMNS),
      tab('pnl', 'finance.tabs.income', []),
      tab('balanceSheet', 'finance.tabs.balanceSheet', []),
      tab('ledger', 'finance.tabs.ledger', LEDGER_COLUMNS),
      tab('trialBalance', 'finance.tabs.trialBalance', TRIAL_COLUMNS),
      tab('expenses', 'finance.tabs.expenses', EXPENSE_COLUMNS),
      tab('currencies', 'finance.tabs.currencies', CURRENCY_COLUMNS),
    ],
  },
  {
    id: 'hr',
    labelKey: 'menu.hr',
    tabs: [
      dash(),
      tab('employees', 'hr.tabs.employees', EMPLOYEE_COLUMNS),
      tab('attendance', 'hr.tabs.attendance', ATTENDANCE_COLUMNS),
      tab('leaves', 'hr.tabs.leaves', LEAVE_COLUMNS),
      tab('penalties', 'hr.tabs.penalties', PENALTY_COLUMNS),
      tab('performance', 'hr.tabs.performance', reviewColumns('hr.fields.employee', 'hr.fields.manager')),
      tab('managerReviews', 'hr.tabs.managerReviews', reviewColumns('hr.fields.manager', 'hr.fields.employee')),
      tab('zk', 'hr.tabs.zkSync', ZK_SYNC_COLUMNS),
      tab('attendanceConfig', 'hr.tabs.attendanceConfig', LOCATION_COLUMNS),
    ],
  },
  {
    id: 'administration',
    labelKey: 'menu.administration',
    tabs: [
      dash(),
      tab('documents', 'administration.tabs.documents', DOCUMENT_COLUMNS),
      tab('fleet', 'administration.tabs.fleet', FLEET_COLUMNS),
      tab('custody', 'administration.tabs.custody', CUSTODY_COLUMNS),
      tab('contracts', 'administration.tabs.contracts', CONTRACT_COLUMNS),
      tab('permits', 'administration.tabs.permits', PERMIT_COLUMNS),
      tab('safetyCerts', 'safety.tabs.certificates', CERTIFICATE_COLUMNS),
    ],
  },
  {
    id: 'safety',
    labelKey: 'menu.safety',
    tabs: [
      dash(),
      tab('certificates', 'safety.tabs.certificates', CERTIFICATE_COLUMNS),
      tab('insurance', 'safety.tabs.insurance', INSURANCE_COLUMNS),
    ],
  },
  {
    id: 'clinic',
    labelKey: 'menu.clinic',
    tabs: [
      dash(),
      tab('visits', 'clinic.tabs.visits', VISIT_COLUMNS),
      tab('clinics', 'clinic.tabs.clinics', CLINIC_COLUMNS),
      tab('doctors', 'clinic.tabs.doctors', DOCTOR_COLUMNS),
      tab('medicines', 'clinic.tabs.medicines', MEDICINE_COLUMNS),
      tab('dispenses', 'clinic.tabs.dispenses', DISPENSE_COLUMNS),
    ],
  },
  { id: 'reports', labelKey: 'menu.reports', tabs: reports() },
  {
    id: 'factory',
    labelKey: 'menu.factory',
    tabs: [
      tab('profile', 'factory.title', [
        { key: 'name', labelKey: 'factory.fields.name', multilang: true },
        { key: 'address', labelKey: 'factory.fields.address', multilang: true },
        { key: 'phone', labelKey: 'factory.fields.phone' },
        { key: 'fax', labelKey: 'factory.fields.fax' },
        { key: 'logoUrl', labelKey: 'factory.fields.logo' },
        { key: 'iso', labelKey: 'factory.fields.iso' },
      ]),
    ],
  },
  {
    id: 'appearance',
    labelKey: 'menu.appearance',
    tabs: [
      tab('theme', 'appearance.tabs.theme', []),
      tab('translations', 'appearance.tabs.translations', []),
      tab('languages', 'appearance.tabs.languages', [
        { key: 'code', labelKey: 'appearance.fields.code' },
        { key: 'name', labelKey: 'appearance.fields.name' },
        { key: 'direction', labelKey: 'appearance.fields.direction' },
      ]),
    ],
  },
  { id: 'backups', labelKey: 'menu.backups', tabs: [tab('list', 'backup.title', [])] },
  {
    id: 'system',
    labelKey: 'menu.system',
    tabs: [
      tab('audit', 'system.tabs.audit', AUDIT_COLUMNS),
      tab('lookups', 'system.tabs.lookups', LOOKUP_COLUMNS),
      tab('switches', 'system.tabs.switches', []),
    ],
  },
  { id: 'checkin', labelKey: 'menu.checkin', tabs: [tab('punch', 'checkin.title', ATTENDANCE_COLUMNS)] },
  { id: 'roles', labelKey: 'menu.roles', tabs: [tab('matrix', 'roles.title', [])] },
];
