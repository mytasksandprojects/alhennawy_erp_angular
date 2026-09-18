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
import { CustomerSpec, CutterRoll } from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { Translated } from '../../shared/translated.base';
import { CutterApiService } from './cutter-api.service';
import { RollCreatedPanel } from './roll-created-panel';
import { RollEntriesEditor, RollEntryForm, blankRollEntry } from './roll-entries-editor';

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
  imports: [FormsModule, UiPageHeader, RollEntriesEditor, RollCreatedPanel],
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

        <app-roll-entries-editor
          [entries]="entries"
          [nextSerial]="nextSerial()"
          [spec]="currentSpec()"
        />

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
      <app-roll-created-panel
        [rolls]="created()"
        [printQueue]="printQueue()"
        (printOne)="requestPrint($event)"
        (newBatch)="newBatch()"
        (back)="back()"
      />
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
  protected readonly entries = signal<RollEntryForm[]>([blankRollEntry(null)]);
  protected readonly created = signal<CutterRoll[]>([]);
  protected readonly soloPrint = signal<CutterRoll | null>(null);
  protected readonly printQueue = computed(() => {
    const solo = this.soloPrint();
    return solo ? [solo] : this.created();
  });
  protected readonly currentSpec = computed(
    () => this.specs().find((s) => s.specCode === this.specCode) ?? null,
  );
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
    this.entries.set([blankRollEntry(null)]);
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
