import { TableColumn } from '../../core/models/common.models';
import { rowMatches } from './form-draft';

type Row = Record<string, unknown>;

/** Apply search, dates, stock preset and KPI `?status=` in one place. */
export function filterCrudRows(
  rows: Row[],
  dateKey: string,
  from: string,
  to: string,
  stock: string,
  status: string,
  term: string,
  columns: TableColumn[],
  t: (key: string) => string,
  withStock: boolean,
): Row[] {
  const q = term.trim().toLowerCase();
  return rows
    .filter((row) => {
      if (dateKey && (from || to)) {
        const value = String(row[dateKey] ?? '').slice(0, 10);
        if (!value || (from && value < from) || (to && value > to)) return false;
      }
      return matchesStock(row, stock) && matchesStatus(row, status) && (!q || rowMatches(row, columns, q, t));
    })
    .map((row) => (withStock ? { ...row, stockStatus: stockStatusOf(row) } : row));
}

/** Derived badge: empty bin vs still-on-shelf but under the minimum. */
export function stockStatusOf(
  row: Record<string, unknown>,
): 'out' | 'below' | 'available' {
  const qty = Number(row['quantity']);
  if (qty === 0) return 'out';
  if (row['isBelowMinimum'] === true || qty < Number(row['minimumStock'])) {
    return 'below';
  }
  return 'available';
}

/** Warehouse stock presets from `?stock=` — below-min and out-of-stock are distinct. */
export function matchesStock(
  row: Record<string, unknown>,
  stock: string,
): boolean {
  if (!stock) return true;
  return stockStatusOf(row) === stock;
}

/** KPI cards pass `?status=` — matches `status` or export `stage`. */
export function matchesStatus(row: Record<string, unknown>, status: string): boolean {
  if (!status) return true;
  const value = String(row['status'] ?? row['stage'] ?? '');
  return status.split(',').includes(value);
}
