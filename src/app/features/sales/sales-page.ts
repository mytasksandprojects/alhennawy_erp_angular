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
import { SalesExportBoard } from './sales-export-board';
import {
  CUSTOMER_COLUMNS,
  CUSTOMER_FIELDS,
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
  imports: [ModuleDashboard, UiPageHeader, UiTabs, CrudPanel, CustomerStatement, SalesExportBoard],
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
      @case ('exportOrders') {
        <app-sales-export-board />
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
              [titleKey]="tab.labelKey"
              [printKind]="tab.id === 'invoices' ? 'invoice' : 'record'"
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
    const tabs: TabItem[] = [
      { id: 'workOrders', labelKey: 'sales.tabs.workOrders' },
      { id: 'exportOrders', labelKey: 'sales.tabs.exportOrders' },
      { id: 'invoices', labelKey: 'sales.tabs.invoices' },
      { id: 'customers', labelKey: 'sales.tabs.customers' },
      { id: 'statement', labelKey: 'sales.tabs.statement' },
    ].filter((tab) => this.access.canTab('sales', tab.id));
    if (this.access.canTab('sales', 'dashboard')) {
      tabs.unshift({ id: 'dashboard', labelKey: 'common.dashboardTab' });
    }
    return tabs;
  }
}
