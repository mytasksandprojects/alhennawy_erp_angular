import { TableColumn, multilangKey } from '../../core/models/common.models';

type Row = Record<string, unknown>;

/** Format one table cell for a print sheet (labels stay translated). */
export function printCell(
  row: Row,
  col: TableColumn,
  lang: string,
  defaultLang: string,
  t: (key: string) => string,
  fmtNum: (value: number) => string,
  fmtDate: (value: string) => string,
): string {
  const raw = row[col.key];
  if (raw === undefined || raw === null || raw === '') return '';
  if (col.type === 'number' || col.type === 'currency') {
    return typeof raw === 'number' ? fmtNum(raw) : String(raw);
  }
  if (col.type === 'date' || col.type === 'datetime') return fmtDate(String(raw));
  if (col.type === 'key') return t(String(raw)) || String(raw);
  if (col.type === 'badge') return t((col.keyPrefix ?? '') + String(raw)) || String(raw);
  if (!col.multilang) return String(raw);
  const key = multilangKey(col.key, lang, defaultLang);
  const localized = row[key];
  return localized === undefined || localized === null || localized === ''
    ? String(raw)
    : String(localized);
}

const TITLE_NAME_KEYS = ['name', 'customerName', 'supplierName', 'itemName', 'employeeName'];

/** Prefer a person/company name on the print title, never a bare code. */
export function printTitleName(row: Row, lang: string, defaultLang: string): string {
  for (const base of TITLE_NAME_KEYS) {
    const key = multilangKey(base, lang, defaultLang);
    const localized = row[key];
    if (localized) return String(localized);
    const raw = row[base];
    if (raw) return String(raw);
  }
  const fallback = row['number'] ?? row['code'] ?? '';
  return fallback ? String(fallback) : '';
}

export function printRef(row: Row, lang = 'ar', defaultLang = 'ar'): string {
  return printTitleName(row, lang, defaultLang);
}

/** AR: تقرير {name} • EN: {name} Report */
export function withReportWord(name: string, word: string, lang: string): string {
  if (!name || !word) return name;
  return lang === 'ar' ? `${word} ${name}` : `${name} ${word}`;
}
