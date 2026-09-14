const DEFAULT_PAGE_SIZE = 20;

export interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
}

/** Filter then slice a mock list the same way the real list API will. */
export function pageEnvelope<T>(
  items: T[],
  query: URLSearchParams,
): { data: T[]; meta: PageMeta } {
  const filtered = items.filter((row) => matchesQuery(row as Record<string, unknown>, query));
  const total = filtered.length;
  const rawSize = Number(query.get('pageSize'));
  const pageSize = rawSize === 0 ? total || DEFAULT_PAGE_SIZE : rawSize > 0 ? rawSize : DEFAULT_PAGE_SIZE;
  const page = Math.min(
    Math.max(1, Number(query.get('page')) || 1),
    Math.max(1, Math.ceil(total / pageSize) || 1),
  );
  const start = (page - 1) * pageSize;
  return { data: filtered.slice(start, start + pageSize), meta: { total, page, pageSize } };
}

function matchesQuery(row: Record<string, unknown>, query: URLSearchParams): boolean {
  const status = query.get('status') ?? '';
  if (status) {
    const value = String(row['status'] ?? row['stage'] ?? row['result'] ?? row['accepted'] ?? '');
    if (!status.split(',').includes(value)) return false;
  }
  const stock = query.get('stock') ?? '';
  if (stock && stockFlag(row) !== stock) return false;
  const from = query.get('from') ?? '';
  const to = query.get('to') ?? '';
  if (from || to) {
    const value = dateOf(row);
    if (value && ((from && value < from) || (to && value > to))) return false;
  }
  const q = (query.get('q') ?? query.get('search') ?? '').trim().toLowerCase();
  if (q && !Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(q))) {
    return false;
  }
  for (const [key, value] of query.entries()) {
    if (!value || RESERVED.has(key)) continue;
    if (String(row[key] ?? '') !== value) return false;
  }
  return true;
}

const RESERVED = new Set(['page', 'pageSize', 'q', 'search', 'from', 'to', 'status', 'stock']);

function dateOf(row: Record<string, unknown>): string {
  for (const key of ['date', 'hireDate', 'at', 'syncedAt', 'createdAt']) {
    const value = String(row[key] ?? '').slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  }
  return '';
}

function stockFlag(row: Record<string, unknown>): string {
  const qty = Number(row['quantity']);
  const min = Number(row['minimumStock']);
  if (qty === 0) return 'out';
  if (row['isBelowMinimum'] === true || (min > 0 && qty <= min)) return 'below';
  if (min > 0 && qty <= Math.max(min * 1.25, min + 2)) return 'low';
  return 'available';
}
