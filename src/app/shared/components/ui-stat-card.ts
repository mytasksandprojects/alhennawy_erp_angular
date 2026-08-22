import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { StatCardData } from '../../core/models/common.models';
import { navigateToTarget } from '../tab-route';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

@Component({
  selector: 'ui-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    @let s = stat();
    <div
      class="ui-card stat-card"
      [class.stat-card--link]="!!s.route"
      [attr.role]="s.route ? 'link' : null"
      [attr.tabindex]="s.route ? 0 : null"
      (click)="open()"
      (keydown.enter)="open()"
    >
      <div class="stat-card__icon">
        <ui-icon [name]="s.icon" [size]="24" />
      </div>
      <div>
        <div class="stat-card__value">
          {{ fmtNum(s.value) }}
          @if (s.unitKey) {
            <span class="text-faint">{{ t(s.unitKey) }}</span>
          }
        </div>
        <div class="stat-card__label">{{ t(s.labelKey) }}</div>
        @if (s.trendPercent !== undefined) {
          <div
            class="stat-card__trend"
            [class.stat-card__trend--up]="s.trendPercent >= 0"
            [class.stat-card__trend--down]="s.trendPercent < 0"
          >
            {{ fmtNum(s.trendPercent) }}%
          </div>
        }
      </div>
    </div>
  `,
})
export class UiStatCard extends Translated {
  readonly stat = input.required<StatCardData>();
  private readonly router = inject(Router);

  protected open(): void {
    navigateToTarget(this.router, this.stat());
  }
}
