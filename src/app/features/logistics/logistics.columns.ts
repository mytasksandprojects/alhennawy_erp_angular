import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const IMPORT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  {
    key: 'stage',
    labelKey: 'logistics.fields.stage',
    type: 'badge',
    keyPrefix: 'logistics.importStages.',
    badgeToneMap: {
      'rfq': 'neutral',
      'proforma': 'info',
      'acid': 'info',
      'cargox': 'info',
      'form4': 'info',
      'customs': 'warning',
      'warehouse-receipt': 'success',
      'finance-costing': 'success',
      'closed': 'neutral',
    },
  },
  { key: 'acidNo', labelKey: 'logistics.fields.acid' },
  { key: 'releasePermitNo', labelKey: 'logistics.fields.releasePermit' },
  { key: 'originPort', labelKey: 'logistics.fields.originPort', multilang: true },
  { key: 'arrivalPort', labelKey: 'logistics.fields.arrivalPort', multilang: true },
  { key: 'etaDate', labelKey: 'logistics.fields.eta', type: 'date' },
  {
    key: 'isLate',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'logistics.late.',
    badgeToneMap: { true: 'danger', false: 'success' },
  },
];

export const EXPORT_SHIPMENT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  {
    key: 'stage',
    labelKey: 'logistics.fields.stage',
    type: 'badge',
    keyPrefix: 'logistics.exportStages.',
    badgeToneMap: {
      'booking': 'info',
      'loading': 'warning',
      'shipped': 'info',
      'documents': 'warning',
      'delivered': 'success',
      'closed': 'neutral',
    },
  },
  { key: 'containersCount', labelKey: 'logistics.fields.containers', type: 'number', align: 'center' },
  { key: 'vessel', labelKey: 'logistics.fields.vessel', multilang: true },
  { key: 'portKey', labelKey: 'logistics.fields.port', type: 'key' },
  { key: 'loadingDate', labelKey: 'logistics.fields.loadingDate', type: 'date' },
  { key: 'shippingLineInvoicesTotal', labelKey: 'logistics.fields.shippingInvoices', type: 'currency' },
  {
    key: 'telexReleased',
    labelKey: 'logistics.fields.telex',
    type: 'badge',
    keyPrefix: 'common.bool.',
    badgeToneMap: { true: 'success', false: 'neutral' },
  },
];

export const IMPORT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', required: true },
  { key: 'supplierName', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'stage', labelKey: 'logistics.fields.stage', type: 'select', options: keysToOptions('logistics.importStages.', ['rfq', 'proforma', 'acid', 'cargox', 'form4', 'customs', 'warehouse-receipt', 'finance-costing', 'closed']) },
  { key: 'acidNo', labelKey: 'logistics.fields.acid' },
  { key: 'originPort', labelKey: 'logistics.fields.originPort', multilang: true },
  { key: 'arrivalPort', labelKey: 'logistics.fields.arrivalPort', multilang: true },
  { key: 'etaDate', labelKey: 'logistics.fields.eta', type: 'date' },
];

export const EXPORT_SHIPMENT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', required: true },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'stage', labelKey: 'logistics.fields.stage', type: 'select', options: keysToOptions('logistics.exportStages.', ['booking', 'loading', 'shipped', 'documents', 'delivered', 'closed']) },
  { key: 'containersCount', labelKey: 'logistics.fields.containers', type: 'number' },
  { key: 'vessel', labelKey: 'logistics.fields.vessel', multilang: true },
  { key: 'loadingDate', labelKey: 'logistics.fields.loadingDate', type: 'date' },
];
