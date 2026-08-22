import { Injectable, computed, signal } from '@angular/core';
import {
  AppSettings,
  LanguageCode,
  MenuItem,
  ThemeConfig,
  ThemeMode,
  TranslationMap,
} from '../models/config.models';

/**
 * Signal store holding everything the API delivers at bootstrap.
 * The whole UI derives from these signals; while they are empty the
 * application intentionally renders nothing (white screen), because
 * no text, color, border or number exists outside the API payload.
 */
@Injectable({ providedIn: 'root' })
export class RuntimeConfigStore {
  private readonly settingsSignal = signal<AppSettings | null>(null);
  private readonly themeSignal = signal<ThemeConfig | null>(null);
  private readonly menuSignal = signal<MenuItem[]>([]);
  private readonly translationsSignal = signal<TranslationMap>({});
  private readonly languageSignal = signal<LanguageCode>('ar');
  private readonly themeModeSignal = signal<ThemeMode>('light');

  readonly settings = this.settingsSignal.asReadonly();
  readonly theme = this.themeSignal.asReadonly();
  readonly menu = this.menuSignal.asReadonly();
  readonly translations = this.translationsSignal.asReadonly();
  readonly language = this.languageSignal.asReadonly();
  readonly themeMode = this.themeModeSignal.asReadonly();

  readonly direction = computed<'rtl' | 'ltr'>(() => {
    const settings = this.settingsSignal();
    const lang = this.languageSignal();
    return settings?.languages.find((l) => l.code === lang)?.dir ?? 'rtl';
  });

  /** True only when every required payload arrived — gates the entire UI. */
  readonly ready = computed(
    () =>
      this.settingsSignal() !== null &&
      this.themeSignal() !== null &&
      this.menuSignal().length > 0 &&
      Object.keys(this.translationsSignal()).length > 0,
  );

  setBundle(settings: AppSettings, theme: ThemeConfig, menu: MenuItem[]): void {
    this.settingsSignal.set(settings);
    this.themeSignal.set(theme);
    this.menuSignal.set(menu);
  }

  setSettings(settings: AppSettings): void {
    this.settingsSignal.set(settings);
  }

  patchTranslations(partial: TranslationMap): void {
    this.translationsSignal.update((current) => ({ ...current, ...partial }));
  }

  setTranslations(lang: LanguageCode, map: TranslationMap): void {
    this.languageSignal.set(lang);
    this.translationsSignal.set(map);
  }

  /** Swaps the active theme (fetched from the theme API per mode). */
  setTheme(theme: ThemeConfig, mode: ThemeMode): void {
    this.themeSignal.set(theme);
    this.themeModeSignal.set(mode);
  }
}
