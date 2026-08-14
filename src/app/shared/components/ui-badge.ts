import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Translated } from '../translated.base';

@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-badge" [class]="'ui-badge--' + tone()">
      {{ t(labelKey()) }}
    </span>
  `,
})
export class UiBadge extends Translated {
  readonly labelKey = input.required<string>();
  readonly tone = input<'success' | 'warning' | 'danger' | 'info' | 'neutral'>('neutral');
}
