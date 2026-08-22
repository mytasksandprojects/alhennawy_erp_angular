/** Role matrix + attendance policy contracts. */

export const ACCESS_ACTIONS = [
  'create',
  'edit',
  'delete',
  'print',
  'pdf',
  'excel',
] as const;

export type AccessAction = (typeof ACCESS_ACTIONS)[number];

export interface CatalogColumn {
  key: string;
  labelKey: string;
  /** Table/form field that grows one grant per configured language. */
  multilang?: boolean;
  /** Extra language column — shown as `labelKey — langKey`. */
  langKey?: string;
}

export interface CatalogTab {
  id: string;
  labelKey: string;
  columns: CatalogColumn[];
}

export interface CatalogModule {
  id: string;
  labelKey: string;
  tabs: CatalogTab[];
}

export interface AppRole {
  id: string;
  nameKey?: string;
  name?: string;
  name_en?: string;
  permissions: string[];
}

export interface AttendanceLocation {
  id: string;
  name: string;
  name_en?: string;
  wifiSsid: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface AttendancePolicy {
  wifiOnly: boolean;
  locationRequired: boolean;
  /** Demo workstation SSID used when the browser cannot read Wi-Fi. */
  demoSsid: string;
  demoLatitude: number;
  demoLongitude: number;
}

export function viewPerm(moduleId: string): string {
  return `${moduleId}.view`;
}

export function tabPerm(moduleId: string, tabId: string): string {
  return `${moduleId}.tab.${tabId}`;
}

export function colPerm(moduleId: string, tabId: string, key: string): string {
  return `${moduleId}.col.${tabId}.${key}`;
}

export function actPerm(moduleId: string, tabId: string, action: string): string {
  return `${moduleId}.act.${tabId}.${action}`;
}
