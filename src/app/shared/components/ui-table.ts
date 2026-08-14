import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
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
import { Translated } from '../translated.base';
import { UiBadge } from './ui-badge';
import { UiEmptyState } from './ui-empty-state';

type Row = Record<string, unknown>;

/**
 * Generic, config-driven data table used by every list screen.
 * Columns carry translation keys and formatting types — no screen ever
 * hand-writes a table again.
 */
@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiEmptyState],
  template: `
    <div class="ui-table-wrap">
      <table class="ui-table" [class.ui-table--clickable]="clickable()">
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th [class]="cellClass(col)">{{ t(col.labelKey) }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr (click)="clickable() && rowClick.emit(row)">
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
                      <!-- Admin-managed lookup values are raw text, not keys -->
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
            </tr>
          }
        </tbody>
      </table>
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
  readonly rowClick = output<Row>();
  protected readonly viewer = inject(ImageViewerService);
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(RuntimeConfigStore);

  /** Multilang cells show the active language's value, base as fallback. */
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
