import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartPoint } from '../../core/models/common.models';
import { Translated } from '../translated.base';

/** SVG area + line — a wave, not columns or a donut. */
@Component({
  selector: 'ui-area-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="area-chart">
      <svg class="area-chart__svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path class="area-chart__fill" [attr.d]="area()" />
        <path class="area-chart__line" [attr.d]="line()" />
      </svg>
      <div class="area-chart__axis">
        @for (point of points(); track $index) {
          <span class="area-chart__label text-faint">
            {{ point.labelKey ? t(point.labelKey) : (point.label ?? '') }}
          </span>
        }
      </div>
    </div>
  `,
})
export class UiAreaChart extends Translated {
  readonly points = input.required<ChartPoint[]>();

  private readonly coords = computed(() => {
    const rows = this.points();
    const peak = Math.max(...rows.map((row) => row.value), 1);
    const last = Math.max(rows.length - 1, 1);
    return rows.map((row, index) => ({
      x: (index / last) * 100,
      y: 36 - (row.value / peak) * 32,
    }));
  });

  protected readonly line = computed(() => {
    const dots = this.coords();
    if (!dots.length) return '';
    return dots.map((dot, index) => `${index ? 'L' : 'M'} ${dot.x} ${dot.y}`).join(' ');
  });

  protected readonly area = computed(() => {
    const stroke = this.line();
    return stroke ? `${stroke} L 100 40 L 0 40 Z` : '';
  });
}
