import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { ChartData, DashboardData, StatCardData } from '../../core/models/common.models';
import { navigateToTarget } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';
import { UiAreaChart } from '../../shared/components/ui-area-chart';
import { UiBarChart } from '../../shared/components/ui-bar-chart';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiSpinner } from '../../shared/components/ui-spinner';
import { UiWaffleChart } from '../../shared/components/ui-waffle-chart';

/** Reports studio — wave, waffle and pills; not the module dashboard grid. */
@Component({
  selector: 'app-reports-hub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiAreaChart, UiBarChart, UiWaffleChart, UiIcon, UiSpinner],
  template: `
    @if (data(); as d) {
      <div class="report-studio">
        <section class="ui-card report-hero">
          <div class="report-hero__kpis">
            @for (stat of featured(); track stat.id) {
              <button type="button" class="report-hero__stat" (click)="open(stat)">
                <span class="report-hero__label">{{ t(stat.labelKey) }}</span>
                <span class="report-hero__value mono">
                  {{ fmtNum(stat.value) }}
                  @if (stat.unitKey) {
                    <span class="text-faint">{{ t(stat.unitKey) }}</span>
                  }
                </span>
                @if (stat.trendPercent !== undefined) {
                  <span
                    class="report-hero__trend"
                    [class.stat-card__trend--up]="stat.trendPercent >= 0"
                    [class.stat-card__trend--down]="stat.trendPercent < 0"
                  >
                    {{ fmtNum(stat.trendPercent) }}%
                  </span>
                }
              </button>
            }
          </div>
          @if (chart('monthly-sales'); as sales) {
            <h3 class="report-studio__caption">{{ t(sales.titleKey) }}</h3>
            <ui-area-chart [points]="sales.points" />
          }
        </section>

        <aside class="report-side">
          @if (chart('by-area'); as area) {
            <section class="ui-card">
              <h2 class="ui-card__title">{{ t(area.titleKey) }}</h2>
              <ui-waffle-chart [points]="area.points" />
            </section>
          }
          <section class="ui-card">
            <div class="report-pills">
              @for (stat of chips(); track stat.id) {
                <button type="button" class="report-pill" (click)="open(stat)">
                  <ui-icon [name]="stat.icon" [size]="16" />
                  <span class="report-pill__value mono">{{ fmtNum(stat.value) }}</span>
                  <span class="report-pill__label">{{ t(stat.labelKey) }}</span>
                </button>
              }
            </div>
          </section>
        </aside>

        @if (chart('monthly-production'); as output) {
          <section class="ui-card report-band">
            <h2 class="ui-card__title">{{ t(output.titleKey) }}</h2>
            <ui-area-chart [points]="output.points" />
          </section>
        }
        @if (chart('top-customers'); as top) {
          <section class="ui-card report-band">
            <h2 class="ui-card__title">{{ t(top.titleKey) }}</h2>
            <ui-bar-chart [points]="top.points" />
          </section>
        }
      </div>
    } @else {
      <ui-spinner />
    }
  `,
})
export class ReportsHub extends Translated implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  protected readonly data = signal<DashboardData | null>(null);

  protected featured(): StatCardData[] {
    return this.data()?.stats.slice(0, 2) ?? [];
  }

  protected chips(): StatCardData[] {
    return this.data()?.stats.slice(2) ?? [];
  }

  protected chart(id: string): ChartData | undefined {
    return this.data()?.charts.find((item) => item.id === id);
  }

  protected open(stat: StatCardData): void {
    navigateToTarget(this.router, stat);
  }

  ngOnInit(): void {
    this.api
      .get<DashboardData>(API_ENDPOINTS.dashboards('reports'))
      .subscribe((dashboard) => this.data.set(dashboard));
  }
}
