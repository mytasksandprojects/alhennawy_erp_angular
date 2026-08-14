import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ThemeConfig } from '../models/config.models';

/**
 * Applies API-delivered design tokens as CSS custom properties on `:root`.
 * Stylesheets reference tokens exclusively via `var(--token-name)` with no
 * fallback values, so an empty theme payload produces an unstyled white
 * screen by design — hardcoding colors/sizes in CSS is forbidden.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private appliedKeys: string[] = [];

  apply(theme: ThemeConfig): void {
    const root = this.document.documentElement;
    for (const key of this.appliedKeys) {
      root.style.removeProperty(`--${key}`);
    }
    this.appliedKeys = Object.keys(theme.tokens);
    for (const [key, value] of Object.entries(theme.tokens)) {
      root.style.setProperty(`--${key}`, value);
    }
  }

  setDirection(dir: 'rtl' | 'ltr', lang: string): void {
    const html = this.document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', lang);
  }

  setTitle(title: string): void {
    this.document.title = title;
  }
}
