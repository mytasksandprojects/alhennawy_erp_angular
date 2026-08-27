import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormField, TableColumn } from '../../core/models/common.models';
import { AccessService } from '../../core/security/access.service';
import { routedTab, tabNavigator } from '../tab-route';
import { Translated } from '../translated.base';
import { CrudPanel } from './crud-panel';
import { ModuleDashboard } from './module-dashboard';
import { UiPageHeader } from './ui-page-header';
import { UiTabs, TabItem } from './ui-tabs';

/** Declarative CRUD tab: endpoint + columns + form fields. */
export interface ListTabConfig {
  id: string;
  labelKey: string;
  endpoint?: string;
  columns?: TableColumn[];
  fields?: FormField[];
  idKey?: string;
  custom?: boolean;
}

/**
 * Standard module screen: dashboard + CRUD lists.
 * Each department is this one component plus a fields/columns config.
 */
@Component({
  selector: 'module-tabbed-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleDashboard, UiPageHeader, UiTabs, CrudPanel],
  template: `
    <ui-page-header [titleKey]="titleKey()" [subtitleKey]="subtitleKey()">
      <ng-content select="[headerActions]" />
    </ui-page-header>

    <ui-tabs
      [tabs]="tabItems()"
      [active]="active()"
      (activeChange)="activate($event)"
    />

    @if (active() === 'dashboard') {
      <module-dashboard [moduleId]="moduleId()" />
    } @else if (customActive()) {
      <ng-content />
    } @else {
      @for (tab of visibleTabs(); track tab.id) {
        @if (tab.id === active() && tab.endpoint && tab.columns) {
          <crud-panel
            [moduleId]="moduleId()"
            [tabId]="tab.id"
            [endpoint]="tab.endpoint"
            [columns]="tab.columns"
            [fields]="tab.fields ?? []"
            [idKey]="tab.idKey ?? 'id'"
            [titleKey]="tab.labelKey"
            [printKind]="tab.id === 'invoices' ? 'invoice' : 'record'"
          />
        }
      }
    }
  `,
})
export class ModuleTabbedView extends Translated {
  readonly moduleId = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string | null>(null);
  readonly listTabs = input.required<ListTabConfig[]>();
  private readonly access = inject(AccessService);

  protected readonly active = routedTab('dashboard');
  private readonly navigateToTab = tabNavigator();

  protected visibleTabs(): ListTabConfig[] {
    return this.listTabs().filter((tab) => this.access.canTab(this.moduleId(), tab.id));
  }

  protected customActive(): boolean {
    return this.visibleTabs().some((tab) => tab.id === this.active() && tab.custom);
  }

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }

  protected tabItems(): TabItem[] {
    const lists = this.visibleTabs().map((tab) => ({ id: tab.id, labelKey: tab.labelKey }));
    if (!this.access.canTab(this.moduleId(), 'dashboard')) return lists;
    return [{ id: 'dashboard', labelKey: 'common.dashboardTab' }, ...lists];
  }
}
