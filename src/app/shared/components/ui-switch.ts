import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Accessible glass toggle switch — styling comes from API theme tokens. */
@Component({
  selector: 'ui-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      class="ui-switch"
      [class.ui-switch--on]="checked()"
      [attr.aria-checked]="checked()"
      [disabled]="disabled()"
      (click)="toggled.emit(!checked())"
    ></button>
  `,
})
export class UiSwitch {
  readonly checked = input.required<boolean>();
  readonly disabled = input(false);
  readonly toggled = output<boolean>();
}
