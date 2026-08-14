import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Translated } from '../translated.base';

@Component({
  selector: 'ui-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div>
        <h1 class="page-header__title">{{ t(titleKey()) }}</h1>
        @if (subtitleKey()) {
          <p class="page-header__subtitle">{{ t(subtitleKey()!) }}</p>
        }
      </div>
      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
})
export class UiPageHeader extends Translated {
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string | null>(null);
}
