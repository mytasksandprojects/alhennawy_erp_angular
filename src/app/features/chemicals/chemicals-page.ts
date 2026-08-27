import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import { ACCOUNT_COLUMNS, ACCOUNT_FIELDS, JOURNAL_COLUMNS, JOURNAL_FIELDS } from '../finance/finance.columns';
import { CUSTOMER_COLUMNS, CUSTOMER_FIELDS } from '../sales/sales.columns';
import { MOVEMENT_COLUMNS, MOVEMENT_FIELDS, STOCK_ITEM_COLUMNS, STOCK_ITEM_FIELDS } from '../warehouse/warehouse.columns';
import {
  OUTPUT_COLUMNS,
  OUTPUT_FIELDS,
  PURCHASE_COLUMNS,
  PURCHASE_FIELDS,
  STAFF_COLUMNS,
  STAFF_FIELDS,
} from './chemicals.columns';

/** مصنع الكيماويات — إنتاج، مخزن خامات، عملاء، إضافة/صرف، وحسابات. */
@Component({
  selector: 'app-chemicals-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="chemicals"
      titleKey="chemicals.title"
      subtitleKey="chemicals.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class ChemicalsPage {
  protected readonly tabs: ListTabConfig[] = [
    { id: 'output', labelKey: 'chemicals.tabs.output', endpoint: API_ENDPOINTS.chemicals.output, columns: OUTPUT_COLUMNS, fields: OUTPUT_FIELDS },
    { id: 'staff', labelKey: 'chemicals.tabs.staff', endpoint: API_ENDPOINTS.chemicals.staff, columns: STAFF_COLUMNS, fields: STAFF_FIELDS },
    { id: 'rawPurchases', labelKey: 'chemicals.tabs.rawPurchases', endpoint: API_ENDPOINTS.chemicals.rawPurchases, columns: PURCHASE_COLUMNS, fields: PURCHASE_FIELDS },
    { id: 'opPurchases', labelKey: 'chemicals.tabs.opPurchases', endpoint: API_ENDPOINTS.chemicals.operationalPurchases, columns: PURCHASE_COLUMNS, fields: PURCHASE_FIELDS },
    { id: 'rawWarehouse', labelKey: 'chemicals.tabs.rawWarehouse', endpoint: API_ENDPOINTS.chemicals.rawWarehouse, columns: STOCK_ITEM_COLUMNS, fields: STOCK_ITEM_FIELDS, idKey: 'code' },
    { id: 'customers', labelKey: 'chemicals.tabs.customers', endpoint: API_ENDPOINTS.chemicals.customers, columns: CUSTOMER_COLUMNS, fields: CUSTOMER_FIELDS, idKey: 'code' },
    { id: 'movements', labelKey: 'chemicals.tabs.movements', endpoint: API_ENDPOINTS.chemicals.movements, columns: MOVEMENT_COLUMNS, fields: MOVEMENT_FIELDS },
    { id: 'accounts', labelKey: 'chemicals.tabs.accounts', endpoint: API_ENDPOINTS.chemicals.accounts, columns: ACCOUNT_COLUMNS, fields: ACCOUNT_FIELDS, idKey: 'code' },
    { id: 'journal', labelKey: 'chemicals.tabs.journal', endpoint: API_ENDPOINTS.chemicals.journal, columns: JOURNAL_COLUMNS, fields: JOURNAL_FIELDS },
  ];
}
