import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartPoint } from '../../core/models/common.models';
import { Translated } from '../translated.base';

/** Dependency-free horizontal bar chart driven entirely by API data. */
@Component({
  selector: 'ui-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar-chart">
      @for (point of points(); track $index) {
        <div class="bar-chart__row">
          <span class="text-soft">
            {{ point.labelKey ? t(point.labelKey) : (point.label ?? '') }}
          </span>
          <div class="bar-chart__track">
            <div class="bar-chart__fill" [style.width.%]="percent(point)"></div>
          </div>
          <span class="bar-chart__value mono">{{ fmtNum(point.value) }}</span>
        </div>
      }
    </div>
  `,
})
export class UiBarChart extends Translated {
  readonly points = input.required<ChartPoint[]>();

  private readonly max = computed(() =>
    Math.max(...this.points().map((p) => p.value), 1),
  );

  protected percent(point: ChartPoint): number {
    return Math.round((point.value / this.max()) * 100);
  }
}
