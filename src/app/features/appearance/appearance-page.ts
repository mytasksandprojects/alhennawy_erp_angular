import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { routedTab, tabNavigator } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';
import { LanguageManager } from './language-manager';
import { ThemeEditor } from './theme-editor';
import { TranslationEditor } from './translation-editor';

/**
 * التخصيص — admin control center for the whole system's look & language:
 * every theme token (light + dark), every UI text value, and the language
 * list itself. All reads/writes go through the config API.
 */
@Component({
  selector: 'app-appearance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiTabs, ThemeEditor, TranslationEditor, LanguageManager],
  template: `
    <ui-page-header titleKey="appearance.title" subtitleKey="appearance.subtitle" />

    <ui-tabs [tabs]="tabs" [active]="active()" (activeChange)="activate($event)" />

    @switch (active()) {
      @case ('translations') {
        <app-translation-editor />
      }
      @case ('languages') {
        <app-language-manager />
      }
      @default {
        <app-theme-editor />
      }
    }
  `,
})
export class AppearancePage extends Translated {
  protected readonly tabs: TabItem[] = [
    { id: 'theme', labelKey: 'appearance.tabs.theme' },
    { id: 'translations', labelKey: 'appearance.tabs.translations' },
    { id: 'languages', labelKey: 'appearance.tabs.languages' },
  ];

  protected readonly active = routedTab('theme');
  private readonly navigateToTab = tabNavigator();

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }
}
