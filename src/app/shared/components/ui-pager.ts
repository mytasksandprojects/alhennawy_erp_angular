import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PAGE_SIZES } from '../crud/paged-list';
import { Translated } from '../translated.base';

/** Previous/next pager. Use `pageCount` for client pages, or `total` + `pageSize` for server lists. */
@Component({
  selector: 'ui-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (size() > 0 || pages() > 1) {
      <nav class="ui-pager" [attr.aria-label]="t('common.pageOf', [page(), pages()])">
        <button type="button" class="ui-btn ui-btn--ghost" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">
          {{ t('common.prev') }}
        </button>
        <span class="ui-pager__status">{{ t('common.pageOf', [page(), pages()]) }}</span>
        <button type="button" class="ui-btn ui-btn--ghost" [disabled]="page() >= pages()" (click)="pageChange.emit(page() + 1)">
          {{ t('common.next') }}
        </button>
        @if (size() > 0) {
          <label class="ui-pager__size">
            <span class="ui-field__label">{{ t('common.pageSize') }}</span>
            <select class="ui-control" [value]="size()" (change)="pageSizeChange.emit(+$any($event.target).value)">
              @for (option of sizes; track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
        }
      </nav>
    }
  `,
})
export class UiPager extends Translated {
  readonly page = input.required<number>();
  readonly pageCount = input(0);
  readonly pageSize = input(0);
  readonly total = input(0);
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  protected readonly sizes = PAGE_SIZES;
  protected readonly size = computed(() => this.pageSize());
  protected readonly pages = computed(() =>
    this.pageCount() || Math.max(1, Math.ceil(this.total() / (this.size() || 1)) || 1),
  );
}
