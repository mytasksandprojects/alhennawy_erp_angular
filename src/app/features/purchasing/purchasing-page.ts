import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  PURCHASE_ORDER_COLUMNS,
  PURCHASE_ORDER_FIELDS,
  PURCHASE_REQUEST_COLUMNS,
  PURCHASE_REQUEST_FIELDS,
  QUOTATION_COLUMNS,
  QUOTATION_FIELDS,
  SUPPLIER_COLUMNS,
  SUPPLIER_FIELDS,
} from './purchasing.columns';

/** المشتريات — PR → quotation comparison → PO, plus supplier registry. */
@Component({
  selector: 'app-purchasing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="purchasing"
      titleKey="purchasing.title"
      subtitleKey="purchasing.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class PurchasingPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'requests',
      labelKey: 'purchasing.tabs.requests',
      endpoint: API_ENDPOINTS.purchasing.requests,
      columns: PURCHASE_REQUEST_COLUMNS,
      fields: PURCHASE_REQUEST_FIELDS,
    },
    {
      id: 'quotations',
      labelKey: 'purchasing.tabs.quotations',
      endpoint: API_ENDPOINTS.purchasing.quotations,
      columns: QUOTATION_COLUMNS,
      fields: QUOTATION_FIELDS,
    },
    {
      id: 'orders',
      labelKey: 'purchasing.tabs.orders',
      endpoint: API_ENDPOINTS.purchasing.orders,
      columns: PURCHASE_ORDER_COLUMNS,
      fields: PURCHASE_ORDER_FIELDS,
    },
    {
      id: 'suppliers',
      labelKey: 'purchasing.tabs.suppliers',
      endpoint: API_ENDPOINTS.purchasing.suppliers,
      columns: SUPPLIER_COLUMNS,
      fields: SUPPLIER_FIELDS,
      idKey: 'code',
    },
  ];
}
