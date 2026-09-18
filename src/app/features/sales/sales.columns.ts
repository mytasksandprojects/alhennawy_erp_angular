import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

/**
 * Work order columns. The agreed price column exists ONLY when the user
 * holds `finance.viewPrices` — the BRD requires pricing to be hidden
 * from everyone outside Finance. Sales-entered `totalPrice`
 * (quantity × price per KG) is always shown.
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
    {
      key: 'mixType',
      labelKey: 'qc.fields.mixType',
      type: 'badge',
      keyPrefix: '',
      badgeToneMap: { 'qc.mix.mixed': 'info', 'qc.mix.pure': 'success' },
    },
    { key: 'ply', labelKey: 'qc.fields.ply', align: 'center' },
    { key: 'color', labelKey: 'qc.fields.color', type: 'key' },
    { key: 'gsm', labelKey: 'cutter.label.gsm', type: 'number', align: 'center' },
    { key: 'widthMm', labelKey: 'qc.fields.width', type: 'number', align: 'center' },
    { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
    { key: 'availableFromStockKg', labelKey: 'sales.fields.available', type: 'number' },
    { key: 'toProduceKg', labelKey: 'sales.fields.toProduce', type: 'number' },
    { key: 'totalPrice', labelKey: 'sales.fields.totalPrice', type: 'currency' },
  ];
  if (showPrices) {
    columns.push({ key: 'agreedPrice', labelKey: 'sales.fields.price', type: 'currency' });
  }
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
      statusFlow: ['new', 'warehouse-check', 'partially-fulfilled', 'in-production', 'ready', 'invoiced', 'closed'],
    },
  );
  return columns;
}

export const CUSTOMER_COLUMNS: TableColumn[] = [
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  {
    key: 'channel',
    labelKey: 'sales.fields.channel',
    type: 'badge',
    keyPrefix: 'sales.channels.',
    badgeToneMap: { local: 'info', export: 'success' },
  },
  { key: 'region', labelKey: 'sales.fields.region', multilang: true },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'balance', labelKey: 'common.balance', type: 'currency' },
];

export const EXPORT_ORDER_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'sales.fields.serial' },
  { key: 'customerCode', labelKey: 'common.code' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  { key: 'totalUsd', labelKey: 'sales.fields.totalPrice', type: 'currency' },
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
      'production': 'warning',
      'logistics': 'warning',
      'issued': 'success',
      'invoiced': 'success',
    },
  },
  {
    key: 'proformaStatus',
    labelKey: 'sales.fields.proformaStatus',
    type: 'badge',
    keyPrefix: 'sales.proforma.',
    badgeToneMap: { pending: 'warning', approved: 'success', rejected: 'danger' },
  },
  { key: 'rollsCount', labelKey: 'sales.fields.rolls', type: 'number', align: 'center' },
  { key: 'containersCount', labelKey: 'logistics.fields.containers', type: 'number', align: 'center' },
  { key: 'productionDate', labelKey: 'sales.fields.productionDate', type: 'date' },
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

export const TAX_INVOICE_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerCode', labelKey: 'common.code' },
  { key: 'customerName', labelKey: 'sales.fields.customer', multilang: true },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'total', labelKey: 'common.total', type: 'currency' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'sales.taxStatus.',
    badgeToneMap: { ready: 'warning', sent: 'success' },
    statusFlow: ['ready', 'sent'],
  },
  { key: 'sentAt', labelKey: 'sales.fields.sentAt', type: 'datetime' },
  { key: 'eInvoiceUid', labelKey: 'sales.fields.eInvoice' },
];

/** Local-only work order — channel is fixed to محلي in the mock workflow. */
export const WORK_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'SO' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerCode', labelKey: 'sales.fields.customer', type: 'select', lookup: 'localCustomers', copyKey: 'customerName', required: true },
  { key: 'mixType', labelKey: 'qc.fields.mixType', type: 'select', lookup: 'qcMix' },
  { key: 'linesJson', labelKey: 'warehouse.tabs.items', type: 'salesLines' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('sales.status.', ['new', 'warehouse-check', 'partially-fulfilled', 'in-production', 'ready', 'late', 'invoiced', 'closed']) },
];

export const CUSTOMER_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'CUS' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'channel', labelKey: 'sales.fields.channel', type: 'select', options: keysToOptions('sales.channels.', ['local', 'export']), required: true },
  { key: 'region', labelKey: 'sales.fields.region', multilang: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'balance', labelKey: 'common.balance', type: 'number' },
];

/** Export quotation — export customers only, serial auto-generated. */
export const EXPORT_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'sales.fields.serial', generated: true, generatedPrefix: 'EXP' },
  { key: 'customerCode', labelKey: 'sales.fields.customer', type: 'select', lookup: 'exportCustomers', copyKey: 'customerName', required: true },
  { key: 'linesJson', labelKey: 'warehouse.tabs.items', type: 'salesLines' },
  { key: 'stage', labelKey: 'logistics.fields.stage', type: 'select', options: keysToOptions('sales.stages.', ['quotation', 'internal-approval', 'proforma', 'supply-order', 'warehouse', 'production-scheduled', 'production', 'logistics', 'issued', 'invoiced']) },
];

export const INVOICE_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'INV' },
  { key: 'kind', labelKey: 'common.type', type: 'select', options: keysToOptions('sales.kinds.', ['commercial', 'local', 'packing-list']) },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerCode', labelKey: 'sales.fields.customer', type: 'select', lookup: 'customers', copyKey: 'customerName', required: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'total', labelKey: 'common.total', type: 'number' },
  { key: 'collected', labelKey: 'sales.fields.collected', type: 'number' },
];

/** فاتورة ضريبية — sent to the ETA portal from the row status button. */
export const TAX_INVOICE_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'TAX' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'customerCode', labelKey: 'sales.fields.customer', type: 'select', lookup: 'customers', copyKey: 'customerName', required: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'total', labelKey: 'common.total', type: 'number' },
];
