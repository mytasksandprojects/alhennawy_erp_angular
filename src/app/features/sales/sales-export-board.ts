import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { Customer, ExportDocStage, ExportOrder } from '../../core/models/sales.models';
import { AccessService } from '../../core/security/access.service';
import { AuthService } from '../../core/security/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiModal } from '../../shared/components/ui-modal';
import { UiRequestLines } from '../../shared/components/ui-request-lines';
import { EXPORT_NEXT, EXPORT_RANK, EXPORT_TONE, exportLines } from './sales-export.meta';

/** Export pipeline: quotation → proforma → supply order → warehouse → production → logistics → issue → invoices. */
@Component({
  selector: 'app-sales-export-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiIcon, UiModal, UiRequestLines],
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
                @if (access.canAction('sales', 'exportOrders', 'update')) {
                  <button type="button" class="ui-btn ui-btn--ghost" (click)="openEdit(row)">{{ t('common.edit') }}</button>
                }
                <ui-badge [labelKey]="'sales.stages.' + row.stage" [tone]="TONE[row.stage]" />
              </div>
            </div>
            <p class="text-faint">{{ row.customerCode }} · {{ row.customerName }}</p>
            @for (line of linesOf(row); track $index) {
              <p>{{ line.name }} · {{ fmtNum(line.qty) }} {{ t('units.kg') }}</p>
            }
            @if (row.toProduceKg != null) {
              <p>{{ t('sales.fields.available') }}: {{ fmtNum(row.availableFromStockKg || 0) }} · {{ t('sales.fields.toProduce') }}: {{ fmtNum(row.toProduceKg) }}</p>
            }
            @if (showPrice(row)) {
              <p>{{ t('sales.fields.price') }}: {{ fmtNum(row.totalUsd) }}</p>
            }
            @if (row.rollsCount) {
              <p>{{ t('sales.fields.rolls') }}: {{ fmtNum(row.rollsCount) }} · {{ t('logistics.fields.containers') }}: {{ fmtNum(row.containersCount) }}</p>
            }
            @if (row.productionDeadline) {
              <p>{{ t('sales.fields.deadline') }}: {{ fmtDate(row.productionDeadline) }}</p>
            }
            @if (row.loadingDate) {
              <p>{{ t('logistics.fields.loadingDate') }}: {{ fmtDate(row.loadingDate) }}</p>
            }
          </section>

          @if (nextOf(row); as next) {
            <section class="ui-card stack">
              @if (row.stage === 'supply-order') {
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('sales.fields.rolls') }}</span>
                  <input class="ui-control" type="number" [value]="rolls()" (input)="rolls.set(num($event))" />
                </label>
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('logistics.fields.containers') }}</span>
                  <input class="ui-control" type="number" [value]="containers()" (input)="containers.set(num($event))" />
                </label>
              }
              @if (row.stage === 'warehouse') {
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('sales.fields.deadline') }}</span>
                  <input class="ui-control" type="date" [value]="deadline()" (input)="deadline.set($any($event.target).value)" />
                </label>
              }
              @if (row.stage === 'production-scheduled') {
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('logistics.fields.loadingDate') }}</span>
                  <input class="ui-control" type="date" [value]="loading()" (input)="loading.set($any($event.target).value)" />
                </label>
              }
              <button type="button" class="ui-btn ui-btn--primary" (click)="advance()">
                {{ t('sales.stages.' + next) }}
              </button>
            </section>
          }
        </div>
      }
    </div>
    @if (open()) {
      <ui-modal [titleKey]="editingId() ? 'common.edit' : 'common.create'" (closed)="closeForm()">
        <div class="stack">
          <label class="ui-field">
            <span class="ui-field__label">{{ t('sales.fields.customer') }}</span>
            <select class="ui-control" [value]="newCustomer()" (change)="newCustomer.set($any($event.target).value)">
              <option value="">{{ t('common.search') }}</option>
              @for (customer of customers(); track customer.code) {
                <option [value]="customer.code">{{ customer.code }} · {{ customer.name }}</option>
              }
            </select>
          </label>
          <ui-request-lines [value]="newLines()" unitKey="units.kg" (valueChange)="newLines.set($event)" />
          @if (canPrice()) {
            <label class="ui-field">
              <span class="ui-field__label">{{ t('sales.fields.price') }}</span>
              <input class="ui-control" type="number" [value]="newPrice()" (input)="newPrice.set(num($event))" />
            </label>
          }
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

  protected readonly TONE = EXPORT_TONE;
  protected readonly open = signal(false);
  protected readonly editingId = signal('');
  protected readonly rows = signal<ExportOrder[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly selectedId = signal('');
  protected readonly stageFilter = signal('');
  protected readonly rolls = signal(0);
  protected readonly containers = signal(0);
  protected readonly deadline = signal('');
  protected readonly loading = signal('');
  protected readonly newCustomer = signal('');
  protected readonly newLines = signal('');
  protected readonly newPrice = signal(0);

  protected readonly queue = computed(() => {
    const stage = this.stageFilter();
    return [...this.rows()]
      .filter((row) => !stage || row.stage === stage)
      .sort((a, b) => EXPORT_RANK[a.stage] - EXPORT_RANK[b.stage]);
  });
  protected readonly current = computed(() => this.rows().find((row) => row.id === this.selectedId()) ?? null);

  constructor() {
    super();
    this.route.queryParamMap.subscribe((params) => this.stageFilter.set(params.get('status') ?? ''));
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

  protected linesOf(row: ExportOrder): { name: string; qty: number }[] {
    return exportLines(row);
  }

  protected openCreate(): void {
    this.editingId.set('');
    this.newCustomer.set('');
    this.newLines.set('');
    this.newPrice.set(0);
    this.open.set(true);
  }

  protected openEdit(row: ExportOrder): void {
    this.editingId.set(row.id);
    this.newCustomer.set(row.customerCode);
    this.newLines.set(row.linesJson || '');
    this.newPrice.set(row.totalUsd || 0);
    this.open.set(true);
  }

  protected closeForm(): void {
    this.open.set(false);
    this.editingId.set('');
    this.newCustomer.set('');
    this.newLines.set('');
    this.newPrice.set(0);
  }

  protected num(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  protected async advance(): Promise<void> {
    const row = this.current();
    if (!row || !(await this.confirm.askSave())) return;
    this.api
      .post(API_ENDPOINTS.sales.advanceExport(row.id), {
        rollsCount: this.rolls(),
        containersCount: this.containers(),
        productionDeadline: this.deadline(),
        loadingDate: this.loading(),
      })
      .subscribe(() => {
        this.notify.success('common.updated');
        this.reload();
      });
  }

  protected async saveOrder(): Promise<void> {
    if (!this.newCustomer() || !this.newLines() || this.newLines() === '[]') return;
    if (!(await this.confirm.askSave())) return;
    const id = this.editingId();
    const body = { customerCode: this.newCustomer(), linesJson: this.newLines(), totalUsd: this.newPrice() };
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
    }).subscribe((pack) => {
      this.rows.set(pack.rows.map((row) => ({ ...row })));
      this.customers.set(pack.customers.map((row) => ({ ...row })));
      const first = this.queue()[0];
      if (first && !this.queue().some((row) => row.id === this.selectedId())) this.selectedId.set(first.id);
    });
  }
}
