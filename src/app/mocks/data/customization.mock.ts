import {
  LanguageOption,
  ThemeConfig,
  ThemeMode,
} from '../../core/models/config.models';
import { MockApiError } from '../mock-backend.interceptor';
import { TRANSLATIONS } from './i18n';
import { MOCK_SETTINGS } from './settings.mock';
import { MOCK_THEMES } from './theme.mock';

/**
 * MOCK LAYER — admin customization endpoints. Theme tokens, translation
 * values and the language list are all mutable at runtime, exactly as the
 * real backend will allow. The frontend only ever reads these via the
 * config APIs, so admin edits propagate to the whole system.
 */

export function setThemeToken(mode: string, body: unknown): ThemeConfig {
  const theme = MOCK_THEMES[mode as ThemeMode];
  if (!theme) throw new MockApiError(404, 'unknown-theme');
  const { key, value } = body as { key?: string; value?: string };
  if (!key || value === undefined) throw new MockApiError(400, 'invalid-token');
  theme.tokens[key] = value;
  return theme;
}

export function setTranslationValue(
  lang: string,
  body: unknown,
): { key: string; value: string } {
  const map = TRANSLATIONS[lang];
  if (!map) throw new MockApiError(404, 'unknown-language');
  const { key, value } = body as { key?: string; value?: string };
  // Keys are owned by the frontend contract — only values are editable.
  if (!key || !(key in map)) throw new MockApiError(404, 'unknown-key');
  map[key] = value ?? '';
  return { key, value: map[key] };
}

export function addLanguage(body: unknown): LanguageOption[] {
  const { code, name, dir } = body as {
    code?: string;
    name?: string;
    dir?: string;
  };
  const clean = (code ?? '').trim().toLowerCase();
  if (!clean || !name || (dir !== 'rtl' && dir !== 'ltr')) {
    throw new MockApiError(400, 'invalid-language');
  }
  if (MOCK_SETTINGS.languages.some((l) => l.code === clean)) {
    throw new MockApiError(409, 'language-exists');
  }
  // New language starts as a copy of the default language, so every key
  // exists immediately; the admin then edits values in the editor.
  TRANSLATIONS[clean] = { ...TRANSLATIONS[MOCK_SETTINGS.defaultLanguage] };
  const labelKey = `lang.${clean}`;
  for (const map of Object.values(TRANSLATIONS)) map[labelKey] = name;
  MOCK_SETTINGS.languages.push({ code: clean, labelKey, dir });
  return MOCK_SETTINGS.languages;
}
