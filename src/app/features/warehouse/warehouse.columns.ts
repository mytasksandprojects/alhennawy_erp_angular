import { FormField, TableColumn } from '../../core/models/common.models';
import { ListFilter } from '../../shared/crud/list-filter';
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
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'key' },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', type: 'key' },
  { key: 'subGroupKey', labelKey: 'warehouse.fields.subGroup', type: 'key' },
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

export const STOCK_ITEM_FILTERS: ListFilter[] = [
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', lookup: 'warehouses' },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', lookup: 'itemGroups' },
  { key: 'subGroupKey', labelKey: 'warehouse.fields.subGroup', lookup: 'itemSubGroups', filterBy: 'groupKey' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', lookup: 'units' },
];

export const STOCK_ITEM_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'ITM' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'select', lookup: 'warehouses', required: true },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', type: 'select', lookup: 'itemGroups' },
  { key: 'subGroupKey', labelKey: 'warehouse.fields.subGroup', type: 'select', lookup: 'itemSubGroups', filterBy: 'groupKey' },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'select', lookup: 'units', required: true },
  { key: 'minimumStock', labelKey: 'warehouse.fields.minimum', type: 'number' },
  { key: 'unitCost', labelKey: 'warehouse.fields.unitCost', type: 'number' },
];

export const MOVEMENT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'MOV' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'type', labelKey: 'common.type', type: 'select', options: keysToOptions('warehouse.types.', ['receipt', 'issue', 'transfer', 'adjustment']) },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'select', lookup: 'units' },
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

export const LOOKUP_LABEL_COLUMNS: TableColumn[] = [
  { key: 'labelAr', labelKey: 'system.fields.labelAr' },
  { key: 'labelEn', labelKey: 'system.fields.labelEn' },
];

export const ITEM_GROUP_FIELDS: FormField[] = [
  { key: 'labelAr', labelKey: 'system.fields.labelAr', required: true },
  { key: 'labelEn', labelKey: 'system.fields.labelEn', required: true },
];

export const ITEM_SUBGROUP_COLUMNS: TableColumn[] = [
  { key: 'parentValue', labelKey: 'warehouse.fields.group', type: 'key' },
  ...LOOKUP_LABEL_COLUMNS,
];

export const ITEM_SUBGROUP_FIELDS: FormField[] = [
  { key: 'parentValue', labelKey: 'warehouse.fields.group', type: 'select', lookup: 'itemGroups', required: true },
  { key: 'labelAr', labelKey: 'system.fields.labelAr', required: true },
  { key: 'labelEn', labelKey: 'system.fields.labelEn', required: true },
];
