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
  { key: 'location', labelKey: 'warehouse.fields.location' },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'key', align: 'center' },
  { key: 'minimumStock', labelKey: 'warehouse.fields.minimum', type: 'number' },
  { key: 'unitCost', labelKey: 'warehouse.fields.unitCost', type: 'currency' },
  {
    key: 'stockStatus',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'warehouse.stock.',
    badgeToneMap: { available: 'success', low: 'warning', below: 'danger', out: 'danger' },
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
    badgeToneMap: {
      receipt: 'success',
      issue: 'info',
      transfer: 'neutral',
      adjustment: 'warning',
      'warehouse-return': 'success',
      'supplier-return': 'warning',
    },
  },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'fromWarehouseId', labelKey: 'common.from', type: 'key' },
  { key: 'toWarehouseId', labelKey: 'common.to', type: 'key' },
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
  { key: 'location', labelKey: 'warehouse.fields.location', lookup: 'itemLocations' },
];

export const STOCK_ITEM_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', generated: true, generatedPrefix: 'ITM' },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'select', lookup: 'warehouses', required: true },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', type: 'select', lookup: 'itemGroups' },
  { key: 'subGroupKey', labelKey: 'warehouse.fields.subGroup', type: 'select', lookup: 'itemSubGroups', filterBy: 'groupKey' },
  { key: 'location', labelKey: 'warehouse.fields.location' },
  { key: 'quantity', labelKey: 'common.quantity', type: 'number' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'select', lookup: 'units', required: true },
  { key: 'minimumStock', labelKey: 'warehouse.fields.minimum', type: 'number' },
  { key: 'unitCost', labelKey: 'warehouse.fields.unitCost', type: 'number' },
];

export const MOVEMENT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'MOV' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'type', labelKey: 'common.type', type: 'select', options: keysToOptions('warehouse.types.', ['receipt', 'issue', 'transfer', 'adjustment', 'warehouse-return', 'supplier-return']) },
  { key: 'fromWarehouseId', labelKey: 'common.from', type: 'select', lookup: 'warehouses' },
  { key: 'toWarehouseId', labelKey: 'common.to', type: 'select', lookup: 'warehouses' },
  { key: 'linesJson', labelKey: 'warehouse.tabs.items', type: 'lines' },
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

export const ITEM_GROUP_COLUMNS: TableColumn[] = [
  { key: 'codePrefix', labelKey: 'warehouse.fields.codePrefix' },
  ...LOOKUP_LABEL_COLUMNS,
];

export const ITEM_GROUP_FIELDS: FormField[] = [
  { key: 'codePrefix', labelKey: 'warehouse.fields.codePrefix' },
  { key: 'labelAr', labelKey: 'system.fields.labelAr', required: true },
  { key: 'labelEn', labelKey: 'system.fields.labelEn', required: true },
];

export const TOOL_CUSTODY_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'key' },
  { key: 'holderName', labelKey: 'administration.fields.holder', multilang: true },
  { key: 'issuedAt', labelKey: 'administration.fields.issuedAt', type: 'date' },
  { key: 'returnedAt', labelKey: 'warehouse.fields.returnedAt', type: 'date' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'warehouse.custody.',
    badgeToneMap: { out: 'warning', returned: 'success' },
  },
];

export const TOOL_CUSTODY_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'CST' },
  { key: 'itemCode', labelKey: 'weighbridge.fields.item', type: 'select', lookup: 'stockItems', copyKey: 'itemName' },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'select', lookup: 'warehouses', required: true },
  { key: 'holderName', labelKey: 'administration.fields.holder', multilang: true, required: true },
  { key: 'issuedAt', labelKey: 'administration.fields.issuedAt', type: 'date', required: true },
  { key: 'returnedAt', labelKey: 'warehouse.fields.returnedAt', type: 'date' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('warehouse.custody.', ['out', 'returned']) },
];

export const STOCK_COUNT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'key' },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'systemQty', labelKey: 'warehouse.fields.systemQty', type: 'number' },
  { key: 'countedQty', labelKey: 'warehouse.fields.countedQty', type: 'number' },
  { key: 'difference', labelKey: 'warehouse.fields.difference', type: 'number' },
];

export const STOCK_COUNT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'CNT' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'select', lookup: 'warehouses', required: true },
  { key: 'itemCode', labelKey: 'weighbridge.fields.item', type: 'select', lookup: 'stockItems', copyKey: 'itemName', required: true },
  { key: 'systemQty', labelKey: 'warehouse.fields.systemQty', type: 'number' },
  { key: 'countedQty', labelKey: 'warehouse.fields.countedQty', type: 'number' },
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

export const ITEM_MOVEMENT_COLUMNS: TableColumn[] = [
  { key: 'itemCode', labelKey: 'common.code' },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'key' },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', type: 'key' },
  { key: 'location', labelKey: 'warehouse.fields.location' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'key', align: 'center' },
  { key: 'inbound', labelKey: 'warehouse.fields.inbound', type: 'number' },
  { key: 'outbound', labelKey: 'warehouse.fields.outbound', type: 'number' },
  { key: 'balance', labelKey: 'warehouse.fields.balance', type: 'number' },
  {
    key: 'stockStatus',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'warehouse.stock.',
    badgeToneMap: { available: 'success', low: 'warning', below: 'danger', out: 'danger' },
  },
];

export const ITEM_MOVEMENT_FILTERS: ListFilter[] = [
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', lookup: 'warehouses' },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', lookup: 'itemGroups' },
  { key: 'subGroupKey', labelKey: 'warehouse.fields.subGroup', lookup: 'itemSubGroups', filterBy: 'groupKey' },
  { key: 'itemCode', labelKey: 'weighbridge.fields.item', lookup: 'stockItems' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', lookup: 'units' },
  { key: 'location', labelKey: 'warehouse.fields.location', lookup: 'itemLocations' },
  { key: 'hideZero', labelKey: 'warehouse.reports.hideZero', options: [{ value: '1', labelKey: 'warehouse.reports.hideZero' }] },
];

export const ITEM_CARD_COLUMNS: TableColumn[] = [
  { key: 'serial', labelKey: 'warehouse.fields.serial', align: 'center' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'itemCode', labelKey: 'common.code' },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  {
    key: 'type',
    labelKey: 'warehouse.fields.movement',
    type: 'badge',
    keyPrefix: 'warehouse.types.',
    badgeToneMap: {
      opening: 'neutral',
      receipt: 'success',
      issue: 'info',
      transfer: 'neutral',
      adjustment: 'warning',
      'warehouse-return': 'success',
      'supplier-return': 'warning',
    },
  },
  { key: 'inbound', labelKey: 'warehouse.fields.inbound', type: 'number' },
  { key: 'outbound', labelKey: 'warehouse.fields.outbound', type: 'number' },
  { key: 'balance', labelKey: 'warehouse.fields.balance', type: 'number' },
  { key: 'number', labelKey: 'common.number' },
  { key: 'reference', labelKey: 'warehouse.fields.reference' },
  { key: 'byUser', labelKey: 'common.user' },
];

export const ITEM_CARD_FILTERS: ListFilter[] = [
  { key: 'itemCode', labelKey: 'weighbridge.fields.item', lookup: 'stockItems' },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', lookup: 'warehouses' },
  { key: 'type', labelKey: 'common.type', options: keysToOptions('warehouse.types.', ['receipt', 'issue', 'transfer', 'adjustment', 'warehouse-return', 'supplier-return']) },
];
