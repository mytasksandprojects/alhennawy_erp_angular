import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CrudPanel } from '../../shared/components/crud-panel';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { initialTab, tabNavigator } from '../../shared/tab-route';
import { REPORT_CATEGORIES, ReportDef } from './report-defs';
import { Translated } from '../../shared/translated.base';

/**
 * مركز التقارير — a report catalog (cards grouped by factory area),
 * not another tabbed module. Opening a card shows the read-only report
 * with search, from/to date filters, print, PDF and Excel export.
 */
@Component({
  selector: 'app-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiIcon, CrudPanel],
  template: `
    <ui-page-header titleKey="reports.title" subtitleKey="reports.subtitle" />

    @if (!selected()) {
      @for (category of categories; track category.id) {
        <section class="report-section">
          <h2 class="report-section__title">
            <span class="report-section__icon">
              <ui-icon [name]="category.icon" [size]="18" />
            </span>
            {{ t(category.labelKey) }}
          </h2>
          <div class="report-grid">
            @for (report of category.reports; track report.id) {
              <button type="button" class="report-card" (click)="open(report)">
                <span class="report-card__name">{{ t(report.labelKey) }}</span>
                <span class="report-card__meta">
                  <ui-icon name="document" [size]="13" />
                  {{ t(category.labelKey) }}
                </span>
              </button>
            }
          </div>
        </section>
      }
    } @else {
      <div class="report-view__bar">
        <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
          <ui-icon name="return" [size]="16" />
          {{ t('common.back') }}
        </button>
        <h2 class="report-view__title">{{ t(selected()!.labelKey) }}</h2>
        <span class="report-view__crumb">{{ t(categoryOf(selected()!.id).labelKey) }}</span>
      </div>
      <crud-panel
        [endpoint]="selected()!.endpoint"
        [columns]="selected()!.columns"
        [readOnly]="true"
      />
    }
  `,
})
export class ReportsPage extends Translated {
  protected readonly categories = REPORT_CATEGORIES;
  /** `?tab=` holds either a report id (open view) or a category (catalog). */
  protected readonly activeId = signal(initialTab(''));
  private readonly navigateToTab = tabNavigator();

  protected readonly selected = computed<ReportDef | null>(() => {
    const id = this.activeId();
    for (const category of REPORT_CATEGORIES) {
      const report = category.reports.find((item) => item.id === id);
      if (report) return report;
    }
    return null;
  });

  protected categoryOf(reportId: string) {
    return (
      REPORT_CATEGORIES.find((category) =>
        category.reports.some((report) => report.id === reportId),
      ) ?? REPORT_CATEGORIES[0]
    );
  }

  protected open(report: ReportDef): void {
    this.activeId.set(report.id);
    this.navigateToTab(report.id);
  }

  protected back(): void {
    const category = this.categoryOf(this.activeId());
    this.activeId.set(category.id);
    this.navigateToTab(category.id);
  }
}
