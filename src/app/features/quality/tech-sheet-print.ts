import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { TechDataSheet } from '../../core/models/quality.models';
import { Translated } from '../../shared/translated.base';

/** Prints the quality TDS with the cutter roll label. */
@Component({
  selector: 'app-tech-sheet-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sheet(); as s) {
      <section class="print-doc">
        <h2 class="print-sheet__doc">{{ t('quality.tabs.techSheets') }} — {{ s.specName }}</h2>
        <div class="roll-label__grid">
          <div>{{ t('common.code') }}</div>
          <div class="mono">{{ s.specCode }}</div>
          @if (s.rollSerial) {
            <div>{{ t('quality.fields.rollSerial') }}</div>
            <div class="mono">{{ s.rollSerial }}</div>
          }
          @if (s.ply) {
            <div>{{ t('qc.fields.ply') }}</div>
            <div class="mono">{{ s.ply }}</div>
          }
          <div>{{ t('cutter.label.gsm') }}</div>
          <div class="mono">{{ fmtNum(s.gsm) }}</div>
          <div>{{ t('quality.fields.thickness') }}</div>
          <div class="mono">{{ fmtNum(s.thickness) }}</div>
          <div>{{ t('quality.fields.brightness') }}</div>
          <div class="mono">{{ fmtNum(s.brightnessPercent) }}</div>
          <div>{{ t('quality.fields.tensileMd') }}</div>
          <div class="mono">{{ fmtNum(s.tensileMd) }}</div>
          <div>{{ t('quality.fields.tensileCd') }}</div>
          <div class="mono">{{ fmtNum(s.tensileCd) }}</div>
        </div>
        @if (s.notes) {
          <p class="ui-field__hint">{{ s.notes }}</p>
        }
      </section>
    }
  `,
})
export class TechSheetPrint extends Translated {
  readonly specCode = input('');
  /** When set, the sheet registered for this roll serial wins over the spec-level one. */
  readonly rollSerial = input<number | undefined>(undefined);
  private readonly api = inject(ApiClientService);
  private readonly rows = signal<TechDataSheet[]>([]);
  protected readonly sheet = computed(() => {
    const serial = this.rollSerial();
    return (
      (serial !== undefined
        ? this.rows().find((row) => row.rollSerial === serial)
        : undefined) ??
      this.rows().find((row) => row.specCode === this.specCode() && row.rollSerial === undefined) ??
      this.rows().find((row) => row.specCode === this.specCode()) ??
      null
    );
  });

  constructor() {
    super();
    this.api
      .get<TechDataSheet[]>(API_ENDPOINTS.quality.techSheets)
      .subscribe((rows) => this.rows.set(rows));
  }
}
