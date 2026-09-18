import { ChangeDetectionStrategy, Component, computed, input, output, WritableSignal } from '@angular/core';
import { CutterRoll } from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { ExportDocStage, ExportOrder, SalesOrderLine } from '../../core/models/sales.models';
import { Translated } from '../../shared/translated.base';
import { UiIcon } from '../../shared/components/ui-icon';
import { availableRolls, linkedApproved, numFrom } from './export-board.utils';

/**
 * The stage-specific action card — which section renders depends on the
 * order's pipeline stage (quotation → … → issued).
 */
@Component({
  selector: 'app-export-stage-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    @if (row().stage === 'quotation' || row().stage === 'internal-approval') {
      <section class="ui-card stack">
        <label class="row">
          <input
            type="checkbox"
            [checked]="trial()()"
            (change)="trial().set(!trial()())"
          />
          {{ t('sales.fields.trialOrder') }}
        </label>
        <p class="ui-field__hint">{{ t('sales.hints.trialOrder') }}</p>
        <div class="ui-field">
          <span class="ui-field__label">{{ t('sales.fields.terms') }}</span>
          <p class="ui-field__hint">{{ termsText() || '—' }}</p>
        </div>
        <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
          {{ t('sales.actions.issueProforma') }}
        </button>
      </section>
    }

    @if (row().stage === 'proforma') {
      <section class="ui-card stack">
        @if (row().proformaStatus !== 'approved') {
          <p class="ui-field__hint">{{ t('sales.hints.proformaGate') }}</p>
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="decide.emit('approved')">
              {{ t('common.approve') }}
            </button>
            <button type="button" class="ui-btn ui-btn--danger" (click)="decide.emit('rejected')">
              {{ t('common.reject') }}
            </button>
          </div>
        } @else {
          <div class="row">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="printDoc.emit(false)">
              <ui-icon name="print" [size]="16" [brand]="true" />
              {{ t('sales.actions.printProforma') }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="printDoc.emit(true)">
              <ui-icon name="pdf" [size]="16" />
              {{ t('common.exportPdf') }}
            </button>
            <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
              {{ t('sales.stages.supply-order') }}
            </button>
          </div>
        }
      </section>
    }

    @if (row().stage === 'supply-order') {
      <section class="ui-card stack">
        <p class="ui-field__hint">{{ t('sales.hints.rolls') }}</p>
        @for (line of lines(); track $index) {
          <div class="row">
            <label class="ui-field">
              <span class="ui-field__label">
                {{ line.itemName }} — {{ t('sales.fields.rolls') }}
              </span>
              <input
                class="ui-control"
                type="number"
                [value]="lineRolls()()[$index] || 0"
                (input)="setLineRoll($index, num($event))"
              />
            </label>
            <span class="ui-field__hint">
              {{ t('sales.fields.availableRolls') }}: {{ fmtNum(availableRolls(line)) }}
            </span>
          </div>
        }
        <label class="ui-field">
          <span class="ui-field__label">{{ t('logistics.fields.containers') }}</span>
          <input class="ui-control" type="number" [value]="containers()()" (input)="containers().set(num($event))" />
        </label>
        <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
          {{ t('sales.stages.warehouse') }}
        </button>
      </section>
    }

    @if (row().stage === 'warehouse') {
      <section class="ui-card stack">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('sales.fields.deadline') }}</span>
          <input class="ui-control" type="date" [value]="deadline()()" (input)="deadline().set($any($event.target).value)" />
        </label>
        <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
          {{ t('sales.stages.production-scheduled') }}
        </button>
      </section>
    }

    @if (row().stage === 'production-scheduled') {
      <section class="ui-card stack">
        @if (!approved()) {
          <p class="ui-field__hint">{{ t('sales.hints.waitingApproval') }}</p>
        }
        <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
          {{ t('sales.stages.production') }}
        </button>
      </section>
    }

    @if (row().stage === 'production') {
      <section class="ui-card stack">
        <p class="ui-field__hint">{{ t('sales.hints.logisticsDate') }}</p>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('logistics.fields.loadingDate') }}</span>
          <input
            class="ui-control"
            type="date"
            [min]="(row().productionDate || '').slice(0, 10)"
            [value]="loading()()"
            (input)="loading().set($any($event.target).value)"
          />
        </label>
        <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
          {{ t('sales.stages.logistics') }}
        </button>
      </section>
    }

    @if (row().stage === 'logistics' || row().stage === 'issued') {
      <section class="ui-card stack">
        @if (row().stage === 'logistics') {
          <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
            {{ t('sales.stages.issued') }}
          </button>
        } @else if (next(); as next) {
          <button type="button" class="ui-btn ui-btn--primary" (click)="advanceStage.emit()">
            {{ t('sales.stages.' + next) }}
          </button>
        }
        @if (row().loadingDate && row().loadingRequestStatus !== 'pending') {
          <div class="row">
            <label class="ui-field">
              <span class="ui-field__label">{{ t('sales.fields.requestedLoadingDate') }}</span>
              <input
                class="ui-control"
                type="date"
                [min]="(row().productionDate || '').slice(0, 10)"
                [value]="requestedLoading()()"
                (input)="requestedLoading().set($any($event.target).value)"
              />
            </label>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="requestLoading.emit()">
              {{ t('sales.actions.requestLoading') }}
            </button>
          </div>
          <p class="ui-field__hint">{{ t('sales.hints.reschedule') }}</p>
        }
      </section>
    }
  `,
})
export class ExportStagePanel extends Translated {
  readonly row = input.required<ExportOrder>();
  readonly lines = input<SalesOrderLine[]>([]);
  readonly termsText = input('');
  readonly next = input<ExportDocStage | null>(null);
  /** The parent's writable signals — edited inline by the stage inputs. */
  readonly trial = input.required<WritableSignal<boolean>>();
  readonly lineRolls = input.required<WritableSignal<number[]>>();
  readonly containers = input.required<WritableSignal<number>>();
  readonly deadline = input.required<WritableSignal<string>>();
  readonly loading = input.required<WritableSignal<string>>();
  readonly requestedLoading = input.required<WritableSignal<string>>();
  readonly rolls = input<CutterRoll[]>([]);
  readonly productionOrders = input<ProductionOrder[]>([]);

  readonly advanceStage = output<void>();
  readonly decide = output<'approved' | 'rejected'>();
  readonly printDoc = output<boolean>();
  readonly requestLoading = output<void>();

  protected readonly num = numFrom;
  protected readonly approved = computed(() => linkedApproved(this.productionOrders(), this.row()));

  protected availableRolls(line: SalesOrderLine): number {
    return availableRolls(this.rolls(), line);
  }

  protected setLineRoll(index: number, value: number): void {
    this.lineRolls().update((rolls) => rolls.map((roll, i) => (i === index ? value : roll)));
  }
}
