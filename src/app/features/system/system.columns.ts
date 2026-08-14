import { FormField, TableColumn } from '../../core/models/common.models';
import { LanguageOption } from '../../core/models/config.models';
import { keysToOptions } from '../../shared/crud/options';

export const AUDIT_COLUMNS: TableColumn[] = [
  { key: 'at', labelKey: 'system.fields.at', type: 'datetime' },
  { key: 'username', labelKey: 'system.fields.user' },
  { key: 'actionKey', labelKey: 'system.fields.action', type: 'key' },
  { key: 'moduleKey', labelKey: 'system.fields.module', type: 'key' },
  { key: 'reference', labelKey: 'system.fields.reference' },
  { key: 'ip', labelKey: 'system.fields.ip' },
  {
    key: 'result',
    labelKey: 'system.fields.result',
    type: 'badge',
    keyPrefix: 'system.results.',
    badgeToneMap: { success: 'success', denied: 'warning', failed: 'danger' },
  },
];

export const AUDIT_FIELDS: FormField[] = [
  { key: 'username', labelKey: 'system.fields.user', required: true },
  { key: 'actionKey', labelKey: 'system.fields.action' },
  { key: 'moduleKey', labelKey: 'system.fields.module' },
  { key: 'reference', labelKey: 'system.fields.reference' },
  { key: 'ip', labelKey: 'system.fields.ip' },
  { key: 'result', labelKey: 'system.fields.result', type: 'select', options: keysToOptions('system.results.', ['success', 'denied', 'failed']) },
];

const LOOKUP_GROUPS = [
  'leaveTypes',
  'expenseCategories',
  'journalSources',
  'bankNames',
  'warehouseKinds',
  'departments',
];

export const LOOKUP_COLUMNS: TableColumn[] = [
  {
    key: 'group',
    labelKey: 'system.fields.group',
    type: 'badge',
    keyPrefix: 'system.lookupGroups.',
    badgeToneMap: {},
  },
  { key: 'labelAr', labelKey: 'system.fields.labelAr' },
  { key: 'labelEn', labelKey: 'system.fields.labelEn' },
  { key: 'value', labelKey: 'system.fields.value' },
];

/**
 * Lookup form fields — one label input per configured system language.
 * Admin-added languages (Appearance → Languages) automatically get their
 * own input here; their labels are stored flat as `label_<code>`.
 */
export function lookupFields(languages: LanguageOption[]): FormField[] {
  return [
    { key: 'group', labelKey: 'system.fields.group', type: 'select', options: keysToOptions('system.lookupGroups.', LOOKUP_GROUPS), required: true },
    { key: 'labelAr', labelKey: 'system.fields.labelAr', required: true },
    { key: 'labelEn', labelKey: 'system.fields.labelEn', required: true },
    ...extraLanguageLabelFields(languages),
    { key: 'value', labelKey: 'system.fields.value', required: true },
  ];
}

/** Label inputs for every language beyond the built-in ar/en pair. */
export function extraLanguageLabelFields(
  languages: LanguageOption[],
): FormField[] {
  return languages
    .filter((lang) => lang.code !== 'ar' && lang.code !== 'en')
    .map((lang) => ({
      key: `label_${lang.code}`,
      labelKey: lang.labelKey,
    }));
}
