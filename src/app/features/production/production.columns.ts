import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const PRODUCTION_ORDER_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'workOrderNumber', labelKey: 'production.fields.workOrder' },
  { key: 'specName', labelKey: 'production.fields.spec', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'producedKg', labelKey: 'production.fields.produced', type: 'number' },
  { key: 'wastePercent', labelKey: 'production.fields.waste', type: 'number', align: 'center' },
  { key: 'rollsProduced', labelKey: 'production.fields.rollsProduced', type: 'number', align: 'center' },
  { key: 'rollsTarget', labelKey: 'production.fields.rollsTarget', type: 'number', align: 'center' },
  { key: 'expectedFinish', labelKey: 'production.fields.expectedFinish', type: 'date' },
  {
    key: 'autoCreated',
    labelKey: 'production.fields.autoCreated',
    type: 'badge',
    keyPrefix: 'production.auto.',
    badgeToneMap: { true: 'info', false: 'neutral' },
  },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'production.status.',
    badgeToneMap: {
      'open': 'info',
      'in-progress': 'warning',
      'completed': 'success',
      'late': 'danger',
      'stopped': 'danger',
    },
  },
];

export const PRODUCTION_ORDER_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'MO' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'workOrderNumber', labelKey: 'production.fields.workOrder' },
  { key: 'specName', labelKey: 'production.fields.spec', multilang: true },
  { key: 'quantityKg', labelKey: 'common.quantity', type: 'number' },
  { key: 'producedKg', labelKey: 'production.fields.produced', type: 'number' },
  { key: 'wastePercent', labelKey: 'production.fields.waste', type: 'number' },
  { key: 'expectedFinish', labelKey: 'production.fields.expectedFinish', type: 'date' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('production.status.', ['open', 'in-progress', 'completed', 'late', 'stopped']) },
];
