import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AppConfigService } from '../../core/config/app-config.service';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { TranslationMap } from '../../core/models/config.models';
import { AccessService } from '../../core/security/access.service';
import { NotificationService } from '../../core/services/notification.service';
import { UiPager } from '../../shared/components/ui-pager';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { Translated } from '../../shared/translated.base';

const PAGE_SIZE = 25;

/**
 * Admin editor for every UI text. Keys are the frontend contract and are
 * read-only; only the values are editable, per language.
 */
@Component({
  selector: 'app-translation-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiTabs, UiPager],
  template: `
    <ui-tabs [tabs]="langTabs()" [active]="lang()" (activeChange)="setLang($event)" />
    <section class="ui-card">
      <div class="row row--between token-toolbar">
        <p class="ui-field__hint token-toolbar__hint">
          {{ t('appearance.hints.translations') }}
        </p>
        <div class="row token-toolbar__actions">
          <input
            class="ui-control token-search"
            [placeholder]="t('appearance.search')"
            [ngModel]="search()"
            (ngModelChange)="setSearch($event)"
          />
          <button
            class="ui-btn ui-btn--primary"
            [disabled]="!dirtyCount() || busy()"
            (click)="save()"
          >
            {{ t('common.save') }}
            @if (dirtyCount()) {
              <span class="ui-badge ui-badge--info">{{ fmtNum(dirtyCount()) }}</span>
            }
          </button>
        </div>
      </div>
      <div class="token-list">
        @for (entry of visible(); track entry[0]) {
          <div class="token-row">
            <span class="token-row__key mono">{{ entry[0] }}</span>
            <input
              class="ui-control"
              [ngModel]="current(entry[0])"
              (ngModelChange)="edit(entry[0], $event)"
            />
          </div>
        }
      </div>
      <ui-pager
        [page]="page()"
        [pageCount]="pageCount()"
        (pageChange)="page.set($event)"
      />
    </section>
  `,
})
export class TranslationEditor extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly config = inject(AppConfigService);
  private readonly notifications = inject(NotificationService);
  private readonly access = inject(AccessService);

  protected readonly lang = signal(this.store.language());
  protected readonly entries = signal<TranslationMap>({});
  protected readonly dirty = signal<Record<string, string>>({});
  protected readonly search = signal('');
  protected readonly busy = signal(false);

  protected readonly langTabs = computed<TabItem[]>(() =>
    (this.store.settings()?.languages ?? [])
      .filter((lang) => this.access.canColumn('appearance', 'translations', lang.code))
      .map((lang) => ({ id: lang.code, labelKey: lang.labelKey })),
  );

  private readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return Object.entries(this.entries()).filter(
      ([key, value]) =>
        !term || key.toLowerCase().includes(term) || value.toLowerCase().includes(term),
    );
  });

  protected readonly page = signal(1);

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );

  protected readonly visible = computed(() => {
    const current = Math.min(this.page(), this.pageCount());
    return this.filtered().slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  });

  protected readonly dirtyCount = computed(
    () => Object.keys(this.dirty()).length,
  );

  protected setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  constructor() {
    super();
    this.load();
  }

  protected setLang(code: string): void {
    this.lang.set(code);
    this.dirty.set({});
    this.page.set(1);
    this.load();
  }

  protected current(key: string): string {
    return this.dirty()[key] ?? this.entries()[key] ?? '';
  }

  protected edit(key: string, value: string): void {
    this.dirty.update((d) => {
      const next = { ...d };
      if (value === this.entries()[key]) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  protected save(): void {
    const changed = Object.entries(this.dirty());
    if (!changed.length) return;
    this.busy.set(true);
    forkJoin(
      changed.map(([key, value]) =>
        this.api.post(API_ENDPOINTS.config.translationValue(this.lang()), {
          key,
          value,
        }),
      ),
    ).subscribe({
      next: () => {
        this.dirty.set({});
        this.load();
        // Refresh live texts if the admin edited the active language.
        if (this.lang() === this.store.language()) {
          void this.config.switchLanguage(this.lang());
        }
        this.notifications.success('appearance.messages.translationsSaved');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  private load(): void {
    this.api
      .get<TranslationMap>(API_ENDPOINTS.config.translations(this.lang()))
      .subscribe((map) => this.entries.set(map));
  }
}
