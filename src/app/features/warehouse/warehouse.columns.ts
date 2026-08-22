import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const WAREHOUSE_COLUMNS: TableColumn[] = [
  { key: 'nameKey', labelKey: 'common.name', type: 'key' },
  { key: 'itemsCount', labelKey: 'warehouse.fields.itemsCount', type: 'number' },
  { key: 'totalValue', labelKey: 'warehouse.fields.totalValue', type: 'currency' },
  { key: 'occupancyPercent', labelKey: 'warehouse.fields.occupancy', type: 'number', align: 'center' },
];

export const STOCK_ITEM_COLUMNS: TableColumn[] = [
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'key', align: 'center' },
  { key: 'minimumStock', labelKey: 'warehouse.fields.minimum', type: 'number' },
  { key: 'unitCost', labelKey: 'warehouse.fields.unitCost', type: 'currency' },
  {
    key: 'stockStatus',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'warehouse.stock.',
    badgeToneMap: { available: 'success', below: 'warning', out: 'danger' },
  },
];

export const MOVEMENT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  {
    key: 'type',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'warehouse.types.',
    badgeToneMap: { receipt: 'success', issue: 'info', transfer: 'neutral', adjustment: 'warning' },
  },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'key', align: 'center' },
  { key: 'referenceKey', labelKey: 'warehouse.fields.referenceType', type: 'key' },
  { key: 'reference', labelKey: 'warehouse.fields.reference' },
  { key: 'byUser', labelKey: 'common.user' },
];

export const WAREHOUSE_FIELDS: FormField[] = [
  { key: 'nameKey', labelKey: 'common.name', required: true },
  { key: 'kind', labelKey: 'common.type', type: 'select', lookup: 'warehouseKinds' },
  { key: 'itemsCount', labelKey: 'warehouse.fields.itemsCount', type: 'number' },
  { key: 'totalValue', labelKey: 'warehouse.fields.totalValue', type: 'number' },
  { key: 'occupancyPercent', labelKey: 'warehouse.fields.occupancy', type: 'number' },
];

export const STOCK_ITEM_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'ITM' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses' },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit' },
  { key: 'minimumStock', labelKey: 'warehouse.fields.minimum', type: 'number' },
  { key: 'unitCost', labelKey: 'warehouse.fields.unitCost', type: 'number' },
];

export const MOVEMENT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'MOV' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'type', labelKey: 'common.type', type: 'select', options: keysToOptions('warehouse.types.', ['receipt', 'issue', 'transfer', 'adjustment']) },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit' },
  { key: 'reference', labelKey: 'warehouse.fields.reference' },
  { key: 'byUser', labelKey: 'common.user' },
];

/** أذون الإضافة — receipts only; type is fixed on the server. */
export const RECEIPT_COLUMNS: TableColumn[] = MOVEMENT_COLUMNS.filter(
  (col) => col.key !== 'type',
);

export const RECEIPT_FIELDS: FormField[] = MOVEMENT_FIELDS.filter(
  (field) => field.key !== 'type',
);
