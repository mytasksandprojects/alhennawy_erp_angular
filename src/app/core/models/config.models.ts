/**
 * Everything visual or textual in the application is delivered by the API
 * through these contracts. Nothing is hardcoded in components:
 *  - `ThemeConfig.tokens` become CSS custom properties on `:root`.
 *  - `TranslationMap` feeds every label through `I18nService.t(key)`.
 *  - `MenuItem.labelKey` drives the sidebar.
 * If the API returns nothing, the app intentionally renders a white screen.
 */

/** Open-ended: administrators can add languages at runtime. */
export type LanguageCode = string;

export interface LanguageOption {
  code: LanguageCode;
  labelKey: string;
  dir: 'rtl' | 'ltr';
}

export type ThemeMode = 'light' | 'dark';

/** Design tokens: colors, radii, spacing, borders, fonts, shadows, numbers. */
export interface ThemeConfig {
  id: string;
  /** Applied as `--<key>: <value>` on the document root. */
  tokens: Record<string, string>;
}

export type TranslationMap = Record<string, string>;

export interface MenuItem {
  id: string;
  labelKey: string;
  icon: string;
  route?: string;
  permission?: string;
  children?: MenuItem[];
}

export interface CompanyProfile {
  nameKey: string;
  addressKey: string;
  phone: string;
  fax: string;
  logoUrl: string;
  /** Wordmark-on-light variant for the dark sidebar (transparent, no plate). */
  sidebarLogoUrl: string;
  madeInKey: string;
  isoCertifications: string[];
}

/** Factory Settings payload — company letterhead used on printed documents. */
export interface FactoryProfilePayload {
  phone: string;
  fax: string;
  logoUrl: string;
  sidebarLogoUrl: string;
  isoCertifications: string[];
  names: Record<string, string>;
  addresses: Record<string, string>;
}

export interface WeighbridgeSettings {
  /** Alert threshold between first and second weighing (hours). */
  maxHoursBetweenWeighings: number;
  /** Weight difference considered abnormal (percent). */
  abnormalDifferencePercent: number;
  /** Serial numbers are mandatory and sequential — no gaps allowed. */
  enforceSequentialSerials: boolean;
}

export interface CacheSettings {
  /** TTL for cached GET responses, in seconds. */
  httpTtlSeconds: number;
  /** TTL for config/theme/translations, in seconds. */
  configTtlSeconds: number;
  /** Storage key prefix, provided by API so it is not hardcoded. */
  storagePrefix: string;
}

/** Test credentials shown as one-click login buttons (mock/staging only). */
export interface DemoAccount {
  labelKey: string;
  username: string;
  password: string;
}

export interface AppSettings {
  appTitleKey: string;
  defaultLanguage: LanguageCode;
  languages: LanguageOption[];
  dateFormat: string;
  currencyDisplay: { localeCode: string; maxFractionDigits: number };
  company: CompanyProfile;
  weighbridge: WeighbridgeSettings;
  cache: CacheSettings;
  /** Omitted by the production API — buttons then simply don't render. */
  demoAccounts?: DemoAccount[];
}

/** Bundle fetched once at bootstrap (then cached with configTtl). */
export interface AppConfigBundle {
  settings: AppSettings;
  theme: ThemeConfig;
  menu: MenuItem[];
}
