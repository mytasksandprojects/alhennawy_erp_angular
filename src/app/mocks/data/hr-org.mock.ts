import { LookupValue } from '../../core/models/system.models';
import { TRANSLATIONS } from './i18n';
import { MOCK_LOOKUP_VALUES } from './lookups.mock';

type OrgGroup = 'administrations' | 'sections' | 'itemGroups' | 'itemSubGroups' | 'units';

function remember(value: string, labelAr: string, labelEn: string): void {
  TRANSLATIONS['ar'][value] = labelAr;
  TRANSLATIONS['en'][value] = labelEn;
}

function listGroup(group: OrgGroup): LookupValue[] {
  return MOCK_LOOKUP_VALUES.filter((row) => row.group === group);
}

function addGroup(group: OrgGroup, body: unknown): LookupValue {
  const draft = body as Partial<LookupValue>;
  const value = String(draft.value || '').trim() || `${group}.${Date.now()}`;
  const row: LookupValue = {
    ...(draft as object),
    id: `lv-${group.slice(0, 3)}-${Date.now()}`,
    group,
    value,
    labelAr: draft.labelAr ?? '',
    labelEn: draft.labelEn ?? '',
    parentValue: draft.parentValue,
  };
  remember(value, row.labelAr, row.labelEn);
  MOCK_LOOKUP_VALUES.unshift(row);
  return row;
}

function updateGroup(group: OrgGroup, id: string, body: unknown): LookupValue | null {
  const index = MOCK_LOOKUP_VALUES.findIndex((row) => row.id === id && row.group === group);
  if (index < 0) return null;
  const draft = body as Partial<LookupValue>;
  const next: LookupValue = {
    ...MOCK_LOOKUP_VALUES[index],
    ...draft,
    id,
    group,
    value: String(draft.value || '').trim() || MOCK_LOOKUP_VALUES[index].value,
  };
  remember(next.value, next.labelAr, next.labelEn);
  MOCK_LOOKUP_VALUES[index] = next;
  return next;
}

function deleteGroup(group: OrgGroup, id: string): { deleted: boolean } {
  const index = MOCK_LOOKUP_VALUES.findIndex((row) => row.id === id && row.group === group);
  if (index >= 0) MOCK_LOOKUP_VALUES.splice(index, 1);
  return { deleted: index >= 0 };
}

export const listAdministrations = () => listGroup('administrations');
export const addAdministration = (body: unknown) => addGroup('administrations', body);
export const updateAdministration = (id: string, body: unknown) => updateGroup('administrations', id, body);
export const deleteAdministration = (id: string) => deleteGroup('administrations', id);

export const listSections = () => listGroup('sections');
export const addSection = (body: unknown) => addGroup('sections', body);
export const updateSection = (id: string, body: unknown) => updateGroup('sections', id, body);
export const deleteSection = (id: string) => deleteGroup('sections', id);

export const listItemGroups = () => listGroup('itemGroups');
export const addItemGroup = (body: unknown) => addGroup('itemGroups', body);
export const updateItemGroup = (id: string, body: unknown) => updateGroup('itemGroups', id, body);
export const deleteItemGroup = (id: string) => deleteGroup('itemGroups', id);

export const listItemSubGroups = () => listGroup('itemSubGroups');
export const addItemSubGroup = (body: unknown) => addGroup('itemSubGroups', body);
export const updateItemSubGroup = (id: string, body: unknown) => updateGroup('itemSubGroups', id, body);
export const deleteItemSubGroup = (id: string) => deleteGroup('itemSubGroups', id);

export const listStockUnits = () => listGroup('units');
export const addStockUnit = (body: unknown) => addGroup('units', body);
export const updateStockUnit = (id: string, body: unknown) => updateGroup('units', id, body);
export const deleteStockUnit = (id: string) => deleteGroup('units', id);
