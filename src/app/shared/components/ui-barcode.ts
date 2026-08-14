import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { encodeCode39 } from '../utils/code39';

/** SVG Code 39 barcode — used on the مقص roll label. */
@Component({
  selector: 'ui-barcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let code = encoded();
    <svg
      [attr.viewBox]="'0 0 ' + code.totalWidth + ' ' + height()"
      [attr.width]="renderWidth()"
      [attr.height]="height()"
      preserveAspectRatio="none"
      role="img"
    >
      @for (bar of code.segments; track $index) {
        @if (bar.dark) {
          <rect
            [attr.x]="bar.x"
            y="0"
            [attr.width]="bar.width"
            [attr.height]="height()"
            fill="currentColor"
          />
        }
      }
    </svg>
    <span class="mono">*{{ value() }}*</span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class UiBarcode {
  readonly value = input.required<string>();
  readonly height = input(40);
  readonly renderWidth = input(240);
  protected readonly encoded = computed(() => encodeCode39(this.value()));
}
