import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

/** Ticket table configuration — labels and badges are translation keys. */
export const WEIGHING_COLUMNS: TableColumn[] = [
  { key: 'serial', labelKey: 'common.serial', type: 'number', align: 'center' },
  {
    key: 'type',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'weighbridge.types.',
    badgeToneMap: {
      'purchase': 'info',
      'dasht-purchase': 'info',
      'sales': 'success',
      'purchase-return': 'warning',
      'sales-return': 'warning',
      'internal-transfer': 'neutral',
    },
  },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'vehiclePlate', labelKey: 'weighbridge.fields.vehiclePlate' },
  { key: 'partyName', labelKey: 'weighbridge.fields.party', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  { key: 'firstWeightKg', labelKey: 'weighbridge.fields.firstWeight', type: 'number' },
  { key: 'secondWeightKg', labelKey: 'weighbridge.fields.secondWeight', type: 'number' },
  { key: 'netWeightKg', labelKey: 'weighbridge.fields.netWeight', type: 'number' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'weighbridge.status.',
    badgeToneMap: {
      'first-done': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
    },
  },
];

export const WEIGHING_FIELDS: FormField[] = [
  { key: 'vehiclePlate', labelKey: 'weighbridge.fields.vehiclePlate', required: true },
  { key: 'driverName', labelKey: 'weighbridge.fields.driverName', multilang: true },
  { key: 'partyName', labelKey: 'weighbridge.fields.party', multilang: true },
  { key: 'itemName', labelKey: 'weighbridge.fields.item', multilang: true },
  { key: 'firstWeightKg', labelKey: 'weighbridge.fields.firstWeight', type: 'number' },
  { key: 'secondWeightKg', labelKey: 'weighbridge.fields.secondWeight', type: 'number' },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea', multilang: true },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'select',
    options: keysToOptions('weighbridge.status.', ['first-done', 'completed', 'cancelled']),
  },
];
