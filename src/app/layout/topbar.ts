import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '../core/config/app-config.service';
import { RuntimeConfigStore } from '../core/config/runtime-config.store';
import { LanguageCode } from '../core/models/config.models';
import { AccessService } from '../core/security/access.service';
import { AuthService } from '../core/security/auth.service';
import { LayoutService } from './layout.service';
import { SUB_MODULES } from './search-targets';
import { Translated } from '../shared/translated.base';
import { UiIcon } from '../shared/components/ui-icon';

interface SearchResult {
  id: string;
  icon: string;
  /** Module name (translated). */
  label: string;
  /** Sub-module name (translated) when the hit is a tab. */
  subLabel?: string;
  route: string;
  tab?: string;
}

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <header class="topbar">
      <div class="topbar__start">
        <button
          type="button"
          class="ui-btn ui-btn--icon"
          [class.ui-btn--primary]="!layout.sidebarOpen()"
          [class.ui-btn--ghost]="layout.sidebarOpen()"
          [attr.aria-label]="t('layout.toggleNav')"
          (click)="layout.toggleSidebar()"
        >
          <ui-icon [name]="layout.sidebarOpen() ? 'close' : 'menu'" [size]="18" />
        </button>
        @if (!layout.sidebarOpen()) {
          <img class="topbar__logo" [src]="logoUrl()" [alt]="t('company.name')" />
        }
        <span class="topbar__title">{{ t('app.title') }}</span>
      </div>
      <div class="topbar__search">
        <ui-icon name="search" [size]="16" />
        <input
          class="topbar__search-input"
          type="search"
          [placeholder]="t('layout.searchModules')"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          (keydown.enter)="goFirst()"
        />
        @if (query().trim() && matches().length) {
          <div class="topbar__search-results">
            @for (item of matches(); track item.id) {
              <button
                type="button"
                class="topbar__search-result"
                (mousedown)="go(item)"
              >
                <span class="topbar__search-icon">
                  <ui-icon [name]="item.icon" [size]="16" />
                </span>
                @if (item.subLabel) {
                  <span class="topbar__search-name">{{ item.subLabel }}</span>
                  <span class="topbar__search-module">{{ item.label }}</span>
                } @else {
                  <span class="topbar__search-name">{{ item.label }}</span>
                }
              </button>
            }
          </div>
        }
      </div>
      <div class="topbar__actions">
        <button
          type="button"
          class="ui-btn ui-btn--icon ui-btn--ghost"
          [attr.aria-label]="t(isDark() ? 'layout.lightMode' : 'layout.darkMode')"
          [attr.title]="t(isDark() ? 'layout.lightMode' : 'layout.darkMode')"
          (click)="toggleTheme()"
        >
          <ui-icon [name]="isDark() ? 'sun' : 'moon'" [size]="18" />
        </button>
        @for (lang of otherLanguages(); track lang.code) {
          <button
            type="button"
            class="ui-btn ui-btn--ghost"
            (click)="switchLanguage(lang.code)"
          >
            <ui-icon name="lang" [size]="16" />
            {{ t(lang.labelKey) }}
          </button>
        }
        @if (auth.user(); as user) {
          <div class="topbar__user">
            <span class="topbar__user-name">{{ user.displayName }}</span>
            <span class="topbar__user-role">{{ t(user.roleKey) }}</span>
          </div>
          <button
            type="button"
            class="ui-btn ui-btn--ghost"
            (click)="auth.logout()"
          >
            <ui-icon name="logout" [size]="16" />
            {{ t('auth.logout') }}
          </button>
        }
      </div>
    </header>
  `,
})
export class Topbar extends Translated {
  protected readonly auth = inject(AuthService);
  private readonly access = inject(AccessService);
  protected readonly layout = inject(LayoutService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly config = inject(AppConfigService);
  private readonly router = inject(Router);

  protected readonly query = signal('');

  /** Modules and sub-modules the user can open, matched by translated name. */
  protected readonly matches = computed<SearchResult[]>(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return [];
    const results: SearchResult[] = [];
    const allowed = this.store
      .menu()
      .filter((item) => this.auth.hasPermission(item.permission) && item.route);
    for (const item of allowed) {
      const label = this.t(item.labelKey);
      if (label.toLowerCase().includes(term)) {
        results.push({ id: item.id, icon: item.icon, label, route: item.route! });
      }
      for (const sub of SUB_MODULES) {
        if (sub.route !== item.route) continue;
        if (!this.access.canTab(item.id, sub.tab)) continue;
        const subLabel = this.t(sub.labelKey);
        if (!subLabel.toLowerCase().includes(term)) continue;
        results.push({
          id: `${item.id}:${sub.tab}`,
          icon: item.icon,
          label,
          subLabel,
          route: sub.route,
          tab: sub.tab,
        });
      }
    }
    return results.slice(0, 8);
  });

  protected go(item: SearchResult): void {
    this.query.set('');
    void this.router.navigate([item.route], {
      queryParams: item.tab ? { tab: item.tab } : {},
    });
  }

  protected goFirst(): void {
    const first = this.matches()[0];
    if (first) this.go(first);
  }

  protected readonly logoUrl = computed(
    () => this.store.settings()?.company.logoUrl ?? '',
  );

  protected readonly otherLanguages = computed(() =>
    (this.store.settings()?.languages ?? []).filter(
      (lang) => lang.code !== this.store.language(),
    ),
  );

  protected readonly isDark = computed(() => this.store.themeMode() === 'dark');

  protected toggleTheme(): void {
    void this.config.switchTheme(this.isDark() ? 'light' : 'dark');
  }

  protected switchLanguage(code: LanguageCode): void {
    void this.config.switchLanguage(code);
  }
}
