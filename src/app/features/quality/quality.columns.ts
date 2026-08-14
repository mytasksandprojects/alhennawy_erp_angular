import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const DASHT_INSPECTION_COLUMNS: TableColumn[] = [
  { key: 'weighingSerial', labelKey: 'quality.fields.weighingSerial', type: 'number', align: 'center' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'supplierName', labelKey: 'quality.fields.supplier', multilang: true },
  { key: 'gradeKey', labelKey: 'quality.fields.grade', type: 'key' },
  { key: 'discountPercent', labelKey: 'quality.fields.discountPercent', type: 'number', align: 'center' },
  { key: 'firstWeightKg', labelKey: 'weighbridge.fields.firstWeight', type: 'number' },
  { key: 'netWeightKg', labelKey: 'weighbridge.fields.netWeight', type: 'number' },
  {
    key: 'accepted',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'quality.accepted.',
    badgeToneMap: { true: 'success', false: 'danger' },
  },
  { key: 'inspector', labelKey: 'quality.fields.inspector', multilang: true },
];

export const MATERIAL_INSPECTION_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'materialKey', labelKey: 'quality.fields.material', type: 'key' },
  { key: 'batchNo', labelKey: 'quality.fields.batch' },
  {
    key: 'result',
    labelKey: 'quality.fields.result',
    type: 'badge',
    keyPrefix: 'quality.results.',
    badgeToneMap: { accepted: 'success', rejected: 'danger' },
  },
  { key: 'notes', labelKey: 'common.notes', multilang: true },
];

export const CHEMICAL_CONSUMPTION_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'tankId', labelKey: 'quality.fields.tank' },
  { key: 'chemicalName', labelKey: 'quality.fields.chemical', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'costPerKg', labelKey: 'quality.fields.costPerKg', type: 'currency' },
  { key: 'totalCost', labelKey: 'quality.fields.totalCost', type: 'currency' },
];

export const MAINTENANCE_COLUMNS: TableColumn[] = [
  { key: 'machineNameKey', labelKey: 'quality.fields.machine', type: 'key' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'typeKey', labelKey: 'common.type', type: 'key' },
  { key: 'description', labelKey: 'quality.fields.description', multilang: true },
  { key: 'downtimeHours', labelKey: 'quality.fields.downtime', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'quality.maintenanceStatus.',
    badgeToneMap: { 'scheduled': 'info', 'in-progress': 'warning', 'done': 'success' },
  },
];

export const DASHT_INSPECTION_FIELDS: FormField[] = [
  { key: 'weighingSerial', labelKey: 'quality.fields.weighingSerial', type: 'number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'supplierName', labelKey: 'quality.fields.supplier', multilang: true },
  { key: 'gradeKey', labelKey: 'quality.fields.grade' },
  { key: 'discountPercent', labelKey: 'quality.fields.discountPercent', type: 'number' },
  { key: 'firstWeightKg', labelKey: 'weighbridge.fields.firstWeight', type: 'number' },
  { key: 'inspector', labelKey: 'quality.fields.inspector', multilang: true },
];

export const MATERIAL_INSPECTION_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'materialKey', labelKey: 'quality.fields.material' },
  { key: 'batchNo', labelKey: 'quality.fields.batch' },
  { key: 'result', labelKey: 'quality.fields.result', type: 'select', options: keysToOptions('quality.results.', ['accepted', 'rejected']) },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea', multilang: true },
];

export const CHEMICAL_CONSUMPTION_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'tankId', labelKey: 'quality.fields.tank' },
  { key: 'chemicalName', labelKey: 'quality.fields.chemical', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'costPerKg', labelKey: 'quality.fields.costPerKg', type: 'number' },
  { key: 'totalCost', labelKey: 'quality.fields.totalCost', type: 'number' },
];

export const MAINTENANCE_FIELDS: FormField[] = [
  { key: 'machineNameKey', labelKey: 'quality.fields.machine' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'typeKey', labelKey: 'common.type' },
  { key: 'description', labelKey: 'quality.fields.description', multilang: true },
  { key: 'downtimeHours', labelKey: 'quality.fields.downtime', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('quality.maintenanceStatus.', ['scheduled', 'in-progress', 'done']) },
];
