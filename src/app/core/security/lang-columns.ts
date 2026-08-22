import { CatalogColumn, CatalogModule } from '../models/access.models';
import { multilangKey } from '../models/common.models';
import { LanguageOption } from '../models/config.models';

/**
 * Adds a grantable column for every extra language so the roles matrix
 * stays in sync with Appearance → Languages (same keys the API will use).
 */
export function expandCatalogLanguages(
  modules: CatalogModule[],
  languages: LanguageOption[],
  defaultLang = 'ar',
): CatalogModule[] {
  return modules.map((mod) => ({
    ...mod,
    tabs: mod.tabs.map((tab) => ({
      ...tab,
      columns: expandTabColumns(tab.id, tab.columns, languages, defaultLang),
    })),
  }));
}

function expandTabColumns(
  tabId: string,
  columns: CatalogColumn[],
  languages: LanguageOption[],
  defaultLang: string,
): CatalogColumn[] {
  const have = new Set(columns.map((col) => col.key));
  const extra: CatalogColumn[] = [];
  if (tabId === 'translations' && !columns.length) {
    return languages.map((lang) => ({ key: lang.code, labelKey: lang.labelKey }));
  }
  if (columns.some((col) => col.key === 'labelAr' || col.key === 'labelEn')) {
    for (const lang of languages) {
      if (lang.code === 'ar' || lang.code === 'en') continue;
      const key = `label_${lang.code}`;
      if (have.has(key)) continue;
      extra.push({ key, labelKey: lang.labelKey });
      have.add(key);
    }
  }
  for (const col of columns) {
    if (!col.multilang) continue;
    for (const lang of languages) {
      const key = multilangKey(col.key, lang.code, defaultLang);
      if (key === col.key || have.has(key)) continue;
      extra.push({ key, labelKey: col.labelKey, langKey: lang.labelKey });
      have.add(key);
    }
  }
  return extra.length ? [...columns, ...extra] : columns;
}
