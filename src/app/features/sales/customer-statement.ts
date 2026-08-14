import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { Customer, StatementLine } from '../../core/models/sales.models';
import { TableColumn } from '../../core/models/common.models';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiTable } from '../../shared/components/ui-table';
import { Translated } from '../../shared/translated.base';

const STATEMENT_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'docKey', labelKey: 'sales.statement.document', type: 'key' },
  { key: 'docNumber', labelKey: 'common.number' },
  { key: 'description', labelKey: 'finance.fields.description' },
  { key: 'debit', labelKey: 'finance.fields.debit', type: 'currency' },
  { key: 'credit', labelKey: 'finance.fields.credit', type: 'currency' },
  { key: 'balance', labelKey: 'common.balance', type: 'currency' },
];

/**
 * كشف حساب العميل — pick a customer, see every invoice / bank movement
 * with a running balance, and print the statement.
 */
@Component({
  selector: 'app-customer-statement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon, UiTable],
  template: `
    <section class="ui-card statement-card">
      <div class="row token-toolbar">
        <select
          class="ui-control token-search"
          (change)="select($any($event.target).value)"
        >
          <option value="">{{ t('sales.statement.selectCustomer') }}</option>
          @for (customer of customers(); track customer.code) {
            <option [value]="customer.code" [selected]="customer.code === code()">
              {{ customer.code }} — {{ customer.name }}
            </option>
          }
        </select>
        <p class="ui-field__hint token-toolbar__hint">
          {{ t('sales.statement.hint') }}
        </p>
        <button
          type="button"
          class="ui-btn ui-btn--ghost"
          [disabled]="!lines().length"
          (click)="print()"
        >
          <ui-icon name="print" [size]="16" />
          {{ t('common.print') }}
        </button>
      </div>

      @if (customer(); as active) {
        <div class="print-area">
        <div class="row statement-summary">
          <span class="statement-summary__item">
            {{ t('common.code') }}: <strong>{{ active.code }}</strong>
          </span>
          <span class="statement-summary__item">
            {{ t('common.currency') }}: <strong>{{ active.currency }}</strong>
          </span>
          <span class="statement-summary__item">
            {{ t('sales.statement.totalDebit') }}:
            <strong class="mono">{{ fmtNum(totalDebit()) }}</strong>
          </span>
          <span class="statement-summary__item">
            {{ t('sales.statement.totalCredit') }}:
            <strong class="mono">{{ fmtNum(totalCredit()) }}</strong>
          </span>
          <span class="statement-summary__item">
            {{ t('sales.statement.finalBalance') }}:
            <strong class="mono">{{ fmtNum(finalBalance()) }}</strong>
          </span>
        </div>

        <ui-table [columns]="columns" [rows]="$any(lines())" />
        </div>

        @if (active.currency === 'USD') {
          <p class="ui-field__hint statement-card__note">
            {{ t('finance.usdStatementRule') }}
          </p>
        }
      }
    </section>
  `,
})
export class CustomerStatement extends Translated {
  private readonly api = inject(ApiClientService);

  protected readonly columns = STATEMENT_COLUMNS;
  protected readonly customers = signal<Customer[]>([]);
  protected readonly code = signal('');
  protected readonly lines = signal<StatementLine[]>([]);

  protected readonly customer = computed(() =>
    this.customers().find((row) => row.code === this.code()),
  );
  protected readonly totalDebit = computed(() =>
    this.lines().reduce((sum, row) => sum + row.debit, 0),
  );
  protected readonly totalCredit = computed(() =>
    this.lines().reduce((sum, row) => sum + row.credit, 0),
  );
  protected readonly finalBalance = computed(
    () => this.lines().at(-1)?.balance ?? 0,
  );

  constructor() {
    super();
    this.api
      .get<Customer[]>(API_ENDPOINTS.sales.customers)
      .subscribe((rows) => this.customers.set(rows));
  }

  protected select(code: string): void {
    this.code.set(code);
    this.lines.set([]);
    if (!code) return;
    this.api
      .get<StatementLine[]>(API_ENDPOINTS.sales.customerStatement(code))
      .subscribe((rows) => this.lines.set(rows));
  }

  protected print(): void {
    window.print();
  }
}
