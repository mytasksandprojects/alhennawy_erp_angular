import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { Translated } from '../translated.base';

export interface TabItem {
  id: string;
  labelKey: string;
}

@Component({
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="ui-tabs" role="tablist">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          role="tab"
          class="ui-tab"
          [class.ui-tab--active]="tab.id === active()"
          [attr.aria-selected]="tab.id === active()"
          (click)="active.set(tab.id)"
        >
          {{ t(tab.labelKey) }}
        </button>
      }
    </nav>
  `,
})
export class UiTabs extends Translated {
  readonly tabs = input.required<TabItem[]>();
  readonly active = model.required<string>();
}
