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

const NEXT: Record<ExportDocStage, ExportDocStage | null> = {
  quotation: 'proforma',
  'internal-approval': 'proforma',
  proforma: 'supply-order',
  'supply-order': 'warehouse',
  warehouse: 'production-scheduled',
  'production-scheduled': 'logistics',
  logistics: 'production',
  production: 'issued',
  issued: 'invoiced',
  invoiced: null,
};

const TONE: Record<ExportDocStage, 'neutral' | 'info' | 'warning' | 'success'> = {
  quotation: 'neutral',
  'internal-approval': 'info',
  proforma: 'info',
  'supply-order': 'info',
  warehouse: 'warning',
  'production-scheduled': 'warning',
  logistics: 'warning',
  production: 'warning',
  issued: 'success',
  invoiced: 'success',
};

const RANK: Record<ExportDocStage, number> = {
  quotation: 0,
  'internal-approval': 1,
  proforma: 2,
  'supply-order': 3,
  warehouse: 4,
  'production-scheduled': 5,
  logistics: 6,
  production: 7,
  issued: 8,
  invoiced: 9,
};

/** Export pipeline: quotation → proforma → supply order → warehouse → production → logistics → issue → invoices. */
@Component({
  selector: 'app-sales-export-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiIcon, UiModal],
  template: `
    <div class="row token-toolbar">
      <div class="row token-toolbar__actions">
        @if (access.canAction('sales', 'exportOrders', 'create')) {
          <button type="button" class="ui-btn ui-btn--primary" (click)="open.set(true)">
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
              <ui-badge [labelKey]="'sales.stages.' + row.stage" [tone]="TONE[row.stage]" />
            </div>
            <p class="text-faint">{{ row.customerCode }} · {{ row.customerName }}</p>
            <p>{{ row.itemName }} · {{ fmtNum(row.quantityKg) }} {{ t('units.kg') }}</p>
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
      <ui-modal titleKey="common.create" (closed)="open.set(false)">
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
          <label class="ui-field">
            <span class="ui-field__label">{{ t('weighbridge.fields.item') }}</span>
            <input class="ui-control" [value]="newItem()" (input)="newItem.set($any($event.target).value)" />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('common.quantity') }}</span>
            <input class="ui-control" type="number" [value]="newQty()" (input)="newQty.set(num($event))" />
          </label>
          @if (canPrice()) {
            <label class="ui-field">
              <span class="ui-field__label">{{ t('sales.fields.price') }}</span>
              <input class="ui-control" type="number" [value]="newPrice()" (input)="newPrice.set(num($event))" />
            </label>
          }
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="createOrder()">{{ t('common.save') }}</button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="open.set(false)">{{ t('common.cancel') }}</button>
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

  protected readonly TONE = TONE;
  protected readonly open = signal(false);
  protected readonly rows = signal<ExportOrder[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly selectedId = signal('');
  protected readonly stageFilter = signal('');
  protected readonly rolls = signal(0);
  protected readonly containers = signal(0);
  protected readonly deadline = signal('');
  protected readonly loading = signal('');
  protected readonly newCustomer = signal('');
  protected readonly newItem = signal('');
  protected readonly newQty = signal(0);
  protected readonly newPrice = signal(0);

  protected readonly queue = computed(() => {
    const stage = this.stageFilter();
    return [...this.rows()]
      .filter((row) => !stage || row.stage === stage)
      .sort((a, b) => RANK[a.stage] - RANK[b.stage]);
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
    return NEXT[row.stage];
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

  protected async createOrder(): Promise<void> {
    if (!this.newCustomer() || !this.newItem() || this.newQty() <= 0) return;
    if (!(await this.confirm.askSave())) return;
    this.api
      .post<ExportOrder>(API_ENDPOINTS.sales.exportOrders, {
        customerCode: this.newCustomer(),
        itemName: this.newItem(),
        quantityKg: this.newQty(),
        totalUsd: this.newPrice(),
      })
      .subscribe((row) => {
        this.notify.success('common.created');
        this.open.set(false);
        this.selectedId.set(row.id);
        this.reload();
      });
  }

  private reload(): void {
    forkJoin({
      rows: this.api.get<ExportOrder[]>(API_ENDPOINTS.sales.exportOrders),
      customers: this.api.get<Customer[]>(API_ENDPOINTS.sales.customers),
    }).subscribe((pack) => {
      this.rows.set(pack.rows);
      this.customers.set(pack.customers);
      const first = this.queue()[0];
      if (first && !this.queue().some((row) => row.id === this.selectedId())) this.selectedId.set(first.id);
    });
  }
}
