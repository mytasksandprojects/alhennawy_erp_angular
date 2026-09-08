import { ParamMap } from '@angular/router';
import { SelectOption } from '../../core/models/common.models';

/** Toolbar dropdown bound to a list query param. */
export interface ListFilter {
  key: string;
  labelKey: string;
  lookup?: string;
  filterBy?: string;
  options?: SelectOption[];
}

export const STOCK_LIST_FILTER: ListFilter = {
  key: 'stock',
  labelKey: 'common.status',
  options: [
    { value: 'below', labelKey: 'warehouse.stock.below' },
    { value: 'out', labelKey: 'warehouse.stock.out' },
  ],
};

export function withStockFilter(filters: ListFilter[], hasStock: boolean): ListFilter[] {
  if (!hasStock || filters.some((row) => row.key === 'stock')) return filters;
  return [...filters, STOCK_LIST_FILTER];
}

export function extrasFromParams(params: ParamMap, filters: ListFilter[]): Record<string, string> {
  const extras: Record<string, string> = { stock: params.get('stock') ?? '' };
  for (const filter of filters) extras[filter.key] = params.get(filter.key) ?? '';
  return extras;
}

export function childFilterPatch(
  filters: ListFilter[],
  key: string,
  value: string,
): Record<string, string | null> {
  const patch: Record<string, string | null> = { [key]: value || null };
  for (const filter of filters) {
    if (filter.filterBy === key) patch[filter.key] = null;
  }
  return patch;
}
