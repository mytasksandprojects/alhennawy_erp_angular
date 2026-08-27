import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TableColumn } from '../../core/models/common.models';
import { statusChoices } from '../crud/status-flow';
import { Translated } from '../translated.base';
import { UiModal } from './ui-modal';

/** Compact next-status buttons — prompts when a status needs a date. */
@Component({
  selector: 'ui-status-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiModal],
  template: `
    @for (status of choices(); track status) {
      <button
        type="button"
        class="ui-table__action ui-table__action--status"
        [class.ui-table__action--danger]="col().badgeToneMap?.[status] === 'danger'"
        (click)="ask(status)"
      >
        {{ t((col().keyPrefix ?? '') + status) }}
      </button>
    }
    @if (pending(); as status) {
      <ui-modal [titleKey]="need(status)!.labelKey" [stacked]="true" (closed)="pending.set('')">
        <div class="stack">
          <label class="ui-field">
            <span class="ui-field__label">{{ t(need(status)!.labelKey) }}</span>
            <input class="ui-control" type="date" [value]="at()" (input)="at.set($any($event.target).value)" />
          </label>
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="confirm(status)">{{ t('common.save') }}</button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="pending.set('')">{{ t('common.cancel') }}</button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class UiStatusActions extends Translated {
  readonly col = input.required<TableColumn>();
  readonly value = input.required<string>();
  readonly picked = output<{ status: string; extra?: Record<string, string> }>();

  protected readonly pending = signal('');
  protected readonly at = signal('');

  protected choices(): string[] {
    return statusChoices(this.col(), this.value());
  }

  protected need(status: string): { key: string; labelKey: string } | undefined {
    return this.col().statusNeed?.[status];
  }

  protected ask(status: string): void {
    const need = this.need(status);
    if (!need) {
      this.picked.emit({ status });
      return;
    }
    this.at.set('');
    this.pending.set(status);
  }

  protected confirm(status: string): void {
    const need = this.need(status);
    if (!need || !this.at()) return;
    this.picked.emit({ status, extra: { [need.key]: this.at() } });
    this.pending.set('');
  }
}
