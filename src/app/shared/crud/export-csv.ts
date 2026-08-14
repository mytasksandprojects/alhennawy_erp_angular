import { TableColumn } from '../../core/models/common.models';

type Row = Record<string, unknown>;
type Translate = (key: string, params?: (string | number)[]) => string;
type FormatNumber = (value: number | null | undefined) => string;

function cellValue(
  col: TableColumn,
  row: Row,
  t: Translate,
  fmtNum: FormatNumber,
): string {
  const raw = row[col.key];
  if (raw === undefined || raw === null) return '';
  switch (col.type) {
    case 'key':
      return t(String(raw)) || String(raw);
    case 'badge':
      return t((col.keyPrefix ?? '') + String(raw)) || String(raw);
    case 'date':
    case 'datetime':
      return String(raw).slice(0, 10);
    case 'number':
    case 'currency':
      return typeof raw === 'number' ? fmtNum(raw) : String(raw);
    default:
      return String(raw);
  }
}

function escapeCsv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Excel-friendly CSV download: translated headers, formatted cells and a
 * UTF-8 BOM so Arabic text opens correctly in Excel.
 */
export function exportRowsToCsv(
  columns: TableColumn[],
  rows: Row[],
  endpoint: string,
  t: Translate,
  fmtNum: FormatNumber,
): void {
  const header = columns.map((col) => escapeCsv(t(col.labelKey))).join(',');
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsv(cellValue(col, row, t, fmtNum))).join(','),
  );
  const csv = '\uFEFF' + [header, ...lines].join('\n');
  const name = endpoint.split('/').filter(Boolean).join('-') || 'export';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
