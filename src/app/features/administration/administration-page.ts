import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  CONTRACT_COLUMNS,
  CONTRACT_FIELDS,
  CUSTODY_COLUMNS,
  CUSTODY_FIELDS,
  DOCUMENT_COLUMNS,
  DOCUMENT_FIELDS,
  FLEET_COLUMNS,
  FLEET_FIELDS,
  PERMIT_COLUMNS,
  PERMIT_FIELDS,
} from './administration.columns';
import {
  CERTIFICATE_COLUMNS,
  CERTIFICATE_FIELDS,
} from '../safety/safety.columns';

/**
 * الشئون الإدارية — factory documents (tax card, commercial register…),
 * fleet with driver/license attachments, custody, contracts, permits.
 * Safety certificates are managed in the Safety module and mirrored here.
 */
@Component({
  selector: 'app-administration-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="administration"
      titleKey="administration.title"
      subtitleKey="administration.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class AdministrationPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'documents',
      labelKey: 'administration.tabs.documents',
      endpoint: API_ENDPOINTS.administration.documents,
      columns: DOCUMENT_COLUMNS,
      fields: DOCUMENT_FIELDS,
    },
    {
      id: 'fleet',
      labelKey: 'administration.tabs.fleet',
      endpoint: API_ENDPOINTS.administration.fleet,
      columns: FLEET_COLUMNS,
      fields: FLEET_FIELDS,
    },
    {
      id: 'custody',
      labelKey: 'administration.tabs.custody',
      endpoint: API_ENDPOINTS.administration.custody,
      columns: CUSTODY_COLUMNS,
      fields: CUSTODY_FIELDS,
    },
    {
      id: 'contracts',
      labelKey: 'administration.tabs.contracts',
      endpoint: API_ENDPOINTS.administration.contracts,
      columns: CONTRACT_COLUMNS,
      fields: CONTRACT_FIELDS,
    },
    {
      id: 'permits',
      labelKey: 'administration.tabs.permits',
      endpoint: API_ENDPOINTS.administration.permits,
      columns: PERMIT_COLUMNS,
      fields: PERMIT_FIELDS,
    },
    {
      // Mirrors the Safety module's certificates so admins see them here too.
      id: 'safetyCerts',
      labelKey: 'safety.tabs.certificates',
      endpoint: API_ENDPOINTS.safety.certificates,
      columns: CERTIFICATE_COLUMNS,
      fields: CERTIFICATE_FIELDS,
    },
  ];
}
