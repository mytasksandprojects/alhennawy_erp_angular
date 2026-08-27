import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

/**
 * Work order columns. The agreed price column exists ONLY when the user
 * holds `finance.viewPrices` — the BRD requires pricing to be hidden
 * from everyone outside Finance.
 */
export function workOrderColumns(showPrices: boolean): TableColumn[] {
  const columns: TableColumn[] = [
    { key: 'number', labelKey: 'common.number' },
    { key: 'date', labelKey: 'common.date', type: 'date' },
    {
      key: 'channel',
      labelKey: 'sales.fields.channel',
      type: 'badge',
      keyPrefix: 'sales.channels.',
      badgeToneMap: { local: 'info', export: 'success' },
    },
    { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
    { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
    { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
    { key: 'sizeMm', labelKey: 'sales.fields.size', type: 'number', align: 'center' },
    { key: 'availableFromStockKg', labelKey: 'sales.fields.available', type: 'number' },
    { key: 'toProduceKg', labelKey: 'sales.fields.toProduce', type: 'number' },
  ];
  if (showPrices) {
    columns.push({ key: 'agreedPrice', labelKey: 'sales.fields.price', type: 'currency' });
  }
  columns.push({ key: 'currency', labelKey: 'common.currency', align: 'center' });
  columns.push({ key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' });
  columns.push(
    { key: 'collectionStatusKey', labelKey: 'sales.fields.collection', type: 'key' },
    {
      key: 'status',
      labelKey: 'common.status',
      type: 'badge',
      keyPrefix: 'sales.status.',
      badgeToneMap: {
        'new': 'info',
        'warehouse-check': 'warning',
        'partially-fulfilled': 'warning',
        'in-production': 'info',
        'ready': 'success',
        'late': 'danger',
        'invoiced': 'success',
        'closed': 'neutral',
      },
    },
  );
  return columns;
}

export const CUSTOMER_COLUMNS: TableColumn[] = [
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'region', labelKey: 'sales.fields.region', multilang: true },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'balance', labelKey: 'common.balance', type: 'currency' },
];

export const EXPORT_ORDER_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'customerCode', labelKey: 'common.code' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  {
    key: 'stage',
    labelKey: 'logistics.fields.stage',
    type: 'badge',
    keyPrefix: 'sales.stages.',
    badgeToneMap: {
      'quotation': 'neutral',
      'internal-approval': 'info',
      'proforma': 'info',
      'supply-order': 'info',
      'warehouse': 'warning',
      'production-scheduled': 'warning',
      'logistics': 'warning',
      'production': 'warning',
      'issued': 'success',
      'invoiced': 'success',
    },
  },
  { key: 'rollsCount', labelKey: 'sales.fields.rolls', type: 'number', align: 'center' },
  { key: 'containersCount', labelKey: 'logistics.fields.containers', type: 'number', align: 'center' },
  { key: 'productionDeadline', labelKey: 'sales.fields.deadline', type: 'date' },
  { key: 'loadingDate', labelKey: 'logistics.fields.loadingDate', type: 'date' },
  { key: 'eInvoiceNumber', labelKey: 'sales.fields.eInvoice' },
];

export const INVOICE_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  {
    key: 'kind',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'sales.kinds.',
    badgeToneMap: { 'commercial': 'success', 'local': 'info', 'packing-list': 'neutral' },
  },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
  { key: 'total', labelKey: 'common.total', type: 'currency' },
  { key: 'collected', labelKey: 'sales.fields.collected', type: 'currency' },
  { key: 'eInvoiceUid', labelKey: 'sales.fields.eInvoice' },
];

export const WORK_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'WO' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'channel', labelKey: 'sales.fields.channel', type: 'select', options: keysToOptions('sales.channels.', ['local', 'export']) },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'sizeMm', labelKey: 'sales.fields.size', type: 'number' },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('sales.status.', ['new', 'warehouse-check', 'partially-fulfilled', 'in-production', 'ready', 'late', 'invoiced', 'closed']) },
];

export const CUSTOMER_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'CUS' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'region', labelKey: 'sales.fields.region', multilang: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'balance', labelKey: 'common.balance', type: 'number' },
];

export const EXPORT_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'EO' },
  { key: 'customerCode', labelKey: 'common.code' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'stage', labelKey: 'logistics.fields.stage', type: 'select', options: keysToOptions('sales.stages.', ['quotation', 'internal-approval', 'proforma', 'supply-order', 'warehouse', 'production-scheduled', 'logistics', 'production', 'issued', 'invoiced']) },
  { key: 'rollsCount', labelKey: 'sales.fields.rolls', type: 'number' },
  { key: 'containersCount', labelKey: 'logistics.fields.containers', type: 'number' },
];

export const INVOICE_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'INV' },
  { key: 'kind', labelKey: 'common.type', type: 'select', options: keysToOptions('sales.kinds.', ['commercial', 'local', 'packing-list']) },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'total', labelKey: 'common.total', type: 'number' },
  { key: 'collected', labelKey: 'sales.fields.collected', type: 'number' },
];
