import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { CrudPanel } from '../../shared/components/crud-panel';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { withReportWord } from '../../shared/crud/print-cell';
import { routedTab, tabNavigator } from '../../shared/tab-route';
import { REPORT_CATEGORIES, REPORT_ICONS, ReportDef } from './report-defs';
import { ReportsHub } from './reports-hub';
import { Translated } from '../../shared/translated.base';

/**
 * مركز التقارير — studio charts (wave + waffle) then module launchpads.
 */
@Component({
  selector: 'app-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReportsHub, UiPageHeader, UiIcon, CrudPanel],
  template: `
    <ui-page-header titleKey="reports.title" subtitleKey="reports.subtitle" />

    @if (!selected()) {
      <app-reports-hub />
      <div class="report-mods">
        @for (category of categories; track category.id) {
          <section class="ui-card report-mod" [id]="'report-' + category.id">
            <header class="report-mod__head">
              <span class="stat-card__icon">
                <ui-icon [name]="category.icon" [size]="22" />
              </span>
              <div>
                <h2 class="ui-card__title">{{ t(category.labelKey) }}</h2>
                <p class="stat-card__label mono">{{ fmtNum(category.reports.length) }}</p>
              </div>
            </header>
            <div class="report-mod__grid">
              @for (report of category.reports; track report.id) {
                <button type="button" class="report-tile" (click)="open(report)">
                  <span class="report-tile__mark">
                    <ui-icon [name]="iconOf(report.id)" [size]="20" />
                  </span>
                  <span class="report-tile__name">{{ t(report.labelKey) }}</span>
                </button>
              }
            </div>
          </section>
        }
      </div>
    } @else {
      <div class="report-view__bar">
        <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
          <ui-icon name="return" [size]="16" />
          {{ t('common.back') }}
        </button>
        <h2 class="report-view__title">{{ reportHeading(selected()!.labelKey) }}</h2>
        <span class="report-view__crumb">{{ t(categoryOf(selected()!.id).labelKey) }}</span>
      </div>
      <div class="report-workbook">
        <crud-panel
          moduleId="reports"
          [tabId]="selected()!.id"
          [endpoint]="selected()!.endpoint"
          [columns]="selected()!.columns"
          [readOnly]="true"
          [titleKey]="selected()!.labelKey"
          [printKind]="selected()!.id === 'invoices' ? 'invoice' : 'record'"
        />
      </div>
    }
  `,
})
export class ReportsPage extends Translated {
  private readonly store = inject(RuntimeConfigStore);
  protected readonly categories = REPORT_CATEGORIES;
  protected readonly activeId = routedTab('');
  private readonly navigateToTab = tabNavigator();

  protected readonly selected = computed<ReportDef | null>(() => {
    const id = this.activeId();
    for (const category of REPORT_CATEGORIES) {
      const report = category.reports.find((item) => item.id === id);
      if (report) return report;
    }
    return null;
  });

  protected reportHeading(labelKey: string): string {
    return withReportWord(this.t(labelKey), this.t('reports.word'), this.store.language());
  }

  protected iconOf(id: string): string {
    return REPORT_ICONS[id] ?? 'document';
  }

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
