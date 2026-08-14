import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

@Component({
  selector: 'ui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="ui-modal-overlay" (click)="onOverlay($event)">
      <div class="ui-modal" role="dialog" aria-modal="true">
        <div class="ui-modal__header">
          <h2 class="ui-modal__title">{{ t(titleKey()) }}</h2>
          <button
            type="button"
            class="ui-btn ui-btn--ghost"
            [attr.aria-label]="t('common.close')"
            (click)="closed.emit()"
          >
            <ui-icon name="close" [size]="16" />
          </button>
        </div>
        <ng-content />
      </div>
    </div>
  `,
})
export class UiModal extends Translated {
  readonly titleKey = input.required<string>();
  readonly closed = output<void>();

  protected onOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
