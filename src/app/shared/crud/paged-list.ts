import { ParamMap } from '@angular/router';
import { ListQuery } from '../../core/models/common.models';
import { stockStatusOf } from './stock-filter';

export const PAGE_SIZES = [10, 20, 50, 100, 500, 1000] as const;
export const DEFAULT_PAGE_SIZE = 20;

type Row = Record<string, unknown>;

export function parsePage(raw: string | null | undefined): number {
  return Math.max(1, Number(raw) || 1);
}

export function parsePageSize(raw: string | null | undefined): number {
  const size = Number(raw);
  return (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_PAGE_SIZE;
}

export function listQuery(
  page: number,
  pageSize: number,
  extra: Omit<ListQuery, 'page' | 'pageSize'> = {},
): ListQuery {
  return { page, pageSize, ...extra };
}

export function crudListQuery(
  page: number,
  pageSize: number,
  search: string,
  from: string,
  to: string,
  status: string,
  stock: string,
  extras: Record<string, string> = {},
  all = false,
): ListQuery {
  const extra: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(extras)) {
    extra[key] = value || undefined;
  }
  return listQuery(all ? 1 : page, all ? 0 : pageSize, {
    q: search || undefined,
    from: from || undefined,
    to: to || undefined,
    status: status || undefined,
    stock: stock || undefined,
    ...extra,
  });
}

export function decorateRows(rows: Row[], withStock: boolean): Row[] {
  return rows.map((row) => (withStock ? { ...row, stockStatus: stockStatusOf(row) } : { ...row }));
}

export function readListParams(params: ParamMap): {
  stock: string;
  status: string;
  q: string;
  page: number;
  pageSize: number;
} {
  return {
    stock: params.get('stock') ?? '',
    status: params.get('status') ?? '',
    q: params.get('q') ?? '',
    page: parsePage(params.get('page')),
    pageSize: parsePageSize(params.get('pageSize')),
  };
}
