import { TableColumn } from '../../core/models/common.models';
import { ListFilter } from '../../shared/crud/list-filter';
import { keysToOptions } from '../../shared/crud/options';

export const ITEM_MOVEMENT_COLUMNS: TableColumn[] = [
  { key: 'itemCode', labelKey: 'common.code' },
  { key: 'itemName', labelKey: 'common.name', multilang: true },
  { key: 'warehouseId', labelKey: 'warehouse.tabs.warehouses', type: 'key' },
  { key: 'groupKey', labelKey: 'warehouse.fields.group', type: 'key' },
  { key: 'location', labelKey: 'warehouse.fields.location' },
  { key: 'unitKey', labelKey: 'warehouse.fields.unit', type: 'key', align: 'center' },
  { key: 'movementDate', labelKey: 'warehouse.fields.movementDate', type: 'date' },
  { key: 'inbound', labelKey: 'warehouse.fields.inbound', type: 'number' },
  { key: 'outbound', labelKey: 'warehouse.fields.outbound', type: 'number' },
  { key: 'beginningBalance', labelKey: 'warehouse.fields.beginningBalance', type: 'number' },
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
