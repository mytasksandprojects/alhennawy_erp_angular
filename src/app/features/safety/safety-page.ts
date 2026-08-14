import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  CERTIFICATE_COLUMNS,
  CERTIFICATE_FIELDS,
  INSURANCE_COLUMNS,
  INSURANCE_FIELDS,
} from './safety.columns';

/**
 * السلامة والصحة المهنية — safety certificates (fire system, civil
 * defense…) and insurance for employees and equipment. Employee
 * penalties live in the HR module.
 */
@Component({
  selector: 'app-safety-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="safety"
      titleKey="safety.title"
      subtitleKey="safety.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class SafetyPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'certificates',
      labelKey: 'safety.tabs.certificates',
      endpoint: API_ENDPOINTS.safety.certificates,
      columns: CERTIFICATE_COLUMNS,
      fields: CERTIFICATE_FIELDS,
    },
    {
      id: 'insurance',
      labelKey: 'safety.tabs.insurance',
      endpoint: API_ENDPOINTS.safety.insurance,
      columns: INSURANCE_COLUMNS,
      fields: INSURANCE_FIELDS,
    },
  ];
}
