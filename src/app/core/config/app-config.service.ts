import { Injectable, effect, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { API_ENDPOINTS } from '../api/api-endpoints';
import {
  AppConfigBundle,
  LanguageCode,
  ThemeConfig,
  ThemeMode,
  TranslationMap,
} from '../models/config.models';
import { I18nService } from './i18n.service';
import { RuntimeConfigStore } from './runtime-config.store';
import { ThemeService } from './theme.service';

const LANG_STORAGE_KEY = 'ah-erp.lang';
const THEME_STORAGE_KEY = 'ah-erp.theme-mode';

/**
 * Bootstrap orchestrator: fetches the config bundle (settings + theme +
 * menu) and the translation map for the active language, then keeps the
 * document theme, direction and title in sync with the store signals.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly theme = inject(ThemeService);
  private readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      const themeConfig = this.store.theme();
      if (themeConfig) this.theme.apply(themeConfig);
    });
    effect(() => {
      const settings = this.store.settings();
      if (!settings) return;
      this.theme.setDirection(this.store.direction(), this.store.language());
      const title = this.i18n.t(settings.appTitleKey);
      if (title) this.theme.setTitle(title);
    });
  }

  /** Called by the app initializer. Failure leaves the screen white. */
  async load(): Promise<void> {
    try {
      const bundle = await firstValueFrom(
        this.api.get<AppConfigBundle>(API_ENDPOINTS.config.bundle),
      );
      this.store.setBundle(bundle.settings, bundle.theme, bundle.menu);
      const lang = this.resolveInitialLanguage(bundle);
      await this.loadTranslations(lang);
      await this.restoreThemeMode();
    } catch {
      // Intentionally swallow: the ready() signal stays false and the
      // application renders a white screen, as required when the API
      // delivers no configuration.
    }
  }

  /** Fetches the requested palette from the theme API and applies it. */
  async switchTheme(mode: ThemeMode): Promise<void> {
    const theme = await firstValueFrom(
      this.api.get<ThemeConfig>(API_ENDPOINTS.config.theme(mode)),
    );
    this.store.setTheme(theme, mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }

  private async restoreThemeMode(): Promise<void> {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (stored === 'dark') await this.switchTheme('dark');
  }

  async switchLanguage(lang: LanguageCode): Promise<void> {
    await this.loadTranslations(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }

  private async loadTranslations(lang: LanguageCode): Promise<void> {
    const map = await firstValueFrom(
      this.api.get<TranslationMap>(API_ENDPOINTS.config.translations(lang)),
    );
    this.store.setTranslations(lang, map);
  }

  private resolveInitialLanguage(bundle: AppConfigBundle): LanguageCode {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    const supported = bundle.settings.languages.map((l) => l.code);
    if (stored && supported.includes(stored as LanguageCode)) {
      return stored as LanguageCode;
    }
    return bundle.settings.defaultLanguage;
  }
}
