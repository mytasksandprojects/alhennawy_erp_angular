import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  MOVEMENT_COLUMNS,
  MOVEMENT_FIELDS,
  RECEIPT_COLUMNS,
  RECEIPT_FIELDS,
  STOCK_ITEM_COLUMNS,
  STOCK_ITEM_FIELDS,
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
      idKey: 'code',
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
  ];
}
