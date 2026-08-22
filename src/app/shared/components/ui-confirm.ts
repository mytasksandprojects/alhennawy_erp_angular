import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm.service';
import { Translated } from '../translated.base';
import { UiModal } from './ui-modal';

/** Stacked confirm dialog — Save / Delete ask before the write runs. */
@Component({
  selector: 'ui-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiModal],
  template: `
    @if (confirm.open()) {
      <ui-modal
        [titleKey]="confirm.titleKey()"
        [stacked]="true"
        (closed)="confirm.answer(false)"
      >
        <div class="stack">
          <p class="ui-field__hint">{{ t(confirm.messageKey()) }}</p>
          <div class="row">
            <button
              type="button"
              class="ui-btn"
              [class.ui-btn--primary]="!confirm.danger()"
              [class.ui-btn--danger]="confirm.danger()"
              (click)="confirm.answer(true)"
            >
              {{ t(confirm.actionKey()) }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="confirm.answer(false)">
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class UiConfirm extends Translated {
  protected readonly confirm = inject(ConfirmService);
}
