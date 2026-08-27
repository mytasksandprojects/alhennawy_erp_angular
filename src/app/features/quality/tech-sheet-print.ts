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
          <div>{{ t('cutter.label.gsm') }}</div>
          <div class="mono">{{ fmtNum(s.gsm) }}</div>
          <div>{{ t('quality.fields.moisture') }}</div>
          <div class="mono">{{ fmtNum(s.moisturePercent) }}</div>
          <div>{{ t('quality.fields.brightness') }}</div>
          <div class="mono">{{ fmtNum(s.brightnessPercent) }}</div>
          <div>{{ t('quality.fields.burst') }}</div>
          <div class="mono">{{ fmtNum(s.burst) }}</div>
          <div>{{ t('quality.fields.tensile') }}</div>
          <div class="mono">{{ fmtNum(s.tensile) }}</div>
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
  private readonly api = inject(ApiClientService);
  private readonly rows = signal<TechDataSheet[]>([]);
  protected readonly sheet = computed(
    () => this.rows().find((row) => row.specCode === this.specCode()) ?? null,
  );

  constructor() {
    super();
    this.api
      .get<TechDataSheet[]>(API_ENDPOINTS.quality.techSheets)
      .subscribe((rows) => this.rows.set(rows));
  }
}
