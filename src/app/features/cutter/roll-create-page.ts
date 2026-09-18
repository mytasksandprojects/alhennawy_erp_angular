import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfirmService } from '../../core/services/confirm.service';
import { LookupService } from '../../core/services/lookup.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  CustomerSpec,
  CutterRoll,
} from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { TechSheetPrint } from '../quality/tech-sheet-print';
import { Translated } from '../../shared/translated.base';
import { CutterApiService } from './cutter-api.service';
import { RollLabel } from './roll-label';

interface RollEntryForm {
  weightKg: number | null;
  gsm: number | null;
  rollWidthMm: number | null;
  diameterMm: number | null;
  grade: 'first' | 'second';
}

/**
 * Registering produced rolls: shared spec / production orders / ply /
 * notes on top, then one input group per sub-roll (button adds more).
 * The batch gets a main serial and every sub-roll gets its own serial
 * — both previewed before saving — and each sub-roll prints its own
 * label + technical data sheet.
 */
@Component({
  selector: 'app-roll-create-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiPageHeader, UiIcon, RollLabel, TechSheetPrint],
  template: `
    <ui-page-header titleKey="cutter.newRoll" subtitleKey="cutter.newRollSubtitle" />

    @if (!created().length) {
      <form class="ui-card stack" (ngSubmit)="submit()">
        <div class="ui-form-grid">
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.spec') }}</span>
            <select
              class="ui-control"
              name="spec"
              required
              [ngModel]="specCode"
              (ngModelChange)="applySpec($event)"
            >
              @for (spec of specs(); track spec.specCode) {
                <option [value]="spec.specCode">
                  {{ spec.specCode }} — {{ spec.specName }}
                </option>
              }
            </select>
            <span class="ui-field__hint">{{ t('cutter.fields.specHint') }}</span>
          </label>

          <label class="ui-field">
            <span class="ui-field__label">{{ t('qc.fields.ply') }}</span>
            <select class="ui-control" name="ply" [(ngModel)]="ply">
              <option value="">—</option>
              @for (option of plies(); track option.value) {
                <option [value]="option.value">{{ option.label ?? option.value }}</option>
              }
            </select>
          </label>

          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.mainSerial') }}</span>
            <input class="ui-control mono" [value]="nextSerial() || '—'" readonly />
            <span class="ui-field__hint">{{ t('cutter.fields.serialHint') }}</span>
          </label>
        </div>

        <div class="ui-field ui-field--wide">
          <span class="ui-field__label">{{ t('cutter.fields.orders') }}</span>
          <p class="ui-field__hint">{{ t('cutter.ordersHint') }}</p>
          <div class="row">
            @for (order of orders(); track order.id) {
              <label class="row">
                <input
                  type="checkbox"
                  [checked]="orderSet().has(order.number)"
                  (change)="toggleOrder(order)"
                />
                {{ order.number }} — {{ order.specName }}
              </label>
            }
          </div>
        </div>

        @for (entry of entries(); track $index; let i = $index) {
          <fieldset class="ui-card stack">
            <div class="row row--between">
              <strong>
                {{ t('cutter.subRoll') }} #{{ i + 1 }}
                <span class="mono">— {{ t('cutter.fields.serial') }}: {{ subSerial(i) }}</span>
              </strong>
              @if (entries().length > 1) {
                <button
                  type="button"
                  class="ui-btn ui-btn--ghost"
                  (click)="removeEntry(i)"
                >
                  <ui-icon name="close" [size]="14" />
                  {{ t('common.delete') }}
                </button>
              }
            </div>
            <div class="ui-form-grid">
              <label class="ui-field">
                <span class="ui-field__label">{{ t('cutter.fields.weight') }}</span>
                <input
                  class="ui-control"
                  type="number"
                  min="1"
                  [name]="'weight' + i"
                  required
                  [(ngModel)]="entry.weightKg"
                />
              </label>
              <label class="ui-field">
                <span class="ui-field__label">{{ t('cutter.fields.gsm') }}</span>
                <input
                  class="ui-control"
                  type="number"
                  min="1"
                  [name]="'gsm' + i"
                  required
                  [(ngModel)]="entry.gsm"
                />
              </label>
              <label class="ui-field">
                <span class="ui-field__label">{{ t('cutter.fields.width') }}</span>
                <input
                  class="ui-control"
                  type="number"
                  min="1"
                  [name]="'width' + i"
                  required
                  [(ngModel)]="entry.rollWidthMm"
                />
              </label>
              <label class="ui-field">
                <span class="ui-field__label">{{ t('cutter.fields.diameter') }}</span>
                <input
                  class="ui-control"
                  type="number"
                  min="1"
                  [name]="'diameter' + i"
                  required
                  [(ngModel)]="entry.diameterMm"
                />
              </label>
              <label class="ui-field">
                <span class="ui-field__label">{{ t('cutter.fields.grade') }}</span>
                <select class="ui-control" [name]="'grade' + i" [(ngModel)]="entry.grade">
                  <option value="first">{{ t('cutter.grades.first') }}</option>
                  <option value="second">{{ t('cutter.grades.second') }}</option>
                </select>
              </label>
            </div>
          </fieldset>
        }

        <div>
          <button type="button" class="ui-btn ui-btn--ghost" (click)="addEntry()">
            <ui-icon name="plus" [size]="16" />
            {{ t('cutter.addRoll') }}
          </button>
        </div>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('common.notes') }}</span>
          <input class="ui-control" name="notes" [(ngModel)]="notes" />
        </label>

        <div class="row">
          <button class="ui-btn ui-btn--primary" type="submit" [disabled]="busy() || !isValid()">
            {{ t('common.save') }}
          </button>
          <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
            {{ t('common.back') }}
          </button>
        </div>
      </form>
    } @else {
      <section class="ui-card stack">
        <h2 class="ui-card__title">{{ t('cutter.createdTitle') }}</h2>
        <p>
          {{ t('cutter.fields.mainSerial') }}:
          <strong class="mono">{{ created()[0]?.mainSerial ?? created()[0]?.serial }}</strong>
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
              @for (roll of created(); track roll.id) {
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
                      (click)="requestPrint(roll)"
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
          <button type="button" class="ui-btn ui-btn--primary" (click)="requestPrint(null)">
            <ui-icon name="print" [size]="16" />
            {{ t('cutter.printAll') }}
          </button>
          <button type="button" class="ui-btn ui-btn--ghost" (click)="newBatch()">
            {{ t('cutter.newBatch') }}
          </button>
          <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
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
    }
  `,
})
export class RollCreatePage extends Translated implements OnInit {
  private readonly cutterApi = inject(CutterApiService);
  private readonly lookups = inject(LookupService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  private readonly document = inject(DOCUMENT);

  protected readonly specs = signal<CustomerSpec[]>([]);
  protected readonly orders = signal<ProductionOrder[]>([]);
  protected readonly orderSet = signal<Set<string>>(new Set());
  protected readonly plies = computed(() => this.lookups.options('qcPly'));
  protected readonly nextSerial = signal(0);
  protected readonly entries = signal<RollEntryForm[]>([this.blankEntry(null)]);
  protected readonly created = signal<CutterRoll[]>([]);
  /** Which rolls are rendered inside .print-area — one for solo print, all for print-all. */
  protected readonly soloPrint = signal<CutterRoll | null>(null);
  protected readonly printQueue = computed(() => {
    const solo = this.soloPrint();
    return solo ? [solo] : this.created();
  });

  protected specCode = '';
  protected ply = '';
  protected notes = '';
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.lookups.refresh();
    this.cutterApi.listSpecs().subscribe((specs) => {
      this.specs.set(specs);
      const first = specs[0];
      if (first && !this.specCode) this.applySpec(first.specCode);
    });
    this.cutterApi.listProductionOrders().subscribe((orders) => {
      // أوامر الإنتاج الجاري تصنيعها فقط (المعتمدة) — local + export alike.
      this.orders.set(
        orders.filter(
          (o) =>
            o.approvalStatus === 'approved' &&
            (o.status === 'in-progress' || o.status === 'late'),
        ),
      );
    });
    this.refreshNextSerial();
  }

  private refreshNextSerial(): void {
    this.cutterApi.nextSerial().subscribe((res) => this.nextSerial.set(res.serial));
  }

  private blankEntry(defaults: Partial<RollEntryForm> | null): RollEntryForm {
    return {
      weightKg: null,
      gsm: defaults?.gsm ?? null,
      rollWidthMm: defaults?.rollWidthMm ?? null,
      diameterMm: defaults?.diameterMm ?? null,
      grade: defaults?.grade ?? 'first',
    };
  }

  /** Serial preview for entry i: main serial first, then one per sub-roll. */
  protected subSerial(index: number): number {
    return this.nextSerial() + 1 + index;
  }

  protected applySpec(specCode: string): void {
    this.specCode = specCode;
    const spec = this.specs().find((s) => s.specCode === specCode);
    if (!spec) return;
    // Spec carries the agreed defaults — refresh every entry's GSM/width.
    this.entries.update((list) =>
      list.map((e) => ({ ...e, gsm: spec.gsm, rollWidthMm: spec.rollWidthMm })),
    );
  }

  protected toggleOrder(order: ProductionOrder): void {
    this.orderSet.update((set) => {
      const next = new Set(set);
      if (next.has(order.number)) next.delete(order.number);
      else next.add(order.number);
      return next;
    });
    // Prefill ply + spec + sizes from the first selected production order.
    const first = this.orders().find((o) => this.orderSet().has(o.number));
    if (!first) return;
    if (first.ply) this.ply = first.ply;
    if (this.specs().some((s) => s.specCode === first.specCode)) {
      this.applySpec(first.specCode);
    }
  }

  protected addEntry(): void {
    const spec = this.specs().find((s) => s.specCode === this.specCode);
    this.entries.update((list) => [
      ...list,
      this.blankEntry({ gsm: spec?.gsm ?? null, rollWidthMm: spec?.rollWidthMm ?? null }),
    ]);
  }

  protected removeEntry(index: number): void {
    this.entries.update((list) => list.filter((_, i) => i !== index));
  }

  protected isValid(): boolean {
    return (
      this.specCode.length > 0 &&
      this.entries().length > 0 &&
      this.entries().every(
        (e) =>
          (e.weightKg ?? 0) > 0 &&
          (e.gsm ?? 0) > 0 &&
          (e.rollWidthMm ?? 0) > 0 &&
          (e.diameterMm ?? 0) > 0,
      )
    );
  }

  protected async submit(): Promise<void> {
    if (!this.isValid() || this.busy() || !(await this.confirm.askSave())) return;
    this.busy.set(true);
    this.cutterApi
      .createRolls({
        specCode: this.specCode,
        ply: this.ply || undefined,
        orderNumbers: [...this.orderSet()].join(',') || undefined,
        notes: this.notes.trim() || undefined,
        entries: this.entries().map((e) => ({
          weightKg: e.weightKg ?? 0,
          gsm: e.gsm ?? 0,
          rollWidthMm: e.rollWidthMm ?? 0,
          diameterMm: e.diameterMm ?? 0,
          grade: e.grade,
        })),
      })
      .subscribe({
        next: (rolls) => {
          this.busy.set(false);
          this.created.set(rolls);
          this.notifications.success('cutter.messages.rollsCreated', [
            rolls.length,
            rolls[0]?.mainSerial ?? '',
          ]);
        },
        error: () => this.busy.set(false),
      });
  }

  /** Print one label (solo) or every label of the batch (null). */
  protected requestPrint(solo: CutterRoll | null): void {
    this.soloPrint.set(solo);
    const targets = solo ? [solo] : this.created();
    forkJoin(targets.map((r) => this.cutterApi.registerPrint(r.id))).subscribe(() => {
      setTimeout(() => {
        this.document.defaultView?.print();
        this.soloPrint.set(null);
      });
    });
  }

  protected newBatch(): void {
    this.created.set([]);
    this.entries.set([this.blankEntry(null)]);
    this.orderSet.set(new Set());
    this.notes = '';
    this.refreshNextSerial();
    const first = this.specs()[0];
    if (first) this.applySpec(first.specCode);
  }

  protected back(): void {
    void this.router.navigate(['/cutter']);
  }
}
