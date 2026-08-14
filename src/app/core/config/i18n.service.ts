import { Injectable, inject } from '@angular/core';
import { RuntimeConfigStore } from './runtime-config.store';

/**
 * Translation lookup. Every visible string in the app flows through `t()`.
 * A missing key returns an empty string — never a hardcoded fallback —
 * so an incomplete API payload surfaces immediately as blank UI.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly store = inject(RuntimeConfigStore);

  /** Translate a key. Reads the translations signal → reactive in templates. */
  t = (key: string, params?: (string | number)[]): string => {
    const value = this.store.translations()[key];
    if (value === undefined) return '';
    if (!params?.length) return value;
    return params.reduce<string>(
      (acc, param, i) => acc.replaceAll(`{${i}}`, this.formatParam(param)),
      value,
    );
  };

  /** Format a number using the locale delivered by the API settings. */
  formatNumber = (value: number | undefined | null, digits?: number): string => {
    if (value === undefined || value === null) return '';
    const settings = this.store.settings();
    if (!settings) return '';
    return new Intl.NumberFormat(settings.currencyDisplay.localeCode, {
      maximumFractionDigits: digits ?? settings.currencyDisplay.maxFractionDigits,
    }).format(value);
  };

  formatDate = (iso: string | undefined | null): string => {
    if (!iso) return '';
    const settings = this.store.settings();
    if (!settings) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(settings.currencyDisplay.localeCode, {
      dateStyle: 'medium',
    }).format(date);
  };

  formatTime = (iso: string | undefined | null): string => {
    if (!iso) return '';
    const settings = this.store.settings();
    if (!settings) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(settings.currencyDisplay.localeCode, {
      timeStyle: 'short',
    }).format(date);
  };

  private formatParam(param: string | number): string {
    return typeof param === 'number' ? this.formatNumber(param) : param;
  }
}
