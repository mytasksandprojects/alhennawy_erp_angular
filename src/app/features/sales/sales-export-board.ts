import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { CutterRoll } from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { Customer, ExportOrder, SalesSettings } from '../../core/models/sales.models';
import { AccessService } from '../../core/security/access.service';
import { AuthService } from '../../core/security/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPrintDoc } from '../../shared/components/ui-print-doc';
import { ExportOrderCard } from './export-order-card';
import { ExportOrderForm } from './export-order-form';
import { ExportStagePanel } from './export-stage-panel';
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
  imports: [UiBadge, UiIcon, UiPrintDoc, ExportOrderCard, ExportOrderForm, ExportStagePanel],
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
          <app-export-order-card
            [row]="row"
            [lines]="exportLines(row)"
            [showPrice]="showPrice(row)"
            [canUpdate]="access.canAction('sales', 'exportOrders', 'update')"
            (edit)="openEdit(row)"
          />
          <app-export-stage-panel
            [row]="row"
            [lines]="exportLines(row)"
            [termsText]="settings()?.termsConditions || ''"
            [next]="nextOf(row)"
            [trial]="trial"
            [lineRolls]="lineRolls"
            [containers]="containers"
            [deadline]="deadline"
            [loading]="loading"
            [requestedLoading]="requestedLoading"
            [rolls]="rolls()"
            [productionOrders]="productionOrders()"
            (advanceStage)="advance()"
            (decide)="decideProforma($event)"
            (printDoc)="print(row, $event)"
            (requestLoading)="requestLoading()"
          />
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
    <app-export-order-form
      [open]="open"
      [editingId]="editingId"
      [newCustomer]="newCustomer"
      [newLines]="newLines"
      [customers]="exportCustomers()"
      (saved)="onSaved($event)"
    />
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
  protected readonly exportLines = exportLines;
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

  protected nextOf(row: ExportOrder) {
    return EXPORT_NEXT[row.stage];
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

  protected onSaved(row: ExportOrder): void {
    this.selectedId.set(row.id);
    this.reload();
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
