import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormField, TableColumn } from '../../core/models/common.models';
import { initialTab, tabNavigator } from '../tab-route';
import { Translated } from '../translated.base';
import { CrudPanel } from './crud-panel';
import { ModuleDashboard } from './module-dashboard';
import { UiPageHeader } from './ui-page-header';
import { UiTabs, TabItem } from './ui-tabs';

/** Declarative CRUD tab: endpoint + columns + form fields. */
export interface ListTabConfig {
  id: string;
  labelKey: string;
  endpoint: string;
  columns: TableColumn[];
  fields: FormField[];
  idKey?: string;
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
      <ng-content />
    </ui-page-header>

    <ui-tabs
      [tabs]="tabItems()"
      [active]="active()"
      (activeChange)="activate($event)"
    />

    @if (active() === 'dashboard') {
      <module-dashboard [moduleId]="moduleId()" />
    } @else {
      @for (tab of listTabs(); track tab.id) {
        @if (tab.id === active()) {
          <crud-panel
            [endpoint]="tab.endpoint"
            [columns]="tab.columns"
            [fields]="tab.fields"
            [idKey]="tab.idKey ?? 'id'"
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

  protected readonly active = signal(initialTab('dashboard'));
  private readonly navigateToTab = tabNavigator();

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }

  protected tabItems(): TabItem[] {
    return [
      { id: 'dashboard', labelKey: 'common.dashboardTab' },
      ...this.listTabs().map((tab) => ({ id: tab.id, labelKey: tab.labelKey })),
    ];
  }
}
