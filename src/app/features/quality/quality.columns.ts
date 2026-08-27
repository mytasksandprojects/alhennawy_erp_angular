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
  { key: 'inspector', labelKey: 'quality.fields.inspector' },
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
  {
    key: 'source',
    labelKey: 'maintenance.fields.source',
    type: 'badge',
    keyPrefix: 'maintenance.sources.',
    badgeToneMap: { quality: 'info', production: 'success' },
  },
  { key: 'typeKey', labelKey: 'common.type', type: 'key' },
  { key: 'description', labelKey: 'quality.fields.description', multilang: true },
  { key: 'scheduledAt', labelKey: 'maintenance.fields.scheduledAt', type: 'date' },
  { key: 'downtimeHours', labelKey: 'quality.fields.downtime', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'quality.maintenanceStatus.',
    badgeToneMap: { pending: 'warning', scheduled: 'info', 'in-progress': 'warning', done: 'success' },
    statusFlow: ['pending', 'scheduled', 'in-progress', 'done'],
  },
];

export const DASHT_INSPECTION_FIELDS: FormField[] = [
  { key: 'weighingSerial', labelKey: 'quality.fields.weighingSerial', type: 'number', generated: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'supplierCode', labelKey: 'quality.fields.supplier', type: 'select', lookup: 'suppliers', copyKey: 'supplierName', required: true },
  { key: 'gradeKey', labelKey: 'quality.fields.grade' },
  { key: 'discountPercent', labelKey: 'quality.fields.discountPercent', type: 'number' },
  { key: 'firstWeightKg', labelKey: 'weighbridge.fields.firstWeight', type: 'number' },
  { key: 'inspector', labelKey: 'quality.fields.inspector', type: 'select', lookup: 'employees', required: true },
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

const MACHINE_OPTIONS = keysToOptions('', [
  'quality.machines.paperMachine',
  'quality.machines.rewinder',
  'quality.machines.boiler',
]);
const MAINT_TYPE_OPTIONS = keysToOptions('', [
  'quality.maintenanceTypes.preventive',
  'quality.maintenanceTypes.corrective',
  'quality.maintenanceTypes.inspection',
]);

/** Quality / production raise a request — maintenance sets the time. */
export const MAINTENANCE_REQUEST_FIELDS: FormField[] = [
  { key: 'machineNameKey', labelKey: 'quality.fields.machine', type: 'select', options: MACHINE_OPTIONS, required: true },
  { key: 'typeKey', labelKey: 'common.type', type: 'select', options: MAINT_TYPE_OPTIONS },
  { key: 'description', labelKey: 'quality.fields.description', type: 'textarea', multilang: true },
];

export const MAINTENANCE_FIELDS: FormField[] = [
  ...MAINTENANCE_REQUEST_FIELDS,
  { key: 'scheduledAt', labelKey: 'maintenance.fields.scheduledAt', type: 'date' },
  { key: 'downtimeHours', labelKey: 'quality.fields.downtime', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('quality.maintenanceStatus.', ['pending', 'scheduled', 'in-progress', 'done']) },
];

export const TECH_SHEET_COLUMNS: TableColumn[] = [
  { key: 'specCode', labelKey: 'common.code' },
  { key: 'specName', labelKey: 'common.name' },
  { key: 'gsm', labelKey: 'cutter.label.gsm', type: 'number', align: 'center' },
  { key: 'moisturePercent', labelKey: 'quality.fields.moisture', type: 'number', align: 'center' },
  { key: 'brightnessPercent', labelKey: 'quality.fields.brightness', type: 'number', align: 'center' },
  { key: 'burst', labelKey: 'quality.fields.burst', type: 'number', align: 'center' },
  { key: 'tensile', labelKey: 'quality.fields.tensile', type: 'number', align: 'center' },
  { key: 'notes', labelKey: 'common.notes' },
];

export const TECH_SHEET_FIELDS: FormField[] = [
  { key: 'specCode', labelKey: 'common.code', required: true },
  { key: 'specName', labelKey: 'common.name', required: true },
  { key: 'gsm', labelKey: 'cutter.label.gsm', type: 'number' },
  { key: 'moisturePercent', labelKey: 'quality.fields.moisture', type: 'number' },
  { key: 'brightnessPercent', labelKey: 'quality.fields.brightness', type: 'number' },
  { key: 'burst', labelKey: 'quality.fields.burst', type: 'number' },
  { key: 'tensile', labelKey: 'quality.fields.tensile', type: 'number' },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea' },
];
