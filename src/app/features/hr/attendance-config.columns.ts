import { FormField, TableColumn } from '../../core/models/common.models';

export const LOCATION_COLUMNS: TableColumn[] = [
  { key: 'name', labelKey: 'hr.fields.location', multilang: true },
  { key: 'wifiSsid', labelKey: 'hr.fields.wifiSsid' },
  { key: 'latitude', labelKey: 'hr.fields.latitude', type: 'number' },
  { key: 'longitude', labelKey: 'hr.fields.longitude', type: 'number' },
  { key: 'radiusMeters', labelKey: 'hr.fields.radius', type: 'number', align: 'center' },
];

export const LOCATION_FIELDS: FormField[] = [
  { key: 'name', labelKey: 'hr.fields.location', required: true, multilang: true },
  { key: 'wifiSsid', labelKey: 'hr.fields.wifiSsid', required: true },
  { key: 'latitude', labelKey: 'hr.fields.latitude', type: 'number' },
  { key: 'longitude', labelKey: 'hr.fields.longitude', type: 'number' },
  { key: 'radiusMeters', labelKey: 'hr.fields.radius', type: 'number' },
];
