import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartPoint } from '../../core/models/common.models';
import { Translated } from '../translated.base';

/** Dependency-free vertical column chart driven entirely by API data. */
@Component({
  selector: 'ui-column-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="column-chart">
      @for (point of points(); track $index) {
        <div class="column-chart__col">
          <span class="column-chart__value mono">{{ fmtNum(point.value) }}</span>
          <div class="column-chart__track">
            <div class="column-chart__fill" [style.height.%]="percent(point)"></div>
          </div>
          <span class="column-chart__label text-soft">
            {{ point.labelKey ? t(point.labelKey) : (point.label ?? '') }}
          </span>
        </div>
      }
    </div>
  `,
})
export class UiColumnChart extends Translated {
  readonly points = input.required<ChartPoint[]>();

  private readonly max = computed(() =>
    Math.max(...this.points().map((p) => p.value), 1),
  );

  protected percent(point: ChartPoint): number {
    return Math.round((point.value / this.max()) * 100);
  }
}
