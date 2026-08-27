/** Shared API envelope and UI-agnostic building blocks. */

export interface ApiResponse<T> {
  data: T;
  meta?: { total?: number; page?: number; pageSize?: number };
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

/** Column definition — labels are translation keys, never literal text. */
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  labelKey: string;
  /**
   * text: raw value • number/currency: locale formatted • date/datetime:
   * locale formatted • key: cell value IS a translation key • badge:
   * translated as `keyPrefix + value` with a tone from `badgeToneMap`.
   */
  type?: 'text' | 'number' | 'currency' | 'date' | 'datetime' | 'key' | 'badge' | 'image' | 'files';
  align?: 'start' | 'center' | 'end';
  /** Text cell resolved in the active language (falls back to base key). */
  multilang?: boolean;
  /** For type=badge: translation key prefix prepended to the cell value. */
  keyPrefix?: string;
  /** For type=badge: maps a cell value to a badge tone. */
  badgeToneMap?: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'>;
  /** Ordered workflow for row status buttons. Danger tones stay as extras. */
  statusFlow?: string[];
}

/** In-app destination used by clickable KPI cards and alert rows. */
export interface RouteTarget {
  route?: string;
  query?: Record<string, string>;
  fragment?: string;
}

export interface StatCardData extends RouteTarget {
  id: string;
  labelKey: string;
  value: number;
  unitKey?: string;
  icon: string;
  /** Trend vs previous period, percent. Positive = up. */
  trendPercent?: number;
  toneToken?: string;
}

export interface ChartPoint {
  labelKey?: string;
  label?: string;
  value: number;
}

/** bars: horizontal • columns: vertical • donut: share-of-total ring. */
export type ChartKind = 'bars' | 'columns' | 'donut';

export interface ChartData {
  id: string;
  titleKey: string;
  kind?: ChartKind;
  points: ChartPoint[];
}

export interface AlertItem extends RouteTarget {
  id: string;
  messageKey: string;
  /** Values interpolated into the message ({0}, {1}...). */
  params?: (string | number)[];
  severity: 'info' | 'warning' | 'danger';
  date: string;
  /** Sidebar module that owns this alert (`menu.weighbridge`, …). */
  moduleKey?: string;
}

export interface DashboardData {
  stats: StatCardData[];
  charts: ChartData[];
  alerts: AlertItem[];
}

export interface SelectOption {
  value: string;
  labelKey?: string;
  /** Raw display text (admin-managed lookups) when labelKey is absent. */
  label?: string;
}

/** Field used by the shared create/edit form — labels are translation keys. */
/** Multi-image values are stored as one string: URLs joined with `|`. */
export const IMAGE_LIST_SEPARATOR = '|';

export function splitImageList(value: string): string[] {
  return value
    .split(IMAGE_LIST_SEPARATOR)
    .map((url) => url.trim())
    .filter(Boolean);
}

/**
 * File entries keep their original name in the URL fragment
 * (`<url>#<name>`) so uploads stay recognizable and downloadable.
 */
export function fileEntryName(url: string): string {
  const hash = url.split('#')[1] ?? '';
  if (hash) {
    try {
      return decodeURIComponent(hash);
    } catch {
      return hash;
    }
  }
  const clean = url.split('?')[0];
  const segment = clean.split('/').pop() ?? '';
  return clean.startsWith('data:') ? '' : segment;
}

export function fileEntryHref(url: string): string {
  return url.split('#')[0];
}

/**
 * Multilingual text convention: the base key stores the value in the
 * system default language; other languages store flat as `key_<code>`.
 */
export function multilangKey(
  baseKey: string,
  lang: string,
  defaultLang: string,
): string {
  return lang === defaultLang ? baseKey : `${baseKey}_${lang}`;
}

/**
 * Base for entities with admin-entered translatable text. Non-default
 * language values are stored flat as `<field>_<lang>` (e.g. `name_en`).
 */
export interface Localized {
  [langVariant: `${string}_${string}`]: string | undefined;
}

export interface FormField {
  key: string;
  labelKey: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'images' | 'files' | 'lines';
  required?: boolean;
  /** Text field repeated once per configured language (see multilangKey). */
  multilang?: boolean;
  options?: SelectOption[];
  /** Admin-managed lookup group id — options load from the lookups API. */
  lookup?: string;
  /**
   * Lookup selects only: when an option is picked, its stored default
   * rate is copied into this draft key (the user may then override it).
   */
  rateKey?: string;
  /** Lookup selects only: copy the chosen option label into this draft key. */
  copyKey?: string;
  /** Issued by the system on create — hidden in the add form, read-only later. */
  generated?: boolean;
  generatedPrefix?: string;
}
