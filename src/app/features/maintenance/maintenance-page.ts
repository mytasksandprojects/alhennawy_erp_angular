import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import { MAINTENANCE_COLUMNS, MAINTENANCE_FIELDS } from '../quality/quality.columns';

/** الصيانة — schedule jobs raised by quality or production. */
@Component({
  selector: 'app-maintenance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="maintenance"
      titleKey="maintenance.title"
      subtitleKey="maintenance.subtitle"
      startTab="jobs"
      [listTabs]="tabs"
    />
  `,
})
export class MaintenancePage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'jobs',
      labelKey: 'maintenance.tabs.jobs',
      endpoint: API_ENDPOINTS.maintenance.jobs,
      columns: MAINTENANCE_COLUMNS,
      fields: MAINTENANCE_FIELDS,
    },
  ];
}
