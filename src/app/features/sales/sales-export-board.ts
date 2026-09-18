import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { CutterRoll } from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import {
  Customer,
  ExportDocStage,
  ExportOrder,
  SalesOrderLine,
  SalesSettings,
} from '../../core/models/sales.models';
import { AccessService } from '../../core/security/access.service';
import { AuthService } from '../../core/security/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiModal } from '../../shared/components/ui-modal';
import { UiPrintDoc } from '../../shared/components/ui-print-doc';
import { UiSalesLines } from '../../shared/components/ui-sales-lines';
import { EXPORT_NEXT, EXPORT_RANK, EXPORT_TONE, exportLines } from './sales-export.meta';
import { EXPORT_ORDER_COLUMNS } from './sales.columns';

/**
 * Export pipeline: quotation → proforma (approved + printable) → supply
 * order → warehouse (rolls per size) → production (approved in الإنتاج)
 * → logistics (loading date after production) → issued → invoices.
 */
@Component({
  selector: 'app-sales-export-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiIcon, UiModal, UiPrintDoc, UiSalesLines],
  template: `
    <div class="row token-toolbar">
      <div class="row token-toolbar__actions">
        @if (access.canAction('sales', 'exportOrders', 'create')) {
          <button type="button" class="ui-btn ui-btn--primary" (click)="openCreate()">
            <ui-icon name="plus" [size]="16" />
            {{ t('common.create') }}
          </button>
        }
      </div>
    </div>
    <div class="purchase-board">
      <section class="ui-card ui-card--list">
        <h2 class="ui-card__title">{{ t('sales.tabs.exportOrders') }}</h2>
        <div class="stack purchase-board__queue">
          @for (row of queue(); track row.id) {
            <button type="button" class="purchase-board__item" [class.is-on]="row.id === selectedId()" (click)="selectedId.set(row.id)">
              <span class="row row--between">
                <strong>{{ row.number }}</strong>
                <ui-badge [labelKey]="'sales.stages.' + row.stage" [tone]="TONE[row.stage]" />
              </span>
              <span class="text-faint">{{ row.customerCode }} · {{ row.customerName }}</span>
              <span>{{ row.itemName }}</span>
            </button>
          } @empty {
            <p class="ui-field__hint">{{ t('common.empty') }}</p>
          }
        </div>
      </section>

      @if (current(); as row) {
        <div class="stack">
          <section class="ui-card stack">
            <div class="row row--between">
              <h2 class="ui-card__title">{{ row.number }}</h2>
              <div class="row">
                @if (row.trialOrder) {
                  <ui-badge [labelKey]="'sales.fields.trialOrder'" tone="info" />
                }
                @if (access.canAction('sales', 'exportOrders', 'update')) {
                  <button type="button" class="ui-btn ui-btn--ghost" (click)="openEdit(row)">{{ t('common.edit') }}</button>
                }
                <ui-badge [labelKey]="'sales.stages.' + row.stage" [tone]="TONE[row.stage]" />
              </div>
            </div>
            <p class="text-faint">{{ row.customerCode }} · {{ row.customerName }}</p>
            @for (line of linesOf(row); track $index) {
              <p>
                {{ line.itemName }}
                <span class="text-faint">
                  {{ t('qc.fields.ply') }} {{ line.ply || '—' }} · {{ colorOf(line) }} ·
                  {{ fmtNum(line.widthMm || 0) }} mm · {{ fmtNum(line.gsm || 0) }} {{ t('cutter.label.gsm') }} ·
                  {{ fmtNum(line.quantity || 0) }} {{ t('units.kg') }} × {{ fmtNum(line.pricePerKg || 0) }}
                  = {{ fmtNum(lineTotal(line)) }}
                </span>
                @if (line.rolls) {
                  <span class="text-faint">· {{ t('sales.fields.rolls') }}: {{ fmtNum(line.rolls) }}</span>
                }
              </p>
            }
            @if (row.toProduceKg != null) {
              <p>{{ t('sales.fields.available') }}: {{ fmtNum(row.availableFromStockKg || 0) }} · {{ t('sales.fields.toProduce') }}: {{ fmtNum(row.toProduceKg) }}</p>
            }
            @if (showPrice(row)) {
              <p>{{ t('sales.fields.totalPrice') }}: {{ fmtNum(row.totalUsd) }}</p>
            }
            @if (row.rollsCount) {
              <p>{{ t('sales.fields.rolls') }}: {{ fmtNum(row.rollsCount) }} · {{ t('logistics.fields.containers') }}: {{ fmtNum(row.containersCount) }}</p>
            }
            @if (row.proformaStatus) {
              <p>
                {{ t('sales.fields.proformaStatus') }}:
                <ui-badge [labelKey]="'sales.proforma.' + row.proformaStatus" [tone]="proformaTone(row)" />
              </p>
            }
            @if (row.productionDeadline) {
              <p>{{ t('sales.fields.deadline') }}: {{ fmtDate(row.productionDeadline) }}</p>
            }
            @if (row.productionDate) {
              <p>{{ t('sales.fields.productionDate') }}: {{ fmtDate(row.productionDate) }}</p>
            }
            @if (row.loadingDate) {
              <p>{{ t('logistics.fields.loadingDate') }}: {{ fmtDate(row.loadingDate) }}</p>
            }
            @if (row.loadingRequestStatus) {
              <p>
                {{ t('sales.fields.loadingRequest') }}: {{ fmtDate(row.requestedLoadingDate || '') }}
                <ui-badge [labelKey]="'sales.requestStatus.' + row.loadingRequestStatus" [tone]="requestTone(row)" />
              </p>
            }
          </section>

          @if (row.stage === 'quotation' || row.stage === 'internal-approval') {
            <section class="ui-card stack">
              <label class="row">
                <input
                  type="checkbox"
                  [checked]="trial()"
                  (change)="trial.set(!trial())"
                />
                {{ t('sales.fields.trialOrder') }}
              </label>
              <p class="ui-field__hint">{{ t('sales.hints.trialOrder') }}</p>
              <div class="ui-field">
                <span class="ui-field__label">{{ t('sales.fields.terms') }}</span>
                <p class="ui-field__hint">{{ settings()?.termsConditions || '—' }}</p>
              </div>
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.actions.issueProforma') }}
              </button>
            </section>
          }

          @if (row.stage === 'proforma') {
            <section class="ui-card stack">
              @if (row.proformaStatus !== 'approved') {
                <p class="ui-field__hint">{{ t('sales.hints.proformaGate') }}</p>
                <div class="row">
                  <button type="button" class="ui-btn ui-btn--primary" (click)="decideProforma('approved')">
                    {{ t('common.approve') }}
                  </button>
                  <button type="button" class="ui-btn ui-btn--danger" (click)="decideProforma('rejected')">
                    {{ t('common.reject') }}
                  </button>
                </div>
              } @else {
                <div class="row">
                  <button type="button" class="ui-btn ui-btn--ghost" (click)="print(row, false)">
                    <ui-icon name="print" [size]="16" [brand]="true" />
                    {{ t('sales.actions.printProforma') }}
                  </button>
                  <button type="button" class="ui-btn ui-btn--ghost" (click)="print(row, true)">
                    <ui-icon name="pdf" [size]="16" />
                    {{ t('common.exportPdf') }}
                  </button>
                  <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                    {{ t('sales.stages.supply-order') }}
                  </button>
                </div>
              }
            </section>
          }

          @if (row.stage === 'supply-order') {
            <section class="ui-card stack">
              <p class="ui-field__hint">{{ t('sales.hints.rolls') }}</p>
              @for (line of linesOf(row); track $index) {
                <div class="row">
                  <label class="ui-field">
                    <span class="ui-field__label">
                      {{ line.itemName }} — {{ t('sales.fields.rolls') }}
                    </span>
                    <input
                      class="ui-control"
                      type="number"
                      [value]="lineRolls()[$index] || 0"
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
                <input class="ui-control" type="number" [value]="containers()" (input)="containers.set(num($event))" />
              </label>
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.stages.warehouse') }}
              </button>
            </section>
          }

          @if (row.stage === 'warehouse') {
            <section class="ui-card stack">
              <label class="ui-field">
                <span class="ui-field__label">{{ t('sales.fields.deadline') }}</span>
                <input class="ui-control" type="date" [value]="deadline()" (input)="deadline.set($any($event.target).value)" />
              </label>
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.stages.production-scheduled') }}
              </button>
            </section>
          }

          @if (row.stage === 'production-scheduled') {
            <section class="ui-card stack">
              @if (!linkedApproved(row)) {
                <p class="ui-field__hint">{{ t('sales.hints.waitingApproval') }}</p>
              }
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.stages.production') }}
              </button>
            </section>
          }

          @if (row.stage === 'production') {
            <section class="ui-card stack">
              <p class="ui-field__hint">{{ t('sales.hints.logisticsDate') }}</p>
              <label class="ui-field">
                <span class="ui-field__label">{{ t('logistics.fields.loadingDate') }}</span>
                <input
                  class="ui-control"
                  type="date"
                  [min]="(row.productionDate || '').slice(0, 10)"
                  [value]="loading()"
                  (input)="loading.set($any($event.target).value)"
                />
              </label>
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.stages.logistics') }}
              </button>
            </section>
          }

          @if (row.stage === 'logistics' || row.stage === 'issued') {
            <section class="ui-card stack">
              @if (row.stage === 'logistics') {
                <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                  {{ t('sales.stages.issued') }}
                </button>
              } @else if (nextOf(row); as next) {
                <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                  {{ t('sales.stages.' + next) }}
                </button>
              }
              @if (row.loadingDate && row.loadingRequestStatus !== 'pending') {
                <div class="row">
                  <label class="ui-field">
                    <span class="ui-field__label">{{ t('sales.fields.requestedLoadingDate') }}</span>
                    <input
                      class="ui-control"
                      type="date"
                      [min]="(row.productionDate || '').slice(0, 10)"
                      [value]="requestedLoading()"
                      (input)="requestedLoading.set($any($event.target).value)"
                    />
                  </label>
                  <button type="button" class="ui-btn ui-btn--ghost" (click)="requestLoading()">
                    {{ t('sales.actions.requestLoading') }}
                  </button>
                </div>
                <p class="ui-field__hint">{{ t('sales.hints.reschedule') }}</p>
              }
            </section>
          }

        </div>
      }
    </div>
    @if (printing(); as doc) {
      <ui-print-doc
        [row]="doc"
        [columns]="printColumns"
        titleKey="sales.stages.proforma"
        [notes]="printNotes()"
      />
    }
    @if (open()) {
      <ui-modal [titleKey]="editingId() ? 'common.edit' : 'common.create'" (closed)="closeForm()">
        <div class="stack">
          <label class="ui-field">
            <span class="ui-field__label">{{ t('sales.fields.customer') }}</span>
            <select class="ui-control" [value]="newCustomer()" (change)="newCustomer.set($any($event.target).value)">
              <option value="">{{ t('common.search') }}</option>
              @for (customer of exportCustomers(); track customer.code) {
                <option [value]="customer.code">{{ customer.code }} · {{ customer.name }}</option>
              }
            </select>
          </label>
          <ui-sales-lines [value]="newLines()" unitKey="units.kg" (valueChange)="newLines.set($event)" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="saveOrder()">{{ t('common.save') }}</button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="closeForm()">{{ t('common.cancel') }}</button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class SalesExportBoard extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly auth = inject(AuthService);
  protected readonly access = inject(AccessService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);

  protected readonly TONE = EXPORT_TONE;
  protected readonly printColumns = EXPORT_ORDER_COLUMNS;
  protected readonly open = signal(false);
  protected readonly editingId = signal('');
  protected readonly rows = signal<ExportOrder[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly productionOrders = signal<ProductionOrder[]>([]);
  protected readonly rolls = signal<CutterRoll[]>([]);
  protected readonly settings = signal<SalesSettings | null>(null);
  protected readonly selectedId = signal('');
  protected readonly stageFilter = signal('');
  protected readonly printing = signal<Record<string, unknown> | null>(null);
  protected readonly trial = signal(false);
  protected readonly lineRolls = signal<number[]>([]);
  protected readonly containers = signal(0);
  protected readonly deadline = signal('');
  protected readonly loading = signal('');
  protected readonly requestedLoading = signal('');
  protected readonly newCustomer = signal('');
  protected readonly newLines = signal('');

  protected readonly queue = computed(() => {
    const stage = this.stageFilter();
    return [...this.rows()]
      .filter((row) => !stage || row.stage === stage)
      .sort((a, b) => EXPORT_RANK[a.stage] - EXPORT_RANK[b.stage]);
  });
  protected readonly current = computed(() => this.rows().find((row) => row.id === this.selectedId()) ?? null);
  protected readonly exportCustomers = computed(() =>
    this.customers().filter((row) => row.channel === 'export'),
  );

  constructor() {
    super();
    this.route.queryParamMap.subscribe((params) => this.stageFilter.set(params.get('status') ?? ''));
    this.document.defaultView?.addEventListener('afterprint', () => {
      this.printing.set(null);
      this.document.body.classList.remove('is-print-row');
    });
    this.reload();
  }

  protected canPrice(): boolean {
    return this.auth.hasPermission('finance.viewPrices');
  }

  protected showPrice(row: ExportOrder): boolean {
    return this.canPrice() || row.stage === 'quotation' || row.stage === 'proforma' || row.stage === 'internal-approval';
  }

  protected nextOf(row: ExportOrder): ExportDocStage | null {
    return EXPORT_NEXT[row.stage];
  }

  protected linesOf(row: ExportOrder): SalesOrderLine[] {
    return exportLines(row);
  }

  protected lineTotal(line: SalesOrderLine): number {
    return Number(line.quantity || 0) * Number(line.pricePerKg || 0);
  }

  protected colorOf(line: SalesOrderLine): string {
    const color = String(line.color || '');
    return this.t(color) || color || '—';
  }

  protected proformaTone(row: ExportOrder): 'warning' | 'success' | 'danger' | 'neutral' {
    return row.proformaStatus === 'approved'
      ? 'success'
      : row.proformaStatus === 'rejected'
        ? 'danger'
        : 'warning';
  }

  protected requestTone(row: ExportOrder): 'warning' | 'success' | 'danger' | 'neutral' {
    return row.loadingRequestStatus === 'approved'
      ? 'success'
      : row.loadingRequestStatus === 'rejected'
        ? 'danger'
        : 'warning';
  }

  /** Rolls on hand matching the line's item/spec — shown read-only. */
  protected availableRolls(line: SalesOrderLine): number {
    return this.rolls().filter(
      (roll) =>
        roll.specName === line.itemName ||
        (!!line.gsm && !!line.widthMm && roll.gsm === line.gsm && roll.rollWidthMm === line.widthMm),
    ).length;
  }

  /** The linked production order must be approved before production starts. */
  protected linkedApproved(row: ExportOrder): boolean {
    const order = this.productionOrders().find(
      (item) => item.id === row.productionOrderId || item.workOrderNumber === row.number,
    );
    return !!order && order.approvalStatus === 'approved';
  }

  protected printNotes(): { labelKey: string; text: string }[] {
    const settings = this.settings();
    if (!settings) return [];
    return [
      { labelKey: 'sales.settings.terms', text: settings.termsConditions },
      { labelKey: 'sales.settings.bankInfo', text: settings.bankInfo },
      { labelKey: 'sales.settings.paymentOptions', text: settings.paymentOptions },
    ].filter((note) => !!note.text);
  }

  protected setLineRoll(index: number, value: number): void {
    this.lineRolls.update((rolls) => rolls.map((roll, i) => (i === index ? value : roll)));
  }

  protected openCreate(): void {
    this.editingId.set('');
    this.newCustomer.set('');
    this.newLines.set('');
    this.open.set(true);
  }

  protected openEdit(row: ExportOrder): void {
    this.editingId.set(row.id);
    this.newCustomer.set(row.customerCode);
    this.newLines.set(row.linesJson || '');
    this.open.set(true);
  }

  protected closeForm(): void {
    this.open.set(false);
    this.editingId.set('');
    this.newCustomer.set('');
    this.newLines.set('');
  }

  protected num(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  protected print(row: ExportOrder, asPdf: boolean): void {
    if (asPdf) this.notify.info('common.pdfHint');
    this.printing.set({
      ...row,
      number: row.number,
      customerCode: row.customerCode,
      customerName: row.customerName,
      date: new Date().toISOString(),
      currency: 'USD',
      total: row.totalUsd || 0,
      collected: 0,
    });
    this.document.body.classList.add('is-print-row');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.document.defaultView?.print()),
    );
  }

  protected async decideProforma(decision: 'approved' | 'rejected'): Promise<void> {
    const row = this.current();
    if (!row || !(await this.confirm.askSave())) return;
    this.api
      .post(API_ENDPOINTS.sales.proformaDecision(row.id), { decision })
      .subscribe(() => {
        this.notify.success('common.updated');
        this.reload();
      });
  }

  protected async requestLoading(): Promise<void> {
    const row = this.current();
    const requestedDate = this.requestedLoading();
    if (!row || !requestedDate || !(await this.confirm.askSave())) return;
    this.api
      .post(API_ENDPOINTS.sales.loadingRequest(row.id), { requestedDate })
      .subscribe(() => {
        this.notify.success('common.updated');
        this.requestedLoading.set('');
        this.reload();
      });
  }

  protected async advance(): Promise<void> {
    const row = this.current();
    if (!row || !(await this.confirm.askSave())) return;
    this.api
      .post(API_ENDPOINTS.sales.advanceExport(row.id), {
        trialOrder: this.trial(),
        lineRolls: this.lineRolls(),
        containersCount: this.containers(),
        productionDeadline: this.deadline(),
        loadingDate: this.loading(),
      })
      .subscribe({
        next: () => {
          this.notify.success('common.updated');
          this.reload();
        },
        error: () => this.notify.error('errors.server'),
      });
  }

  protected async saveOrder(): Promise<void> {
    if (!this.newCustomer() || !this.newLines() || this.newLines() === '[]') return;
    if (!(await this.confirm.askSave())) return;
    const id = this.editingId();
    const body = { customerCode: this.newCustomer(), linesJson: this.newLines() };
    const req = id
      ? this.api.put<ExportOrder>(`${API_ENDPOINTS.sales.exportOrders}/${id}`, body)
      : this.api.post<ExportOrder>(API_ENDPOINTS.sales.exportOrders, body);
    req.subscribe((row) => {
      this.notify.success(id ? 'common.updated' : 'common.created');
      this.closeForm();
      this.selectedId.set(row.id);
      this.reload();
    });
  }

  private reload(): void {
    forkJoin({
      rows: this.api.get<ExportOrder[]>(API_ENDPOINTS.sales.exportOrders),
      customers: this.api.get<Customer[]>(API_ENDPOINTS.sales.customers),
      productionOrders: this.api.get<ProductionOrder[]>(API_ENDPOINTS.production.orders),
      rolls: this.api.get<CutterRoll[]>(API_ENDPOINTS.cutter.rolls),
      settings: this.api.get<SalesSettings>(API_ENDPOINTS.sales.settings),
    }).subscribe((pack) => {
      this.rows.set(pack.rows.map((row) => ({ ...row })));
      this.customers.set(pack.customers.map((row) => ({ ...row })));
      this.productionOrders.set(pack.productionOrders.map((row) => ({ ...row })));
      this.rolls.set(pack.rolls.map((row) => ({ ...row })));
      this.settings.set(pack.settings);
      const first = this.queue()[0];
      if (first && !this.queue().some((row) => row.id === this.selectedId())) this.selectedId.set(first.id);
      const current = this.current();
      if (current) {
        this.trial.set(!!current.trialOrder);
        this.lineRolls.set(exportLines(current).map((line) => Number(line.rolls || 0)));
        this.containers.set(Number(current.containersCount || 0));
      }
    });
  }
}
