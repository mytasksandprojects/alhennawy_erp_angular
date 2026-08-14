import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Translated } from '../../shared/translated.base';
import { UiIcon } from '../../shared/components/ui-icon';
import {
  alphaOf,
  buildGradient,
  GradientSpec,
  hexToCss,
  parseGradient,
  toHexColor,
} from './color-utils';

/**
 * Interactive swatch for one theme token: solid colors open the native
 * color picker; gradients open a builder to choose the gradient type,
 * angle and any number of colors.
 */
@Component({
  selector: 'app-token-color',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiIcon],
  template: `
    @if (gradient(); as g) {
      <button
        type="button"
        class="token-row__swatch token-row__swatch--btn"
        [style.background]="value()"
        [attr.aria-label]="t('appearance.gradient.edit')"
        (click)="open.set(!open())"
      ></button>
      @if (open()) {
        <div class="color-pop">
          <label class="row color-pop__row">
            <span class="ui-field__label">{{ t('appearance.gradient.type') }}</span>
            <select class="ui-control" [ngModel]="g.kind" (ngModelChange)="setKind($event)">
              <option value="linear">{{ t('appearance.gradient.linear') }}</option>
              <option value="radial">{{ t('appearance.gradient.radial') }}</option>
            </select>
          </label>
          @if (g.kind === 'linear') {
            <label class="row color-pop__row">
              <span class="ui-field__label">{{ t('appearance.gradient.angle') }}</span>
              <input
                class="ui-control"
                type="number"
                min="0"
                max="360"
                [ngModel]="g.angle"
                (ngModelChange)="setAngle($event)"
              />
            </label>
          }
          @for (stop of g.stops; track $index) {
            <div class="row color-pop__row">
              <input
                type="color"
                class="color-pop__swatch"
                [value]="stopHex($index)"
                (input)="setStop($index, $any($event.target).value)"
              />
              <span class="mono color-pop__value">{{ stop }}</span>
              @if (g.stops.length > 2) {
                <button
                  type="button"
                  class="ui-btn ui-btn--icon ui-btn--ghost"
                  [attr.aria-label]="t('common.delete')"
                  (click)="removeStop($index)"
                >
                  <ui-icon name="close" [size]="12" />
                </button>
              }
            </div>
          }
          <button type="button" class="ui-btn ui-btn--ghost" (click)="addStop()">
            <ui-icon name="plus" [size]="14" />
            {{ t('appearance.gradient.addColor') }}
          </button>
        </div>
      }
    } @else if (hex(); as solid) {
      <input
        type="color"
        class="token-row__swatch token-row__swatch--picker"
        [value]="solid"
        [attr.aria-label]="t('appearance.pickColor')"
        (input)="pickSolid($any($event.target).value)"
      />
    } @else {
      <span class="token-row__swatch" [style.background]="value()"></span>
    }
  `,
})
export class TokenColorEditor extends Translated {
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  protected readonly open = signal(false);
  protected readonly gradient = computed(() => parseGradient(this.value()));
  protected readonly hex = computed(() => toHexColor(this.value()));

  protected stopHex(index: number): string {
    const stop = this.gradient()?.stops[index] ?? '';
    return toHexColor(stop) ?? toHexColor('rgb(0, 0, 0)')!;
  }

  protected pickSolid(hex: string): void {
    this.valueChange.emit(hexToCss(hex, alphaOf(this.value())));
  }

  protected setKind(kind: GradientSpec['kind']): void {
    this.rebuild({ ...this.gradient()!, kind });
  }

  protected setAngle(angle: number): void {
    this.rebuild({ ...this.gradient()!, angle: Number(angle) || 0 });
  }

  protected setStop(index: number, hex: string): void {
    const spec = this.gradient()!;
    const stops = spec.stops.map((stop, i) =>
      i === index ? hexToCss(hex, alphaOf(stop)) : stop,
    );
    this.rebuild({ ...spec, stops });
  }

  protected addStop(): void {
    const spec = this.gradient()!;
    this.rebuild({ ...spec, stops: [...spec.stops, spec.stops[spec.stops.length - 1]] });
  }

  protected removeStop(index: number): void {
    const spec = this.gradient()!;
    this.rebuild({ ...spec, stops: spec.stops.filter((_, i) => i !== index) });
  }

  private rebuild(spec: GradientSpec): void {
    this.valueChange.emit(buildGradient(spec));
  }
}
