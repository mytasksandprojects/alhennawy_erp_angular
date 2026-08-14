import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Translated } from '../translated.base';

/** Minimal previous/next pager used by long editable lists. */
@Component({
  selector: 'ui-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (pageCount() > 1) {
      <div class="ui-pager">
        <button
          type="button"
          class="ui-btn ui-btn--ghost"
          [disabled]="page() <= 1"
          (click)="pageChange.emit(page() - 1)"
        >
          {{ t('common.prev') }}
        </button>
        <span class="text-soft">
          {{ t('common.pageOf', [page(), pageCount()]) }}
        </span>
        <button
          type="button"
          class="ui-btn ui-btn--ghost"
          [disabled]="page() >= pageCount()"
          (click)="pageChange.emit(page() + 1)"
        >
          {{ t('common.next') }}
        </button>
      </div>
    }
  `,
})
export class UiPager extends Translated {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly pageChange = output<number>();
}
