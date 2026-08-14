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
import { ThemeConfig, ThemeMode } from '../../core/models/config.models';
import { NotificationService } from '../../core/services/notification.service';
import { UiPager } from '../../shared/components/ui-pager';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { Translated } from '../../shared/translated.base';
import { TokenColorEditor } from './token-color-editor';

const COLOR_VALUE = /^(#|rgb|hsl|linear-gradient|radial-gradient|transparent)/;
const PAGE_SIZE = 25;

/** Admin editor for every design token of the light and dark themes. */
@Component({
  selector: 'app-theme-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiTabs, UiPager, TokenColorEditor],
  template: `
    <ui-tabs [tabs]="modeTabs" [active]="mode()" (activeChange)="setMode($event)" />
    <section class="ui-card">
      <div class="row row--between token-toolbar">
        <p class="ui-field__hint token-toolbar__hint">
          {{ t('appearance.hints.theme') }}
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
            <span class="token-row__key token-row__key--compact mono">{{ entry[0] }}</span>
            @if (isColor(current(entry[0]))) {
              <app-token-color
                [value]="current(entry[0])"
                (valueChange)="edit(entry[0], $event)"
              />
            }
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
export class ThemeEditor extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly config = inject(AppConfigService);
  private readonly notifications = inject(NotificationService);

  protected readonly modeTabs: TabItem[] = [
    { id: 'light', labelKey: 'appearance.mode.light' },
    { id: 'dark', labelKey: 'appearance.mode.dark' },
  ];

  protected readonly mode = signal<ThemeMode>('light');
  protected readonly tokens = signal<Record<string, string>>({});
  protected readonly dirty = signal<Record<string, string>>({});
  protected readonly search = signal('');
  protected readonly busy = signal(false);

  protected readonly page = signal(1);

  private readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return Object.entries(this.tokens()).filter(
      ([key, value]) =>
        !term || key.includes(term) || value.toLowerCase().includes(term),
    );
  });

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

  protected setMode(id: string): void {
    this.mode.set(id as ThemeMode);
    this.dirty.set({});
    this.page.set(1);
    this.load();
  }

  protected current(key: string): string {
    return this.dirty()[key] ?? this.tokens()[key] ?? '';
  }

  protected edit(key: string, value: string): void {
    this.dirty.update((d) => {
      const next = { ...d };
      if (value === this.tokens()[key]) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  protected isColor(value: string): boolean {
    return COLOR_VALUE.test(value.trim());
  }

  protected save(): void {
    const entries = Object.entries(this.dirty());
    if (!entries.length) return;
    this.busy.set(true);
    forkJoin(
      entries.map(([key, value]) =>
        this.api.post<ThemeConfig>(API_ENDPOINTS.config.themeToken(this.mode()), {
          key,
          value,
        }),
      ),
    ).subscribe({
      next: () => {
        this.dirty.set({});
        this.load();
        // Re-apply live if the admin edited the mode currently on screen.
        if (this.mode() === this.store.themeMode()) {
          void this.config.switchTheme(this.mode());
        }
        this.notifications.success('appearance.messages.themeSaved');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  private load(): void {
    this.api
      .get<ThemeConfig>(API_ENDPOINTS.config.theme(this.mode()))
      .subscribe((theme) => this.tokens.set({ ...theme.tokens }));
  }
}
