import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

@Component({
  selector: 'ui-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="ui-empty">
      <ui-icon name="empty" [size]="32" />
      <span>{{ t(messageKey()) }}</span>
    </div>
  `,
})
export class UiEmptyState extends Translated {
  readonly messageKey = input('common.empty');
}
