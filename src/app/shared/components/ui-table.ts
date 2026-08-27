import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import {
  fileEntryHref,
  fileEntryName,
  multilangKey,
  splitImageList,
  TableColumn,
} from '../../core/models/common.models';
import { ImageViewerService } from '../../core/services/image-viewer.service';
import { NotificationService } from '../../core/services/notification.service';
import { exportRowsToCsv } from '../crud/export-csv';
import { attachLandscape } from '../crud/print-page';
import { printTitleName, withReportWord } from '../crud/print-cell';
import { Translated } from '../translated.base';
import { UiBadge } from './ui-badge';
import { UiEmptyState } from './ui-empty-state';
import { UiIcon } from './ui-icon';
import { UiPrintDoc } from './ui-print-doc';

type Row = Record<string, unknown>;

/**
 * Generic, config-driven data table used by every list screen.
 * Every row can print, save as PDF, or export Excel for that record.
 */
@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiEmptyState, UiIcon, UiPrintDoc],
  template: `
    <div
      class="ui-table-wrap"
      [class.ui-table-wrap--solo]="!!solo()"
      [class.print-sheet]="!!solo()"
    >
      @if (solo(); as doc) {
        <ui-print-doc [row]="doc" [columns]="columns()" [titleKey]="titleKey()" />
      }
      <header class="print-sheet__head print-only print-nested-hide">
        <img class="print-sheet__logo" [src]="logoUrl()" [alt]="t(nameKey())" />
        <h1 class="print-sheet__title">{{ t(nameKey()) }}</h1>
        @if (titleKey() || lineName()) {
          <p class="print-sheet__doc">
            @if (titleKey()) {
              {{ printDocTitle() }}
            }
            @if (lineName()) {
              — {{ lineName() }}
            }
          </p>
        }
      </header>
      <table class="ui-table" [class.ui-table--clickable]="clickable()">
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th [class]="cellClass(col)">{{ t(col.labelKey) }}</th>
            }
            @if (rowExport()) {
              <th class="ui-table__actions-col cell--center">{{ t('common.actions') }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr
              [class.ui-table__row--line]="line() === row"
              (click)="clickable() && rowClick.emit(row)"
            >
              @for (col of columns(); track col.key) {
                <td [class]="cellClass(col)">
                  @switch (col.type) {
                    @case ('number') {
                      {{ fmtNum(asNumber(row[col.key])) }}
                    }
                    @case ('currency') {
                      {{ fmtNum(asNumber(row[col.key])) }}
                    }
                    @case ('date') {
                      {{ fmtDate(asText(row[col.key])) }}
                    }
                    @case ('datetime') {
                      {{ fmtDate(asText(row[col.key])) }}
                      <span class="text-faint">{{ fmtTime(asText(row[col.key])) }}</span>
                    }
                    @case ('key') {
                      {{ t(asText(row[col.key])) || asText(row[col.key]) }}
                    }
                    @case ('badge') {
                      <ui-badge
                        [labelKey]="(col.keyPrefix ?? '') + asText(row[col.key])"
                        [tone]="col.badgeToneMap?.[asText(row[col.key])] ?? 'neutral'"
                      />
                    }
                    @case ('image') {
                      @if (imageUrls(row[col.key]).length) {
                        <span class="ui-table__thumbs">
                          @for (url of imageUrls(row[col.key]); track $index) {
                            <button
                              type="button"
                              class="ui-table__thumb-btn"
                              [attr.aria-label]="t('common.viewImage')"
                              (click)="$event.stopPropagation(); viewer.open(url)"
                            >
                              <img
                                class="ui-table__thumb"
                                [src]="url"
                                [alt]="t(col.labelKey)"
                                loading="lazy"
                              />
                            </button>
                          }
                        </span>
                      } @else {
                        <span class="text-faint">{{ t('common.noImage') }}</span>
                      }
                    }
                    @case ('files') {
                      @if (imageUrls(row[col.key]).length) {
                        <span class="ui-table__files">
                          @for (url of imageUrls(row[col.key]); track $index) {
                            <button
                              type="button"
                              class="ui-btn ui-btn--ghost ui-table__file"
                              (click)="$event.stopPropagation(); downloadFile(url, $index)"
                            >
                              {{ fileLabel(url, $index) }}
                            </button>
                          }
                        </span>
                      } @else {
                        <span class="text-faint">{{ t('common.empty') }}</span>
                      }
                    }
                    @default {
                      {{ cellText(row, col) }}
                    }
                  }
                </td>
              }
              @if (rowExport()) {
                <td class="ui-table__actions-col" (click)="$event.stopPropagation()">
                  <div class="ui-table__actions">
                    @if (allowPrint()) {
                      <button type="button" class="ui-table__action" [attr.aria-label]="t('common.print')" (click)="printRow(row, false)">
                        <ui-icon name="print" [size]="20" [brand]="true" />
                      </button>
                    }
                    @if (allowPdf()) {
                      <button type="button" class="ui-table__action" [attr.aria-label]="t('common.exportPdf')" (click)="printRow(row, true)">
                        <ui-icon name="pdf" [size]="20" />
                      </button>
                    }
                    @if (allowExcel()) {
                      <button type="button" class="ui-table__action" [attr.aria-label]="t('common.exportExcel')" (click)="excelRow(row)">
                        <ui-icon name="xls" [size]="20" />
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
      <footer class="print-sheet__foot print-only print-nested-hide">
        <div>{{ t(addressKey()) }}</div>
      </footer>
      @if (!rows().length) {
        <ui-empty-state />
      }
    </div>
  `,
})
export class UiTable extends Translated {
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<Row[]>();
  readonly clickable = input(false);
  readonly rowExport = input(true);
  readonly allowPrint = input(true);
  readonly allowPdf = input(true);
  readonly allowExcel = input(true);
  readonly titleKey = input('');
  readonly printKind = input<'record' | 'invoice' | 'sheet'>('record');
  readonly printAsReport = input(false);
  readonly rowClick = output<Row>();
  protected readonly viewer = inject(ImageViewerService);
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(RuntimeConfigStore);
  private readonly notifications = inject(NotificationService);
  protected readonly line = signal<Row | null>(null);
  protected readonly solo = signal<Row | null>(null);
  private dropLandscape: (() => void) | null = null;
  protected readonly logoUrl = () => this.store.settings()?.company.logoUrl ?? '';
  protected readonly nameKey = () => this.store.settings()?.company.nameKey ?? 'company.name';
  protected readonly addressKey = () =>
    this.store.settings()?.company.addressKey ?? 'company.address';

  protected printDocTitle(): string {
    const name = this.t(this.titleKey());
    if (!this.printAsReport() || this.solo()) return name;
    return withReportWord(name, this.t('reports.word'), this.store.language());
  }

  protected lineName(): string {
    const row = this.line();
    if (!row) return '';
    return printTitleName(
      row,
      this.store.language(),
      this.store.settings()?.defaultLanguage ?? 'ar',
    );
  }

  constructor() {
    super();
    this.document.defaultView?.addEventListener('afterprint', () => {
      this.line.set(null);
      this.solo.set(null);
      this.dropLandscape?.();
      this.dropLandscape = null;
      this.document.body.classList.remove('is-print-line', 'is-print-row');
    });
  }

  protected printRow(row: Row, asPdf: boolean): void {
    if (asPdf) this.notifications.info('common.pdfHint');
    if (this.printKind() === 'invoice') {
      this.solo.set(row);
      this.document.body.classList.add('is-print-row');
    } else {
      this.line.set(row);
      this.document.body.classList.add('is-print-line');
      if (this.columns().length > 8) this.dropLandscape = attachLandscape();
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.document.defaultView?.print()),
    );
  }

  protected excelRow(row: Row): void {
    const id = this.asText(row['id'] || row['code'] || row['number'] || 'row');
    exportRowsToCsv(this.columns(), [row], id, this.t, this.i18n.formatNumber);
  }

  protected cellText(row: Row, col: TableColumn): string {
    if (!col.multilang) return this.asText(row[col.key]);
    const key = multilangKey(
      col.key,
      this.store.language(),
      this.store.settings()?.defaultLanguage ?? 'ar',
    );
    return this.asText(row[key]) || this.asText(row[col.key]);
  }

  protected fileLabel(url: string, index: number): string {
    return fileEntryName(url) || `${this.t('common.file')} ${this.fmtNum(index + 1)}`;
  }

  protected downloadFile(url: string, index: number): void {
    const anchor = this.document.createElement('a');
    anchor.href = fileEntryHref(url);
    anchor.download = this.fileLabel(url, index);
    anchor.target = '_blank';
    anchor.click();
  }

  protected cellClass(col: TableColumn): string {
    if (col.align === 'center') return 'cell--center';
    if (col.align === 'end' || col.type === 'number' || col.type === 'currency') {
      return 'cell--number';
    }
    return '';
  }

  protected asText(value: unknown): string {
    return value === undefined || value === null ? '' : String(value);
  }

  protected imageUrls(value: unknown): string[] {
    return splitImageList(this.asText(value));
  }

  protected asNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }
}
