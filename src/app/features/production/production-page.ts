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
import { PRODUCTION_ORDER_COLUMNS, PRODUCTION_ORDER_FIELDS } from './production.columns';

/** الإنتاج — orders (incl. auto-created when stock can't cover a sale). */
@Component({
  selector: 'app-production-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="production"
      titleKey="production.title"
      subtitleKey="production.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class ProductionPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'orders',
      labelKey: 'production.tabs.orders',
      endpoint: API_ENDPOINTS.production.orders,
      columns: PRODUCTION_ORDER_COLUMNS,
      fields: PRODUCTION_ORDER_FIELDS,
    },
    {
      id: 'purchaseRequests',
      labelKey: 'purchasing.tabs.requests',
      endpoint: API_ENDPOINTS.production.purchaseRequests,
      columns: PURCHASE_REQUEST_COLUMNS,
      fields: DEPT_PURCHASE_REQUEST_FIELDS,
    },
  ];
}
