import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ExportOrder, SalesOrderLine } from '../../core/models/sales.models';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { EXPORT_TONE } from './sales-export.meta';
import { lineTotal, proformaTone, requestTone } from './export-board.utils';

/** Export-order header: number/stage badges + line meta + status badges. */
@Component({
  selector: 'app-export-order-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge],
  template: `
    <section class="ui-card stack">
      <div class="row row--between">
        <h2 class="ui-card__title">{{ row().number }}</h2>
        <div class="row">
          @if (row().trialOrder) {
            <ui-badge [labelKey]="'sales.fields.trialOrder'" tone="info" />
          }
          @if (canUpdate()) {
            <button type="button" class="ui-btn ui-btn--ghost" (click)="edit.emit()">{{ t('common.edit') }}</button>
          }
          <ui-badge [labelKey]="'sales.stages.' + row().stage" [tone]="TONE[row().stage]" />
        </div>
      </div>
      <p class="text-faint">{{ row().customerCode }} · {{ row().customerName }}</p>
      @for (line of lines(); track $index) {
        <p>
          {{ line.itemName }}
          <span class="text-faint">
            {{ t('qc.fields.ply') }} {{ line.ply || '—' }} · {{ colorOf(line) }} ·
            {{ fmtNum(line.widthMm || 0) }} mm · {{ fmtNum(line.gsm || 0) }} {{ t('cutter.label.gsm') }} ·
            {{ fmtNum(line.quantity || 0) }} {{ t('units.kg') }} × {{ fmtNum(line.pricePerKg || 0) }}
            = {{ fmtNum(total(line)) }}
          </span>
          @if (line.rolls) {
            <span class="text-faint">· {{ t('sales.fields.rolls') }}: {{ fmtNum(line.rolls) }}</span>
          }
        </p>
      }
      @if (row().toProduceKg != null) {
        <p>{{ t('sales.fields.available') }}: {{ fmtNum(row().availableFromStockKg || 0) }} · {{ t('sales.fields.toProduce') }}: {{ fmtNum(row().toProduceKg || 0) }}</p>
      }
      @if (showPrice()) {
        <p>{{ t('sales.fields.totalPrice') }}: {{ fmtNum(row().totalUsd) }}</p>
      }
      @if (row().rollsCount) {
        <p>{{ t('sales.fields.rolls') }}: {{ fmtNum(row().rollsCount) }} · {{ t('logistics.fields.containers') }}: {{ fmtNum(row().containersCount) }}</p>
      }
      @if (row().proformaStatus) {
        <p>
          {{ t('sales.fields.proformaStatus') }}:
          <ui-badge [labelKey]="'sales.proforma.' + row().proformaStatus" [tone]="proformaTone(row())" />
        </p>
      }
      @if (row().productionDeadline) {
        <p>{{ t('sales.fields.deadline') }}: {{ fmtDate(row().productionDeadline || '') }}</p>
      }
      @if (row().productionDate) {
        <p>{{ t('sales.fields.productionDate') }}: {{ fmtDate(row().productionDate || '') }}</p>
      }
      @if (row().loadingDate) {
        <p>{{ t('logistics.fields.loadingDate') }}: {{ fmtDate(row().loadingDate || '') }}</p>
      }
      @if (row().loadingRequestStatus) {
        <p>
          {{ t('sales.fields.loadingRequest') }}: {{ fmtDate(row().requestedLoadingDate || '') }}
          <ui-badge [labelKey]="'sales.requestStatus.' + row().loadingRequestStatus" [tone]="requestTone(row())" />
        </p>
      }
    </section>
  `,
})
export class ExportOrderCard extends Translated {
  readonly row = input.required<ExportOrder>();
  readonly lines = input<SalesOrderLine[]>([]);
  readonly showPrice = input(false);
  readonly canUpdate = input(false);
  readonly edit = output<void>();

  protected readonly TONE = EXPORT_TONE;
  protected readonly total = lineTotal;
  protected readonly proformaTone = proformaTone;
  protected readonly requestTone = requestTone;

  protected colorOf(line: SalesOrderLine): string {
    const color = String(line.color || '');
    return this.t(color) || color || '—';
  }
}
