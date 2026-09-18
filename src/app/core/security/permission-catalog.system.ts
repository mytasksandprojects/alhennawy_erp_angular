import { CatalogModule } from '../models/access.models';
import { ATTENDANCE_COLUMNS } from '../../features/hr/hr.columns';
import { AUDIT_COLUMNS, LOOKUP_COLUMNS } from '../../features/system/system.columns';
import { catalogTab, reportTabs } from './permission-catalog.helpers';

/** System-side modules at the tail of the roles matrix. */
export const SYSTEM_CATALOG: CatalogModule[] = [
  { id: 'reports', labelKey: 'menu.reports', tabs: reportTabs() },
  {
    id: 'factory',
    labelKey: 'menu.factory',
    tabs: [
      catalogTab('profile', 'factory.title', [
        { key: 'name', labelKey: 'factory.fields.name', multilang: true },
        { key: 'address', labelKey: 'factory.fields.address', multilang: true },
        { key: 'phone', labelKey: 'factory.fields.phone' },
        { key: 'fax', labelKey: 'factory.fields.fax' },
        { key: 'logoUrl', labelKey: 'factory.fields.logo' },
        { key: 'iso', labelKey: 'factory.fields.iso' },
      ]),
    ],
  },
  {
    id: 'appearance',
    labelKey: 'menu.appearance',
    tabs: [
      catalogTab('theme', 'appearance.tabs.theme', []),
      catalogTab('translations', 'appearance.tabs.translations', []),
      catalogTab('languages', 'appearance.tabs.languages', [
        { key: 'code', labelKey: 'appearance.fields.code' },
        { key: 'name', labelKey: 'appearance.fields.name' },
        { key: 'direction', labelKey: 'appearance.fields.direction' },
      ]),
    ],
  },
  { id: 'backups', labelKey: 'menu.backups', tabs: [catalogTab('list', 'backup.title', [])] },
  {
    id: 'taxApi',
    labelKey: 'menu.taxApi',
    tabs: [
      catalogTab('settings', 'taxApi.title', [
        { key: 'enabled', labelKey: 'taxApi.fields.enabled' },
        { key: 'environment', labelKey: 'taxApi.fields.environment' },
        { key: 'apiUrl', labelKey: 'taxApi.fields.apiUrl' },
        { key: 'clientId', labelKey: 'taxApi.fields.clientId' },
        { key: 'clientSecret', labelKey: 'taxApi.fields.clientSecret' },
        { key: 'registrationNumber', labelKey: 'taxApi.fields.registrationNumber' },
        { key: 'branchCode', labelKey: 'taxApi.fields.branchCode' },
        { key: 'activityCode', labelKey: 'taxApi.fields.activityCode' },
        { key: 'posSerial', labelKey: 'taxApi.fields.posSerial' },
        { key: 'issuerType', labelKey: 'taxApi.fields.issuerType' },
        { key: 'documentVersion', labelKey: 'taxApi.fields.documentVersion' },
      ]),
    ],
  },
  {
    id: 'system',
    labelKey: 'menu.system',
    tabs: [
      catalogTab('audit', 'system.tabs.audit', AUDIT_COLUMNS),
      catalogTab('lookups', 'system.tabs.lookups', LOOKUP_COLUMNS),
      catalogTab('switches', 'system.tabs.switches', []),
    ],
  },
  { id: 'checkin', labelKey: 'menu.checkin', tabs: [catalogTab('punch', 'checkin.title', ATTENDANCE_COLUMNS)] },
  { id: 'roles', labelKey: 'menu.roles', tabs: [catalogTab('matrix', 'roles.title', [])] },
];
