import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CutterRoll } from '../../core/models/cutter.models';
import { Translated } from '../../shared/translated.base';
import { UiIcon } from '../../shared/components/ui-icon';
import { TechSheetPrint } from '../quality/tech-sheet-print';
import { RollLabel } from './roll-label';

/**
 * Post-save result: the batch's main serial + every sub-roll with its own
 * serial/barcode, each printable alone or all at once.
 */
@Component({
  selector: 'app-roll-created-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon, RollLabel, TechSheetPrint],
  template: `
    <section class="ui-card stack">
      <h2 class="ui-card__title">{{ t('cutter.createdTitle') }}</h2>
      <p>
        {{ t('cutter.fields.mainSerial') }}:
        <strong class="mono">{{ rolls()[0]?.mainSerial ?? rolls()[0]?.serial }}</strong>
      </p>
      <div class="ui-table-wrap ui-table-wrap--solo">
        <table class="ui-table">
          <thead>
            <tr>
              <th>{{ t('cutter.subRoll') }}</th>
              <th>{{ t('cutter.fields.serial') }}</th>
              <th>{{ t('cutter.fields.barcode') }}</th>
              <th>{{ t('cutter.fields.weight') }}</th>
              <th>{{ t('cutter.fields.width') }}</th>
              <th>{{ t('cutter.fields.grade') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (roll of rolls(); track roll.id) {
              <tr>
                <td>#{{ roll.subIndex ?? 1 }}</td>
                <td class="mono">{{ roll.serial }}</td>
                <td class="mono">{{ roll.barcode }}</td>
                <td class="mono">{{ fmtNum(roll.weightKg) }}</td>
                <td class="mono">{{ fmtNum(roll.rollWidthMm) }}</td>
                <td>{{ t('cutter.grades.' + roll.grade) }}</td>
                <td>
                  <button
                    type="button"
                    class="ui-btn ui-btn--ghost"
                    (click)="printOne.emit(roll)"
                  >
                    <ui-icon name="print" [size]="14" />
                    {{ t('common.print') }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="row">
        <button type="button" class="ui-btn ui-btn--primary" (click)="printOne.emit(null)">
          <ui-icon name="print" [size]="16" />
          {{ t('cutter.printAll') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="newBatch.emit()">
          {{ t('cutter.newBatch') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="back.emit()">
          {{ t('common.back') }}
        </button>
      </div>

      <div class="print-area">
        @for (roll of printQueue(); track roll.id) {
          <app-roll-label [roll]="roll" />
          <app-tech-sheet-print [specCode]="roll.specCode" [rollSerial]="roll.serial" />
        }
      </div>
    </section>
  `,
})
export class RollCreatedPanel extends Translated {
  readonly rolls = input<CutterRoll[]>([]);
  /** Rolls whose labels + tech sheets render in the print area now. */
  readonly printQueue = input<CutterRoll[]>([]);
  /** null → print the whole batch. */
  readonly printOne = output<CutterRoll | null>();
  readonly newBatch = output<void>();
  readonly back = output<void>();
}
