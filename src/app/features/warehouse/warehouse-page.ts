import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  DEPT_PURCHASE_REQUEST_FIELDS,
  PURCHASE_REQUEST_COLUMNS,
} from '../purchasing/purchasing.columns';
import {
  ITEM_GROUP_FIELDS,
  ITEM_SUBGROUP_COLUMNS,
  ITEM_SUBGROUP_FIELDS,
  LOOKUP_LABEL_COLUMNS,
  MOVEMENT_COLUMNS,
  MOVEMENT_FIELDS,
  RECEIPT_COLUMNS,
  RECEIPT_FIELDS,
  STOCK_ITEM_COLUMNS,
  STOCK_ITEM_FIELDS,
  STOCK_ITEM_FILTERS,
  WAREHOUSE_COLUMNS,
  WAREHOUSE_FIELDS,
} from './warehouse.columns';

/** إدارة المخازن — dashboard, warehouses, stock items, movements. */
@Component({
  selector: 'app-warehouse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="warehouse"
      titleKey="warehouse.title"
      subtitleKey="warehouse.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class WarehousePage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'warehouses',
      labelKey: 'warehouse.tabs.warehouses',
      endpoint: API_ENDPOINTS.warehouse.warehouses,
      columns: WAREHOUSE_COLUMNS,
      fields: WAREHOUSE_FIELDS,
    },
    {
      id: 'items',
      labelKey: 'warehouse.tabs.items',
      endpoint: API_ENDPOINTS.warehouse.items,
      columns: STOCK_ITEM_COLUMNS,
      fields: STOCK_ITEM_FIELDS,
      filters: STOCK_ITEM_FILTERS,
      idKey: 'code',
    },
    {
      id: 'itemGroups',
      labelKey: 'warehouse.tabs.groups',
      endpoint: API_ENDPOINTS.warehouse.itemGroups,
      columns: LOOKUP_LABEL_COLUMNS,
      fields: ITEM_GROUP_FIELDS,
    },
    {
      id: 'itemSubGroups',
      labelKey: 'warehouse.tabs.subGroups',
      endpoint: API_ENDPOINTS.warehouse.itemSubGroups,
      columns: ITEM_SUBGROUP_COLUMNS,
      fields: ITEM_SUBGROUP_FIELDS,
    },
    {
      id: 'units',
      labelKey: 'warehouse.tabs.units',
      endpoint: API_ENDPOINTS.warehouse.units,
      columns: LOOKUP_LABEL_COLUMNS,
      fields: ITEM_GROUP_FIELDS,
    },
    {
      id: 'movements',
      labelKey: 'warehouse.tabs.movements',
      endpoint: API_ENDPOINTS.warehouse.movements,
      columns: MOVEMENT_COLUMNS,
      fields: MOVEMENT_FIELDS,
    },
    {
      id: 'receipts',
      labelKey: 'warehouse.tabs.receipts',
      endpoint: API_ENDPOINTS.warehouse.receipts,
      columns: RECEIPT_COLUMNS,
      fields: RECEIPT_FIELDS,
    },
    {
      id: 'purchaseRequests',
      labelKey: 'purchasing.tabs.requests',
      endpoint: API_ENDPOINTS.warehouse.purchaseRequests,
      columns: PURCHASE_REQUEST_COLUMNS,
      fields: DEPT_PURCHASE_REQUEST_FIELDS,
    },
  ];
}
