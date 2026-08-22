import { FormField, TableColumn } from '../../core/models/common.models';
import { AccessService } from '../../core/security/access.service';

type Draft = Record<string, string | number | boolean>;
type Row = Record<string, unknown>;

export function emptyDraft(fields: FormField[]): Draft {
  const next: Draft = {};
  for (const field of fields) {
    next[field.key] =
      field.type === 'lines'
        ? '[]'
        : field.type === 'number'
          ? 0
          : field.type === 'date'
            ? new Date().toISOString().slice(0, 10)
            : field.options?.[0]?.value ?? '';
  }
  return next;
}

export function shownColumns(
  columns: TableColumn[],
  moduleId: string,
  tabId: string,
  access: AccessService,
): TableColumn[] {
  return columns.filter((col) => access.canColumn(moduleId, tabId, col.key));
}

export function shownFields(
  fields: FormField[],
  columns: TableColumn[],
  visible: TableColumn[],
  moduleId = '',
  tabId = '',
  access?: AccessService,
): FormField[] {
  const keep = new Set(visible.map((col) => col.key));
  const listed = new Set(columns.map((col) => col.key));
  return fields.filter((field) => {
    if (listed.has(field.key)) return keep.has(field.key);
    if (access && field.key.startsWith('label_')) {
      return access.canColumn(moduleId, tabId, field.key);
    }
    return true;
  });
}

export function rowMatches(
  row: Row,
  columns: TableColumn[],
  term: string,
  t: (key: string) => string,
): boolean {
  return columns.some((col) => {
    const raw = String(row[col.key] ?? '').toLowerCase();
    if (raw.includes(term)) return true;
    if (col.type !== 'key' && col.type !== 'badge') return false;
    return t((col.keyPrefix ?? '') + String(row[col.key] ?? '')).toLowerCase().includes(term);
  });
}
