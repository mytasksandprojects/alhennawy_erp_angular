import { Injectable, inject, signal } from '@angular/core';
import { ApiClientService } from '../api/api-client.service';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { RuntimeConfigStore } from '../config/runtime-config.store';
import { SelectOption } from '../models/common.models';
import { LookupValue } from '../models/system.models';

/**
 * ar/en labels are first-class fields; labels for admin-added languages
 * are stored flat on the record as `label_<code>` (English fallback).
 */
function labelOf(row: LookupValue, lang: string): string {
  if (lang === 'ar') return row.labelAr;
  if (lang === 'en') return row.labelEn;
  const extra = (row as unknown as Record<string, unknown>)[`label_${lang}`];
  return typeof extra === 'string' && extra ? extra : row.labelEn;
}

/**
 * Admin-managed dropdown lists. Every select in the shared entity form
 * that declares `lookup: '<group>'` resolves its options here, so option
 * sets are controlled from System & Audit → Dropdown Lists, not in code.
 */
@Injectable({ providedIn: 'root' })
export class LookupService {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly values = signal<LookupValue[]>([]);

  /** Re-fetch so admin edits are reflected the next time a form opens. */
  refresh(): void {
    this.api
      .get<LookupValue[]>(API_ENDPOINTS.system.lookups)
      .subscribe((rows) => this.values.set(rows));
  }

  /** Default exchange rate stored on a lookup value (currencies group). */
  rateOf(group: string, value: string): number | null {
    const row = this.values().find(
      (item) => item.group === group && item.value === value,
    );
    return row?.rate ?? null;
  }

  /** Options of one group, labeled in the active language. */
  options(group: string): SelectOption[] {
    const lang = this.store.language();
    return this.values()
      .filter((row) => row.group === group)
      .map((row) => ({ value: row.value, label: labelOf(row, lang) }));
  }
}
