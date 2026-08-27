import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableColumn } from '../../core/models/common.models';
import { statusChoices } from '../crud/status-flow';
import { Translated } from '../translated.base';

/** Compact next-status buttons for a table row — never a form select. */
@Component({
  selector: 'ui-status-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (status of choices(); track status) {
      <button
        type="button"
        class="ui-table__action ui-table__action--status"
        [class.ui-table__action--danger]="col().badgeToneMap?.[status] === 'danger'"
        (click)="picked.emit(status)"
      >
        {{ t((col().keyPrefix ?? '') + status) }}
      </button>
    }
  `,
})
export class UiStatusActions extends Translated {
  readonly col = input.required<TableColumn>();
  readonly value = input.required<string>();
  readonly picked = output<string>();

  protected choices(): string[] {
    return statusChoices(this.col(), this.value());
  }
}
