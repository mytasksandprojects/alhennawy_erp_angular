import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartPoint } from '../../core/models/common.models';
import { Translated } from '../translated.base';

interface DonutSegment {
  point: ChartPoint;
  percent: number;
  /** stroke-dasharray/-offset on a circle with circumference 100. */
  dash: string;
  offset: number;
  colorIndex: number;
}

const PALETTE_SIZE = 6;
/** r chosen so the circle's circumference is exactly 100 svg units. */
const RADIUS = 15.915;

/** Dependency-free SVG donut chart with legend, colored by theme tokens. */
@Component({
  selector: 'ui-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="donut-chart">
      <svg class="donut-chart__svg" viewBox="0 0 42 42" aria-hidden="true">
        @for (seg of segments(); track $index) {
          <circle
            [class]="'donut-chart__seg donut-chart__seg--' + seg.colorIndex"
            cx="21"
            cy="21"
            [attr.r]="radius"
            fill="none"
            [attr.stroke-dasharray]="seg.dash"
            [attr.stroke-dashoffset]="seg.offset"
          />
        }
      </svg>
      <div class="donut-chart__legend">
        @for (seg of segments(); track $index) {
          <div class="donut-chart__item">
            <span
              [class]="'donut-chart__dot donut-chart__dot--' + seg.colorIndex"
            ></span>
            <span class="donut-chart__name text-soft">
              {{ seg.point.labelKey ? t(seg.point.labelKey) : (seg.point.label ?? '') }}
            </span>
            <span class="mono">{{ fmtNum(seg.point.value) }}</span>
            <span class="donut-chart__pct text-faint mono">
              {{ fmtNum(seg.percent) }}{{ t('units.percent') }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class UiDonutChart extends Translated {
  readonly points = input.required<ChartPoint[]>();
  protected readonly radius = RADIUS;

  protected readonly segments = computed<DonutSegment[]>(() => {
    const pts = this.points();
    const total = pts.reduce((sum, p) => sum + p.value, 0) || 1;
    let consumed = 0;
    return pts.map((point, index) => {
      const share = (point.value / total) * 100;
      const segment: DonutSegment = {
        point,
        percent: Math.round(share),
        dash: `${share} ${100 - share}`,
        // 25 rotates the start to 12 o'clock; each segment starts after
        // the share already consumed by previous segments.
        offset: 25 - consumed,
        colorIndex: (index % PALETTE_SIZE) + 1,
      };
      consumed += share;
      return segment;
    });
  });
}
