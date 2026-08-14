import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatementRow } from '../../core/models/finance.models';
import { UiSpinner } from '../../shared/components/ui-spinner';
import { Translated } from '../../shared/translated.base';

/** Renders an API-delivered financial statement (P&L / balance sheet). */
@Component({
  selector: 'app-statement-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiSpinner],
  template: `
    <section class="ui-card">
      <h2 class="ui-card__title">{{ t(titleKey()) }}</h2>
      @if (rows().length) {
        <div class="statement">
          @for (row of rows(); track row.id) {
            <div [class]="'statement__row statement__row--' + row.kind">
              <span>{{ t(row.labelKey) }}</span>
              @if (row.amount !== undefined) {
                <span
                  class="mono"
                  [class.statement__amount--negative]="row.amount < 0"
                >
                  {{ fmtNum(row.amount) }}
                </span>
              }
            </div>
          }
        </div>
      } @else {
        <ui-spinner />
      }
    </section>
  `,
})
export class StatementView extends Translated {
  readonly titleKey = input.required<string>();
  readonly rows = input.required<StatementRow[]>();
}
