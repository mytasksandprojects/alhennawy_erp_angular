import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AppConfigService } from '../../core/config/app-config.service';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { LanguageOption } from '../../core/models/config.models';
import { NotificationService } from '../../core/services/notification.service';
import { UiBadge } from '../../shared/components/ui-badge';
import { Translated } from '../../shared/translated.base';

/** Admin list of system languages + form to register a new one. */
@Component({
  selector: 'app-language-manager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiBadge],
  template: `
    <section class="ui-card" style="margin-bottom: var(--space-lg)">
      <h2 class="ui-card__title">{{ t('appearance.tabs.languages') }}</h2>
      <div class="token-list">
        @for (lang of languages(); track lang.code) {
          <div class="token-row">
            <span class="token-row__key token-row__key--code mono">
              {{ lang.code }}
            </span>
            <span class="token-row__grow">{{ t(lang.labelKey) }}</span>
            <ui-badge
              [labelKey]="'appearance.dir.' + lang.dir"
              [tone]="lang.dir === 'rtl' ? 'info' : 'neutral'"
            />
          </div>
        }
      </div>
    </section>

    <section class="ui-card">
      <h2 class="ui-card__title">{{ t('appearance.actions.addLanguage') }}</h2>
      <p class="ui-field__hint">{{ t('appearance.hints.languages') }}</p>
      <div class="ui-form-grid">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('appearance.fields.code') }}</span>
          <input class="ui-control mono" [(ngModel)]="code" />
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('appearance.fields.name') }}</span>
          <input class="ui-control" [(ngModel)]="name" />
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('appearance.fields.direction') }}</span>
          <select class="ui-control" [(ngModel)]="dir">
            <option value="rtl">{{ t('appearance.dir.rtl') }}</option>
            <option value="ltr">{{ t('appearance.dir.ltr') }}</option>
          </select>
        </label>
      </div>
      <div class="row" style="margin-top: var(--space-md)">
        <button
          class="ui-btn ui-btn--primary"
          [disabled]="!code.trim() || !name.trim() || busy()"
          (click)="add()"
        >
          {{ t('appearance.actions.addLanguage') }}
        </button>
      </div>
    </section>
  `,
})
export class LanguageManager extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly config = inject(AppConfigService);
  private readonly notifications = inject(NotificationService);

  protected readonly languages = computed(
    () => this.store.settings()?.languages ?? [],
  );

  protected code = '';
  protected name = '';
  protected dir: 'rtl' | 'ltr' = 'ltr';
  protected readonly busy = signal(false);

  protected add(): void {
    this.busy.set(true);
    this.api
      .post<LanguageOption[]>(API_ENDPOINTS.config.languages, {
        code: this.code,
        name: this.name,
        dir: this.dir,
      })
      .subscribe({
        next: async () => {
          // Reload the bundle so the new language appears system-wide.
          await this.config.load();
          this.notifications.success('appearance.messages.languageAdded');
          this.code = '';
          this.name = '';
          this.busy.set(false);
        },
        error: () => this.busy.set(false),
      });
  }
}
