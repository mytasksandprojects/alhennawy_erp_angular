import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

/** Roll table configuration for the مقص list screen. */
export const ROLL_COLUMNS: TableColumn[] = [
  { key: 'barcode', labelKey: 'cutter.fields.barcode' },
  { key: 'specName', labelKey: 'cutter.fields.spec', multilang: true },
  { key: 'customerCode', labelKey: 'cutter.fields.customer' },
  { key: 'weightKg', labelKey: 'cutter.fields.weight', type: 'number' },
  { key: 'gsm', labelKey: 'cutter.fields.gsm', type: 'number', align: 'center' },
  { key: 'rollWidthMm', labelKey: 'cutter.fields.width', type: 'number', align: 'center' },
  { key: 'diameterMm', labelKey: 'cutter.fields.diameter', type: 'number', align: 'center' },
  {
    key: 'grade',
    labelKey: 'cutter.fields.grade',
    type: 'badge',
    keyPrefix: 'cutter.grades.',
    badgeToneMap: { first: 'success', second: 'warning' },
  },
  { key: 'addUser', labelKey: 'cutter.fields.addUser' },
  { key: 'createdAt', labelKey: 'common.date', type: 'datetime' },
  { key: 'printedCount', labelKey: 'cutter.fields.printedCount', type: 'number', align: 'center' },
];

export const SPEC_COLUMNS: TableColumn[] = [
  { key: 'specCode', labelKey: 'cutter.fields.specCode' },
  { key: 'specName', labelKey: 'cutter.fields.specName', multilang: true },
  { key: 'customerCode', labelKey: 'cutter.fields.customer' },
  { key: 'gsm', labelKey: 'cutter.fields.gsm', type: 'number', align: 'center' },
  { key: 'rollWidthMm', labelKey: 'cutter.fields.width', type: 'number', align: 'center' },
];

export const ROLL_FIELDS: FormField[] = [
  { key: 'specName', labelKey: 'cutter.fields.specName', multilang: true },
  { key: 'customerCode', labelKey: 'cutter.fields.customer' },
  { key: 'weightKg', labelKey: 'cutter.fields.weight', type: 'number' },
  { key: 'gsm', labelKey: 'cutter.fields.gsm', type: 'number' },
  { key: 'rollWidthMm', labelKey: 'cutter.fields.width', type: 'number' },
  { key: 'diameterMm', labelKey: 'cutter.fields.diameter', type: 'number' },
  { key: 'grade', labelKey: 'cutter.fields.grade', type: 'select', options: keysToOptions('cutter.grades.', ['first', 'second']) },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea', multilang: true },
];

export const SPEC_FIELDS: FormField[] = [
  { key: 'specCode', labelKey: 'cutter.fields.specCode', required: true },
  { key: 'specName', labelKey: 'cutter.fields.specName', required: true, multilang: true },
  { key: 'customerCode', labelKey: 'cutter.fields.customer' },
  { key: 'gsm', labelKey: 'cutter.fields.gsm', type: 'number' },
  { key: 'rollWidthMm', labelKey: 'cutter.fields.width', type: 'number' },
];
