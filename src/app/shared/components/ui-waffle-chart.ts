import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartPoint } from '../../core/models/common.models';
import { Translated } from '../translated.base';

interface WaffleCell {
  tone: number;
}

const TONES = 6;

/** Unit grid — each cell is one report, colored by department. */
@Component({
  selector: 'ui-waffle-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="waffle-chart">
      <div class="waffle-chart__grid">
        @for (cell of cells(); track $index) {
          <span [class]="'waffle-chart__cell waffle-chart__cell--' + cell.tone"></span>
        }
      </div>
      <div class="waffle-chart__legend">
        @for (point of points(); track $index) {
          <div class="waffle-chart__item">
            <span [class]="'waffle-chart__swatch waffle-chart__swatch--' + (($index % 6) + 1)"></span>
            <span class="text-soft">
              {{ point.labelKey ? t(point.labelKey) : (point.label ?? '') }}
            </span>
            <span class="mono">{{ fmtNum(point.value) }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class UiWaffleChart extends Translated {
  readonly points = input.required<ChartPoint[]>();

  protected readonly cells = computed<WaffleCell[]>(() => {
    const out: WaffleCell[] = [];
    this.points().forEach((point, index) => {
      const tone = (index % TONES) + 1;
      const count = Math.max(0, Math.round(point.value));
      for (let i = 0; i < count; i += 1) out.push({ tone });
    });
    return out;
  });
}
