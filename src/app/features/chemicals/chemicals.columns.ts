import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const OUTPUT_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'product', labelKey: 'chemicals.fields.product', multilang: true },
  { key: 'batchNumber', labelKey: 'chemicals.fields.batch' },
  { key: 'quantityKg', labelKey: 'chemicals.fields.quantityKg', type: 'number', align: 'center' },
  { key: 'notes', labelKey: 'common.notes', multilang: true },
];

export const OUTPUT_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date', required: true },
  { key: 'product', labelKey: 'chemicals.fields.product', required: true, multilang: true },
  { key: 'batchNumber', labelKey: 'chemicals.fields.batch' },
  { key: 'quantityKg', labelKey: 'chemicals.fields.quantityKg', type: 'number', required: true },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea', multilang: true },
];

export const STAFF_COLUMNS: TableColumn[] = [
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'image' },
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'role', labelKey: 'chemicals.fields.role', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  { key: 'salary', labelKey: 'hr.fields.salary', type: 'currency' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'hr.status.',
    badgeToneMap: { active: 'success', 'on-leave': 'info', terminated: 'danger', probation: 'warning' },
  },
];

export const STAFF_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'CHM' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'role', labelKey: 'chemicals.fields.role', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  { key: 'salary', labelKey: 'hr.fields.salary', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('hr.status.', ['active', 'on-leave', 'terminated', 'probation']) },
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'images' },
];

export const PURCHASE_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'item', labelKey: 'chemicals.fields.item', multilang: true },
  { key: 'supplier', labelKey: 'purchasing.fields.supplier', multilang: true },
  { key: 'quantity', labelKey: 'chemicals.fields.quantity', type: 'number', align: 'center' },
  { key: 'unit', labelKey: 'chemicals.fields.unit' },
  { key: 'total', labelKey: 'chemicals.fields.total', type: 'currency' },
  { key: 'currency', labelKey: 'common.currency' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'chemicals.purchaseStatus.',
    badgeToneMap: { ordered: 'info', received: 'success', paid: 'neutral' },
  },
];

export const PURCHASE_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date', required: true },
  { key: 'item', labelKey: 'chemicals.fields.item', required: true, multilang: true },
  { key: 'supplierCode', labelKey: 'purchasing.fields.supplier', type: 'select', lookup: 'suppliers', copyKey: 'supplier', required: true },
  { key: 'quantity', labelKey: 'chemicals.fields.quantity', type: 'number' },
  { key: 'unit', labelKey: 'chemicals.fields.unit' },
  { key: 'total', labelKey: 'chemicals.fields.total', type: 'number', required: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('chemicals.purchaseStatus.', ['ordered', 'received', 'paid']) },
];
