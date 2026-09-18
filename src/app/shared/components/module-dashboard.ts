import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AlertItem, DashboardData } from '../../core/models/common.models';
import { ListFilter } from '../crud/list-filter';
import { navigateToTarget } from '../tab-route';
import { Translated } from '../translated.base';
import { UiBarChart } from './ui-bar-chart';
import { UiColumnChart } from './ui-column-chart';
import { UiDonutChart } from './ui-donut-chart';
import { UiIcon } from './ui-icon';
import { UiListFilters } from './ui-list-filters';
import { UiSpinner } from './ui-spinner';
import { UiStatCard } from './ui-stat-card';

/**
 * Reusable dashboard: KPI grid + charts + alert feed for any module.
 * Every module dashboard in the BRD is this one component fed by
 * `/dashboards/{moduleId}` — zero duplicated dashboard code.
 */
@Component({
  selector: 'module-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiStatCard, UiBarChart, UiColumnChart, UiDonutChart, UiIcon, UiListFilters, UiSpinner],
  template: `
    @if (withDates() || filters().length) {
      <ui-list-filters
        [showSearch]="false"
        [filters]="filters()"
        [values]="filterValues()"
        [showDates]="withDates()"
        [fromDate]="fromDate()"
        [toDate]="toDate()"
        (changed)="onFilter($event)"
        (fromChange)="fromDate.set($event); reload()"
        (toChange)="toDate.set($event); reload()"
      />
    }
    @if (data(); as d) {
      <div class="stat-grid">
        @for (stat of d.stats; track stat.id) {
          <ui-stat-card [stat]="stat" />
        }
      </div>
      <div class="content-grid">
        <section class="ui-card" id="alerts">
          <h2 class="ui-card__title">{{ t('dashboard.alerts') }}</h2>
          <div class="alert-list">
            @for (alert of d.alerts; track alert.id) {
              <div
                class="alert-item"
                [class]="'alert-item--' + alert.severity"
                [class.alert-item--link]="!!alert.route"
                [attr.role]="alert.route ? 'link' : null"
                [attr.tabindex]="alert.route ? 0 : null"
                (click)="openAlert(alert)"
                (keydown.enter)="openAlert(alert)"
              >
                <ui-icon name="alert" [size]="16" />
                <span>{{ t(alert.messageKey, alert.params) }}</span>
              </div>
            } @empty {
              <span class="text-faint">{{ t('common.empty') }}</span>
            }
          </div>
        </section>
        @for (chart of d.charts; track chart.id) {
          <section class="ui-card">
            <h2 class="ui-card__title">{{ t(chart.titleKey) }}</h2>
            @switch (chart.kind) {
              @case ('columns') {
                <ui-column-chart [points]="chart.points" />
              }
              @case ('donut') {
                <ui-donut-chart [points]="chart.points" />
              }
              @default {
                <ui-bar-chart [points]="chart.points" />
              }
            }
          </section>
        }
        <!-- Extra cards (e.g. home audit/switches) join the same masonry flow. -->
        <ng-content />
      </div>
    } @else {
      <ui-spinner />
    }
  `,
})
export class ModuleDashboard extends Translated implements OnInit {
  readonly moduleId = input.required<string>();
  /** Show from/to date pickers — values go to the dashboard API as from/to. */
  readonly withDates = input(false);
  /** Extra dropdown filters (e.g. currency) sent as query params. */
  readonly filters = input<ListFilter[]>([]);

  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  protected readonly data = signal<DashboardData | null>(null);
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly filterValues = signal<Record<string, string>>({});

  protected openAlert(alert: AlertItem): void {
    navigateToTarget(this.router, alert);
  }

  protected onFilter(event: { key: string; value: string }): void {
    this.filterValues.update((values) => ({ ...values, [event.key]: event.value }));
    this.reload();
  }

  protected reload(): void {
    this.api
      .get<DashboardData>(API_ENDPOINTS.dashboards(this.moduleId()), {
        from: this.fromDate(),
        to: this.toDate(),
        ...this.filterValues(),
      })
      .subscribe((dashboard) => this.data.set(dashboard));
  }

  ngOnInit(): void {
    this.reload();
  }
}
