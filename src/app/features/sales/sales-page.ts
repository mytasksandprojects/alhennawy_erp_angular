import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AccessService } from '../../core/security/access.service';
import { AuthService } from '../../core/security/auth.service';
import { CrudPanel } from '../../shared/components/crud-panel';
import { ListTabConfig } from '../../shared/components/module-tabbed-view';
import { ModuleDashboard } from '../../shared/components/module-dashboard';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { routedTab, tabNavigator } from '../../shared/tab-route';
import { CustomerStatement } from './customer-statement';
import {
  CUSTOMER_COLUMNS,
  CUSTOMER_FIELDS,
  EXPORT_ORDER_COLUMNS,
  EXPORT_ORDER_FIELDS,
  INVOICE_COLUMNS,
  INVOICE_FIELDS,
  WORK_ORDER_FIELDS,
  workOrderColumns,
} from './sales.columns';

/**
 * المبيعات — local work orders, customers (each with a unique code),
 * customer account statements (كشف حساب), export pipeline and invoices.
 * Prices render only for Finance users.
 */
@Component({
  selector: 'app-sales-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleDashboard, UiPageHeader, UiTabs, CrudPanel, CustomerStatement],
  template: `
    <ui-page-header titleKey="sales.title" subtitleKey="sales.subtitle" />

    <ui-tabs
      [tabs]="tabItems()"
      [active]="active()"
      (activeChange)="activate($event)"
    />

    @switch (active()) {
      @case ('dashboard') {
        <module-dashboard moduleId="sales" />
      }
      @case ('statement') {
        <app-customer-statement />
      }
      @default {
        @for (tab of crudTabs; track tab.id) {
          @if (tab.id === active()) {
            <crud-panel
              moduleId="sales"
              [tabId]="tab.id"
              [endpoint]="tab.endpoint!"
              [columns]="tab.columns!"
              [fields]="tab.fields ?? []"
              [idKey]="tab.idKey ?? 'id'"
            />
          }
        }
      }
    }
  `,
})
export class SalesPage {
  private readonly auth = inject(AuthService);
  private readonly access = inject(AccessService);

  protected readonly active = routedTab('dashboard');
  private readonly navigateToTab = tabNavigator();

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }

  protected readonly crudTabs: ListTabConfig[] = [
    {
      id: 'workOrders',
      labelKey: 'sales.tabs.workOrders',
      endpoint: API_ENDPOINTS.sales.workOrders,
      columns: workOrderColumns(this.auth.hasPermission('finance.viewPrices')),
      fields: WORK_ORDER_FIELDS,
    },
    {
      id: 'exportOrders',
      labelKey: 'sales.tabs.exportOrders',
      endpoint: API_ENDPOINTS.sales.exportOrders,
      columns: EXPORT_ORDER_COLUMNS,
      fields: EXPORT_ORDER_FIELDS,
    },
    {
      id: 'invoices',
      labelKey: 'sales.tabs.invoices',
      endpoint: API_ENDPOINTS.sales.invoices,
      columns: INVOICE_COLUMNS,
      fields: INVOICE_FIELDS,
    },
    {
      id: 'customers',
      labelKey: 'sales.tabs.customers',
      endpoint: API_ENDPOINTS.sales.customers,
      columns: CUSTOMER_COLUMNS,
      fields: CUSTOMER_FIELDS,
      idKey: 'code',
    },
  ];

  protected tabItems(): TabItem[] {
    const tabs = this.crudTabs
      .filter((tab) => this.access.canTab('sales', tab.id))
      .map((tab) => ({ id: tab.id, labelKey: tab.labelKey }));
    if (this.access.canTab('sales', 'statement')) {
      tabs.push({ id: 'statement', labelKey: 'sales.tabs.statement' });
    }
    if (this.access.canTab('sales', 'dashboard')) {
      tabs.unshift({ id: 'dashboard', labelKey: 'common.dashboardTab' });
    }
    return tabs;
  }
}
