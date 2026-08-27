import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { PurchaseRequest, PurchaseRequestStatus, Supplier, SupplierQuotation } from '../../core/models/purchasing.models';
import { ConfirmService } from '../../core/services/confirm.service';
import { LookupService } from '../../core/services/lookup.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';

const RANK: Record<PurchaseRequestStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
  ordered: 3,
};

const TONE: Record<PurchaseRequestStatus, 'warning' | 'success' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  ordered: 'info',
};

/** Purchasing reviews department PRs, attaches supplier offers, then issues a PO. */
@Component({
  selector: 'app-purchasing-request-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge],
  template: `
    <div class="purchase-board">
      <section class="ui-card ui-card--list">
        <h2 class="ui-card__title">{{ t('purchasing.tabs.requests') }}</h2>
        <div class="stack purchase-board__queue">
          @for (row of queue(); track row.id) {
            <button
              type="button"
              class="purchase-board__item"
              [class.is-on]="row.id === selectedId()"
              (click)="selectedId.set(row.id)"
            >
              <span class="row row--between">
                <strong>{{ row.number }}</strong>
                <ui-badge [labelKey]="'purchasing.requestStatus.' + row.status" [tone]="TONE[row.status]" />
              </span>
              <span class="text-faint">{{ t(row.requestingDepartmentKey) }}</span>
              <span>{{ row.itemName }}</span>
            </button>
          } @empty {
            <p class="ui-field__hint">{{ t('common.empty') }}</p>
          }
        </div>
      </section>

      @if (current(); as req) {
        <div class="stack">
          <section class="ui-card stack">
            <div class="row row--between">
              <h2 class="ui-card__title">{{ req.number }}</h2>
              <ui-badge [labelKey]="'purchasing.requestStatus.' + req.status" [tone]="TONE[req.status]" />
            </div>
            <p class="text-faint">{{ t(req.requestingDepartmentKey) }} · {{ fmtDate(req.date) }}</p>
            <div class="ui-table-wrap">
              <table class="ui-table">
                <thead>
                  <tr>
                    <th>{{ t('warehouse.tabs.items') }}</th>
                    <th class="cell--number">{{ t('common.quantity') }}</th>
                    <th>{{ t('common.notes') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (line of req.lines; track $index) {
                    <tr>
                      <td>{{ line.itemName }}</td>
                      <td class="cell--number">{{ fmtNum(line.quantity) }} {{ t(line.unitKey) }}</td>
                      <td>{{ line.specification }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (req.status === 'pending') {
              <button type="button" class="ui-btn ui-btn--primary" (click)="approve()">
                {{ t('purchasing.actions.approve') }}
              </button>
            }
          </section>

          <section class="ui-card stack">
            <h2 class="ui-card__title">{{ t('purchasing.tabs.quotations') }}</h2>
            <div class="ui-table-wrap">
              <table class="ui-table">
                <thead>
                  <tr>
                    <th>{{ t('purchasing.fields.supplier') }}</th>
                    <th class="cell--number">{{ t('common.value') }}</th>
                    <th class="cell--center">{{ t('common.currency') }}</th>
                    <th class="cell--number">{{ t('purchasing.fields.deliveryDays') }}</th>
                    <th class="cell--number">{{ t('purchasing.fields.technicalScore') }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (quote of offers(); track quote.id) {
                    <tr [class.purchase-board__pick]="quote.selected">
                      <td>{{ locName(quote.supplierCode, quote.supplierName) }}</td>
                      <td class="cell--number">{{ fmtNum(quote.totalValue) }}</td>
                      <td class="cell--center">{{ quote.currency }}</td>
                      <td class="cell--number">{{ fmtNum(quote.deliveryDays) }}</td>
                      <td class="cell--number">{{ fmtNum(quote.technicalScore) }}</td>
                      <td>
                        @if (openWork(req) && !quote.selected) {
                          <button type="button" class="ui-btn ui-btn--ghost" (click)="select(quote.id)">
                            {{ t('purchasing.fields.selected') }}
                          </button>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6"><p class="ui-field__hint">{{ t('common.empty') }}</p></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (openWork(req)) {
              <div class="purchase-board__form">
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('purchasing.fields.supplier') }}</span>
                  <select class="ui-control" [value]="supplierCode()" (change)="onSupplier($event)">
                    <option value="">{{ t('common.search') }}</option>
                    @for (supplier of suppliers(); track supplier.code) {
                      <option [value]="supplier.code">{{ locName(supplier.code, supplier.name) }}</option>
                    }
                  </select>
                </label>
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('common.value') }}</span>
                  <input class="ui-control" type="number" [value]="amount()" (input)="amount.set(num($event))" />
                </label>
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('purchasing.fields.deliveryDays') }}</span>
                  <input class="ui-control" type="number" [value]="days()" (input)="days.set(num($event))" />
                </label>
                <label class="ui-field">
                  <span class="ui-field__label">{{ t('purchasing.fields.technicalScore') }}</span>
                  <input class="ui-control" type="number" [value]="score()" (input)="score.set(num($event))" />
                </label>
                <button type="button" class="ui-btn ui-btn--primary" (click)="addOffer()">
                  {{ t('purchasing.actions.addOffer') }}
                </button>
              </div>
            }

            @if (openWork(req) && winner()) {
              <button type="button" class="ui-btn ui-btn--primary" (click)="issue()">
                {{ t('purchasing.actions.issueOrder') }}
              </button>
            }
          </section>
        </div>
      }
    </div>
  `,
})
export class PurchasingRequestBoard extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly confirm = inject(ConfirmService);
  private readonly lookups = inject(LookupService);
  private readonly notify = inject(NotificationService);
  private readonly store = inject(RuntimeConfigStore);

  protected readonly TONE = TONE;
  protected readonly requests = signal<PurchaseRequest[]>([]);
  protected readonly quotations = signal<SupplierQuotation[]>([]);
  protected readonly suppliers = signal<Supplier[]>([]);
  protected readonly selectedId = signal('');
  protected readonly supplierCode = signal('');
  protected readonly amount = signal(0);
  protected readonly days = signal(7);
  protected readonly score = signal(80);

  protected readonly queue = computed(() =>
    [...this.requests()].sort((a, b) => RANK[a.status] - RANK[b.status] || b.date.localeCompare(a.date)),
  );
  protected readonly current = computed(() => this.requests().find((row) => row.id === this.selectedId()) ?? null);
  protected readonly offers = computed(() => this.quotations().filter((row) => row.requestId === this.selectedId()));
  protected readonly winner = computed(() => this.offers().find((row) => row.selected) ?? null);

  constructor() {
    super();
    this.lookups.refresh();
    this.reload();
  }

  protected openWork(row: PurchaseRequest): boolean {
    return row.status === 'pending' || row.status === 'approved';
  }

  protected locName(code: string, fallback: string): string {
    const supplier = this.suppliers().find((row) => row.code === code);
    if (!supplier) return fallback;
    if (this.store.language() === 'en') return String(supplier['name_en'] || supplier.name);
    return supplier.name;
  }

  protected num(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  protected onSupplier(event: Event): void {
    this.supplierCode.set((event.target as HTMLSelectElement).value);
  }

  protected approve(): void {
    const id = this.selectedId();
    this.api.post(API_ENDPOINTS.purchasing.approveRequest(id), {}).subscribe(() => {
      this.notify.success('common.updated');
      this.reload();
    });
  }

  protected select(id: string): void {
    this.api.post(API_ENDPOINTS.purchasing.selectQuotation(id), {}).subscribe(() => {
      this.notify.success('common.updated');
      this.reload();
    });
  }

  protected async addOffer(): Promise<void> {
    const request = this.current();
    const supplier = this.suppliers().find((row) => row.code === this.supplierCode());
    if (!request || !supplier || this.amount() <= 0) return;
    if (!(await this.confirm.askSave())) return;
    const rate = this.lookups.rateOf('currencies', supplier.currency) ?? 1;
    this.api
      .post(API_ENDPOINTS.purchasing.quotations, {
        requestId: request.id,
        supplierCode: supplier.code,
        supplierName: supplier.name,
        totalValue: this.amount(),
        currency: supplier.currency,
        exchangeRate: rate,
        deliveryDays: this.days(),
        technicalScore: this.score(),
        selected: false,
      })
      .subscribe(() => {
        this.notify.success('common.created');
        this.amount.set(0);
        this.reload();
      });
  }

  protected async issue(): Promise<void> {
    const id = this.selectedId();
    if (!this.winner() || !(await this.confirm.askSave())) return;
    this.api.post(API_ENDPOINTS.purchasing.issueOrder(id), {}).subscribe(() => {
      this.notify.success('common.created');
      this.reload();
    });
  }

  private reload(): void {
    forkJoin({
      requests: this.api.get<PurchaseRequest[]>(API_ENDPOINTS.purchasing.requests),
      quotations: this.api.get<SupplierQuotation[]>(API_ENDPOINTS.purchasing.quotations),
      suppliers: this.api.get<Supplier[]>(API_ENDPOINTS.purchasing.suppliers),
    }).subscribe((pack) => {
      this.requests.set(pack.requests);
      this.quotations.set(pack.quotations);
      this.suppliers.set(pack.suppliers);
      if (!this.selectedId() && pack.requests[0]) this.selectedId.set(pack.requests[0].id);
    });
  }
}
