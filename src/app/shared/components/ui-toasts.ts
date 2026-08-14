import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

@Component({
  selector: 'ui-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="ui-toasts" aria-live="polite">
      @for (toast of notifications.toasts(); track toast.id) {
        <div class="ui-toast" [class]="'ui-toast--' + toast.tone">
          <span>{{ t(toast.messageKey, toast.params) }}</span>
          <button
            type="button"
            class="ui-btn ui-btn--ghost"
            [attr.aria-label]="t('common.close')"
            (click)="notifications.dismiss(toast.id)"
          >
            <ui-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
})
export class UiToasts extends Translated {
  protected readonly notifications = inject(NotificationService);
}
