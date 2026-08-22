import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AlertItem, StatCardData } from '../../core/models/common.models';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiSpinner } from '../../shared/components/ui-spinner';
import { UiStatCard } from '../../shared/components/ui-stat-card';
import { navigateToTarget } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';

/**
 * Factory-wide alert inbox. Rows come from every module and open the
 * matching ticket, item, vehicle or document when clicked.
 */
@Component({
  selector: 'app-alerts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiStatCard, UiIcon, UiSpinner],
  template: `
    <ui-page-header titleKey="alerts.title" subtitleKey="alerts.subtitle" />

    @if (loaded()) {
      <div class="stat-grid">
        @for (stat of stats(); track stat.id) {
          <ui-stat-card [stat]="stat" />
        }
      </div>
      <section class="ui-card">
        <div class="row token-toolbar">
          <input
            class="ui-control crud-search"
            type="search"
            [placeholder]="t('common.search')"
            [value]="search()"
            (input)="setSearch($any($event.target).value)"
          />
          <select
            class="ui-control"
            [value]="module()"
            (change)="setModule($any($event.target).value)"
          >
            <option value="">{{ t('alerts.fields.module') }} — {{ t('common.all') }}</option>
            @for (key of modules(); track key) {
              <option [value]="key">{{ t(key) }}</option>
            }
          </select>
        </div>
        <div class="alert-list">
          @for (alert of filtered(); track alert.id) {
            <div
              class="alert-item"
              [class]="'alert-item--' + alert.severity"
              [class.alert-item--link]="!!alert.route"
              [attr.role]="alert.route ? 'link' : null"
              [attr.tabindex]="alert.route ? 0 : null"
              (click)="open(alert)"
              (keydown.enter)="open(alert)"
            >
              <ui-icon name="alert" [size]="16" />
              <div class="stack">
                <span>{{ t(alert.messageKey, alert.params) }}</span>
                <span class="text-faint">
                  @if (alert.moduleKey) {
                    {{ t(alert.moduleKey) }} ·
                  }
                  {{ fmtDate(alert.date) }}
                </span>
              </div>
            </div>
          } @empty {
            <span class="text-faint">{{ t('common.empty') }}</span>
          }
        </div>
      </section>
    } @else {
      <ui-spinner />
    }
  `,
})
export class AlertsPage extends Translated implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly items = signal<AlertItem[]>([]);
  protected readonly loaded = signal(false);
  protected readonly search = signal('');
  protected readonly module = signal('');
  protected readonly severity = signal('');

  protected readonly modules = computed(() =>
    [...new Set(this.items().map((item) => item.moduleKey).filter(Boolean))] as string[],
  );

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const module = this.module();
    const severity = this.severity();
    return this.items().filter((item) => {
      if (severity && item.severity !== severity) return false;
      if (module && item.moduleKey !== module) return false;
      if (!term) return true;
      const text = this.t(item.messageKey, item.params).toLowerCase();
      const owner = item.moduleKey ? this.t(item.moduleKey).toLowerCase() : '';
      return text.includes(term) || owner.includes(term);
    });
  });

  protected readonly stats = computed<StatCardData[]>(() => {
    const all = this.items();
    const count = (tone: AlertItem['severity']) =>
      all.filter((item) => item.severity === tone).length;
    return [
      { id: 'all', labelKey: 'alerts.stats.total', value: all.length, icon: 'alert', route: '/alerts' },
      { id: 'danger', labelKey: 'alerts.stats.danger', value: count('danger'), icon: 'close', toneToken: 'danger', route: '/alerts', query: { severity: 'danger' } },
      { id: 'warning', labelKey: 'alerts.stats.warning', value: count('warning'), icon: 'alert', toneToken: 'warning', route: '/alerts', query: { severity: 'warning' } },
      { id: 'info', labelKey: 'alerts.stats.info', value: count('info'), icon: 'document', toneToken: 'info', route: '/alerts', query: { severity: 'info' } },
    ];
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.severity.set(params.get('severity') ?? '');
      this.module.set(params.get('module') ?? '');
      this.search.set(params.get('q') ?? '');
    });
    this.api.get<AlertItem[]>(API_ENDPOINTS.alerts).subscribe((rows) => {
      this.items.set(rows);
      this.loaded.set(true);
    });
  }

  protected setSearch(value: string): void {
    this.patch({ q: value || null });
  }

  protected setModule(value: string): void {
    this.patch({ module: value || null });
  }

  protected open(alert: AlertItem): void {
    navigateToTarget(this.router, alert);
  }

  private patch(query: Record<string, string | null>): void {
    void this.router.navigate(['/alerts'], {
      queryParams: query,
      queryParamsHandling: 'merge',
    });
  }
}
