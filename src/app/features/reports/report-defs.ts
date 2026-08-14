import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { TableColumn } from '../../core/models/common.models';
import { CUSTODY_COLUMNS, CONTRACT_COLUMNS, DOCUMENT_COLUMNS, FLEET_COLUMNS, PERMIT_COLUMNS } from '../administration/administration.columns';
import { OUTPUT_COLUMNS, PURCHASE_COLUMNS, STAFF_COLUMNS } from '../chemicals/chemicals-page';
import { DISPENSE_COLUMNS, MEDICINE_COLUMNS, VISIT_COLUMNS } from '../clinic/clinic-page';
import { ROLL_COLUMNS } from '../cutter/cutter.columns';
import { BANK_COLUMNS, EXPENSE_COLUMNS, JOURNAL_COLUMNS } from '../finance/finance.columns';
import { ATTENDANCE_COLUMNS, EMPLOYEE_COLUMNS, LEAVE_COLUMNS, PENALTY_COLUMNS, reviewColumns } from '../hr/hr.columns';
import { EXPORT_SHIPMENT_COLUMNS, IMPORT_COLUMNS } from '../logistics/logistics.columns';
import { PRODUCTION_ORDER_COLUMNS } from '../production/production.columns';
import { PURCHASE_ORDER_COLUMNS, PURCHASE_REQUEST_COLUMNS, QUOTATION_COLUMNS, SUPPLIER_COLUMNS } from '../purchasing/purchasing.columns';
import { DASHT_INSPECTION_COLUMNS, MAINTENANCE_COLUMNS, MATERIAL_INSPECTION_COLUMNS } from '../quality/quality.columns';
import { CUSTOMER_COLUMNS, EXPORT_ORDER_COLUMNS, INVOICE_COLUMNS, workOrderColumns } from '../sales/sales.columns';
import { CERTIFICATE_COLUMNS, INSURANCE_COLUMNS } from '../safety/safety.columns';
import { MOVEMENT_COLUMNS, STOCK_ITEM_COLUMNS } from '../warehouse/warehouse.columns';
import { WEIGHING_COLUMNS } from '../weighbridge/weighbridge.columns';

/** One printable/exportable report backed by an existing collection. */
export interface ReportDef {
  id: string;
  labelKey: string;
  endpoint: string;
  columns: TableColumn[];
}

export interface ReportCategory {
  id: string;
  labelKey: string;
  icon: string;
  reports: ReportDef[];
}

const API = API_ENDPOINTS;

/** التقارير — every dataset in the factory, grouped by area. */
export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: 'commercial',
    labelKey: 'reports.categories.commercial',
    icon: 'sales',
    reports: [
      { id: 'workOrders', labelKey: 'sales.tabs.workOrders', endpoint: API.sales.workOrders, columns: workOrderColumns(true) },
      { id: 'exportOrders', labelKey: 'sales.tabs.exportOrders', endpoint: API.sales.exportOrders, columns: EXPORT_ORDER_COLUMNS },
      { id: 'invoices', labelKey: 'sales.tabs.invoices', endpoint: API.sales.invoices, columns: INVOICE_COLUMNS },
      { id: 'customers', labelKey: 'sales.tabs.customers', endpoint: API.sales.customers, columns: CUSTOMER_COLUMNS },
      { id: 'purchaseRequests', labelKey: 'purchasing.tabs.requests', endpoint: API.purchasing.requests, columns: PURCHASE_REQUEST_COLUMNS },
      { id: 'quotations', labelKey: 'purchasing.tabs.quotations', endpoint: API.purchasing.quotations, columns: QUOTATION_COLUMNS },
      { id: 'purchaseOrders', labelKey: 'purchasing.tabs.orders', endpoint: API.purchasing.orders, columns: PURCHASE_ORDER_COLUMNS },
      { id: 'suppliers', labelKey: 'purchasing.tabs.suppliers', endpoint: API.purchasing.suppliers, columns: SUPPLIER_COLUMNS },
    ],
  },
  {
    id: 'operations',
    labelKey: 'reports.categories.operations',
    icon: 'production',
    reports: [
      { id: 'weighings', labelKey: 'menu.weighbridge', endpoint: API.weighbridge.tickets, columns: WEIGHING_COLUMNS },
      { id: 'productionOrders', labelKey: 'production.tabs.orders', endpoint: API.production.orders, columns: PRODUCTION_ORDER_COLUMNS },
      { id: 'rolls', labelKey: 'cutter.tabs.rolls', endpoint: API.cutter.rolls, columns: ROLL_COLUMNS },
      { id: 'stockItems', labelKey: 'warehouse.tabs.items', endpoint: API.warehouse.items, columns: STOCK_ITEM_COLUMNS },
      { id: 'movements', labelKey: 'warehouse.tabs.movements', endpoint: API.warehouse.movements, columns: MOVEMENT_COLUMNS },
      { id: 'imports', labelKey: 'logistics.tabs.imports', endpoint: API.logistics.imports, columns: IMPORT_COLUMNS },
      { id: 'exports', labelKey: 'logistics.tabs.exports', endpoint: API.logistics.exports, columns: EXPORT_SHIPMENT_COLUMNS },
      { id: 'dashtInspections', labelKey: 'quality.tabs.dasht', endpoint: API.quality.dashtInspections, columns: DASHT_INSPECTION_COLUMNS },
      { id: 'materialInspections', labelKey: 'quality.tabs.materials', endpoint: API.quality.materialInspections, columns: MATERIAL_INSPECTION_COLUMNS },
      { id: 'maintenance', labelKey: 'quality.tabs.maintenance', endpoint: API.quality.maintenance, columns: MAINTENANCE_COLUMNS },
    ],
  },
  {
    id: 'finance',
    labelKey: 'reports.categories.finance',
    icon: 'finance',
    reports: [
      { id: 'journal', labelKey: 'finance.tabs.journal', endpoint: API.finance.journalEntries, columns: JOURNAL_COLUMNS },
      { id: 'expenses', labelKey: 'finance.tabs.expenses', endpoint: API.finance.expenses, columns: EXPENSE_COLUMNS },
      { id: 'banks', labelKey: 'finance.tabs.banks', endpoint: API.finance.banks, columns: BANK_COLUMNS },
    ],
  },
  {
    id: 'people',
    labelKey: 'reports.categories.people',
    icon: 'hr',
    reports: [
      { id: 'employees', labelKey: 'hr.tabs.employees', endpoint: API.hr.employees, columns: EMPLOYEE_COLUMNS },
      { id: 'attendance', labelKey: 'hr.tabs.attendance', endpoint: API.hr.attendance, columns: ATTENDANCE_COLUMNS },
      { id: 'leaves', labelKey: 'hr.tabs.leaves', endpoint: API.hr.leaves, columns: LEAVE_COLUMNS },
      { id: 'penalties', labelKey: 'hr.tabs.penalties', endpoint: API.hr.penalties, columns: PENALTY_COLUMNS },
      { id: 'performance', labelKey: 'hr.tabs.performance', endpoint: API.hr.employeeReviews, columns: reviewColumns('hr.fields.employee', 'hr.fields.manager') },
      { id: 'managerReviews', labelKey: 'hr.tabs.managerReviews', endpoint: API.hr.managerReviews, columns: reviewColumns('hr.fields.manager', 'hr.fields.employee') },
    ],
  },
  {
    id: 'facility',
    labelKey: 'reports.categories.facility',
    icon: 'administration',
    reports: [
      { id: 'documents', labelKey: 'administration.tabs.documents', endpoint: API.administration.documents, columns: DOCUMENT_COLUMNS },
      { id: 'fleet', labelKey: 'administration.tabs.fleet', endpoint: API.administration.fleet, columns: FLEET_COLUMNS },
      { id: 'custody', labelKey: 'administration.tabs.custody', endpoint: API.administration.custody, columns: CUSTODY_COLUMNS },
      { id: 'contracts', labelKey: 'administration.tabs.contracts', endpoint: API.administration.contracts, columns: CONTRACT_COLUMNS },
      { id: 'permits', labelKey: 'administration.tabs.permits', endpoint: API.administration.permits, columns: PERMIT_COLUMNS },
      { id: 'certificates', labelKey: 'safety.tabs.certificates', endpoint: API.safety.certificates, columns: CERTIFICATE_COLUMNS },
      { id: 'insurance', labelKey: 'safety.tabs.insurance', endpoint: API.safety.insurance, columns: INSURANCE_COLUMNS },
      { id: 'clinicVisits', labelKey: 'clinic.tabs.visits', endpoint: API.clinic.visits, columns: VISIT_COLUMNS },
      { id: 'medicines', labelKey: 'clinic.tabs.medicines', endpoint: API.clinic.medicines, columns: MEDICINE_COLUMNS },
      { id: 'dispenses', labelKey: 'clinic.tabs.dispenses', endpoint: API.clinic.dispenses, columns: DISPENSE_COLUMNS },
    ],
  },
  {
    id: 'chemicals',
    labelKey: 'reports.categories.chemicals',
    icon: 'flask',
    reports: [
      { id: 'chemOutput', labelKey: 'chemicals.tabs.output', endpoint: API.chemicals.output, columns: OUTPUT_COLUMNS },
      { id: 'chemStaff', labelKey: 'chemicals.tabs.staff', endpoint: API.chemicals.staff, columns: STAFF_COLUMNS },
      { id: 'chemRaw', labelKey: 'chemicals.tabs.rawPurchases', endpoint: API.chemicals.rawPurchases, columns: PURCHASE_COLUMNS },
      { id: 'chemOps', labelKey: 'chemicals.tabs.opPurchases', endpoint: API.chemicals.operationalPurchases, columns: PURCHASE_COLUMNS },
    ],
  },
];
