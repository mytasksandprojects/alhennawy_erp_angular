import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const PURCHASE_REQUEST_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'itemName', labelKey: 'warehouse.tabs.items' },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'requestingDepartmentKey', labelKey: 'purchasing.fields.department', type: 'key' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'purchasing.requestStatus.',
    badgeToneMap: { pending: 'warning', approved: 'success', rejected: 'danger', ordered: 'info' },
  },
];

export const PURCHASE_ORDER_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'totalValue', labelKey: 'common.value', type: 'currency' },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
  { key: 'expectedDelivery', labelKey: 'purchasing.fields.expectedDelivery', type: 'date' },
  { key: 'leadTimeDays', labelKey: 'purchasing.fields.leadTime', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'purchasing.orderStatus.',
    badgeToneMap: {
      'open': 'info',
      'partially-received': 'warning',
      'received': 'success',
      'late': 'danger',
      'closed': 'neutral',
    },
  },
];

export const SUPPLIER_COLUMNS: TableColumn[] = [
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'balance', labelKey: 'common.balance', type: 'currency' },
  { key: 'onTimeDeliveryPercent', labelKey: 'purchasing.fields.onTime', type: 'number', align: 'center' },
];

export const QUOTATION_COLUMNS: TableColumn[] = [
  { key: 'requestId', labelKey: 'purchasing.fields.request' },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'totalValue', labelKey: 'common.value', type: 'currency' },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
  { key: 'deliveryDays', labelKey: 'purchasing.fields.deliveryDays', type: 'number', align: 'center' },
  { key: 'technicalScore', labelKey: 'purchasing.fields.technicalScore', type: 'number', align: 'center' },
  {
    key: 'selected',
    labelKey: 'purchasing.fields.selected',
    type: 'badge',
    keyPrefix: 'common.bool.',
    badgeToneMap: { true: 'success', false: 'neutral' },
  },
];

export const PURCHASE_REQUEST_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'PR' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'itemName', labelKey: 'warehouse.tabs.items', type: 'select', lookup: 'stockItems', required: true },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number', required: true },
  { key: 'requestingDepartmentKey', labelKey: 'purchasing.fields.department', type: 'select', lookup: 'departments' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('purchasing.requestStatus.', ['pending', 'approved', 'rejected', 'ordered']) },
];

/** Warehouse / production raise a request — department and status are set by the API. */
export const DEPT_PURCHASE_REQUEST_FIELDS: FormField[] = PURCHASE_REQUEST_FIELDS.filter(
  (field) => field.key !== 'requestingDepartmentKey' && field.key !== 'status',
);

export const PURCHASE_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'PO' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'totalValue', labelKey: 'common.value', type: 'number' },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'expectedDelivery', labelKey: 'purchasing.fields.expectedDelivery', type: 'date' },
  { key: 'leadTimeDays', labelKey: 'purchasing.fields.leadTime', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('purchasing.orderStatus.', ['open', 'partially-received', 'received', 'late', 'closed']) },
];

export const SUPPLIER_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'SUP' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'balance', labelKey: 'common.balance', type: 'number' },
  { key: 'onTimeDeliveryPercent', labelKey: 'purchasing.fields.onTime', type: 'number' },
];

export const QUOTATION_FIELDS: FormField[] = [
  { key: 'requestId', labelKey: 'purchasing.fields.request' },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'totalValue', labelKey: 'common.value', type: 'number' },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'deliveryDays', labelKey: 'purchasing.fields.deliveryDays', type: 'number' },
  { key: 'technicalScore', labelKey: 'purchasing.fields.technicalScore', type: 'number' },
];
