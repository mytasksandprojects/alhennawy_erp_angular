import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { CutterRoll } from '../../core/models/cutter.models';
import { UiBarcode } from '../../shared/components/ui-barcode';
import { Translated } from '../../shared/translated.base';

/**
 * بطاقة المقص — printable roll label, faithful to the physical card:
 * company header + product name + data grid (Weight / GSM / Roll Width /
 * Diameter / Notes / Add User) + ISO strip + barcode with serial.
 * All captions come from the API translation map.
 */
@Component({
  selector: 'app-roll-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBarcode],
  template: `
    @let r = roll();
    <div class="roll-label">
      <div class="roll-label__head">
        <img class="roll-label__logo" [src]="logoUrl()" [alt]="t('company.name')" />
        <div class="roll-label__company">
          <strong>{{ t('company.name') }}</strong><br />
          {{ t('company.address') }}<br />
          {{ t('cutter.label.tel') }} : {{ company()?.phone }}<br />
          {{ t('cutter.label.fax') }} : {{ company()?.fax }}
        </div>
      </div>

      <div class="roll-label__product">{{ r.specName }}</div>

      <div class="roll-label__grid">
        <div>{{ t('cutter.label.weight') }}</div>
        <div class="mono">{{ fmtNum(r.weightKg) }}</div>
        <div>{{ t('cutter.label.gsm') }}</div>
        <div class="mono">{{ fmtNum(r.gsm) }}</div>
        <div>{{ t('cutter.label.width') }}</div>
        <div class="mono">{{ fmtNum(r.rollWidthMm) }}</div>
        <div>{{ t('cutter.label.diameter') }}</div>
        <div class="mono">{{ fmtNum(r.diameterMm) }}</div>
        <div>{{ t('cutter.label.notes') }}</div>
        <div>{{ r.notes ?? '' }}</div>
        <div>{{ t('cutter.label.addUser') }}</div>
        <div>{{ r.addUser }}</div>
      </div>

      <div class="roll-label__iso">
        @for (iso of isoCertifications(); track iso) {
          <span>ISO {{ iso }}</span>
        }
      </div>

      <div class="roll-label__barcode">
        <span class="text-faint">{{ t(poweredByKey()) }}</span>
        <ui-barcode [value]="r.barcode" [height]="34" [renderWidth]="220" />
        <strong>{{ t(madeInKey()) }}</strong>
      </div>
    </div>
  `,
})
export class RollLabel extends Translated {
  readonly roll = input.required<CutterRoll>();

  private readonly store = inject(RuntimeConfigStore);

  protected readonly company = computed(() => this.store.settings()?.company);
  protected readonly logoUrl = computed(() => this.company()?.logoUrl ?? '');
  protected readonly isoCertifications = computed(
    () => this.company()?.isoCertifications ?? [],
  );
  protected readonly madeInKey = computed(
    () => this.company()?.madeInKey ?? '',
  );
  protected readonly poweredByKey = computed(
    () => this.company()?.poweredByKey ?? '',
  );
}
