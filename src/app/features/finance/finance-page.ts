import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { Account, StatementRow } from '../../core/models/finance.models';
import { CrudPanel } from '../../shared/components/crud-panel';
import { ModuleDashboard } from '../../shared/components/module-dashboard';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { initialTab, tabNavigator } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';
import { AccountsTree } from './accounts-tree';
import { StatementView } from './statement-view';
import {
  ACCOUNT_COLUMNS,
  ACCOUNT_FIELDS,
  BANK_COLUMNS,
  BANK_FIELDS,
  CURRENCY_COLUMNS,
  currencyFields,
  EXPENSE_COLUMNS,
  EXPENSE_FIELDS,
  JOURNAL_COLUMNS,
  JOURNAL_FIELDS,
} from './finance.columns';

function nestAccounts(flat: Account[]): Account[] {
  const map = new Map<string, Account>();
  for (const row of flat) {
    map.set(row.code, { ...row, children: [] });
  }
  const roots: Account[] = [];
  for (const node of map.values()) {
    const parent = node.parentCode ? map.get(node.parentCode) : undefined;
    if (parent) {
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** الإدارة المالية — tree + CRUD for accounts, journal, and banks. */
@Component({
  selector: 'app-finance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ModuleDashboard,
    UiPageHeader,
    UiTabs,
    AccountsTree,
    CrudPanel,
    StatementView,
  ],
  template: `
    <ui-page-header titleKey="finance.title" subtitleKey="finance.subtitle" />

    <ui-tabs [tabs]="tabItems" [active]="active()" (activeChange)="activate($event)" />

    @switch (active()) {
      @case ('dashboard') {
        <module-dashboard moduleId="finance" />
      }
      @case ('accounts') {
        <section class="ui-card" style="margin-bottom: var(--space-lg)">
          <h2 class="ui-card__title">{{ t('finance.tabs.accounts') }}</h2>
          <app-accounts-tree [accounts]="accounts()" />
        </section>
        <crud-panel
          [endpoint]="accountsUrl"
          [columns]="accountColumns"
          [fields]="accountFields"
          idKey="code"
        />
      }
      @case ('journal') {
        <crud-panel
          [endpoint]="journalUrl"
          [columns]="journalColumns"
          [fields]="journalFields"
        />
        <p class="ui-field__hint" style="margin-top: var(--space-sm)">
          {{ t('finance.usdStatementRule') }}
        </p>
      }
      @case ('banks') {
        <crud-panel
          [endpoint]="banksUrl"
          [columns]="bankColumns"
          [fields]="bankFields"
        />
      }
      @case ('pnl') {
        <app-statement-view titleKey="finance.tabs.pnl" [rows]="pnl()" />
      }
      @case ('balanceSheet') {
        <app-statement-view
          titleKey="finance.tabs.balanceSheet"
          [rows]="balanceSheet()"
        />
      }
      @case ('expenses') {
        <crud-panel
          [endpoint]="expensesUrl"
          [columns]="expenseColumns"
          [fields]="expenseFields"
        />
      }
      @case ('currencies') {
        <p class="ui-field__hint" style="margin-bottom: var(--space-sm)">
          {{ t('finance.currenciesHint') }}
        </p>
        <crud-panel
          [endpoint]="currenciesUrl"
          [columns]="currencyColumns"
          [fields]="currencyFields()"
        />
      }
    }
  `,
})
export class FinancePage extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);

  protected readonly accountsUrl = API_ENDPOINTS.finance.accounts;
  protected readonly journalUrl = API_ENDPOINTS.finance.journalEntries;
  protected readonly banksUrl = API_ENDPOINTS.finance.banks;
  protected readonly expensesUrl = API_ENDPOINTS.finance.expenses;
  protected readonly accountColumns = ACCOUNT_COLUMNS;
  protected readonly accountFields = ACCOUNT_FIELDS;
  protected readonly journalColumns = JOURNAL_COLUMNS;
  protected readonly journalFields = JOURNAL_FIELDS;
  protected readonly bankColumns = BANK_COLUMNS;
  protected readonly bankFields = BANK_FIELDS;
  protected readonly expenseColumns = EXPENSE_COLUMNS;
  protected readonly expenseFields = EXPENSE_FIELDS;
  protected readonly currenciesUrl = API_ENDPOINTS.finance.currencies;
  protected readonly currencyColumns = CURRENCY_COLUMNS;
  /** Rebuilt whenever an admin registers a new language. */
  protected readonly currencyFields = computed(() =>
    currencyFields(this.store.settings()?.languages ?? []),
  );

  protected readonly tabItems: TabItem[] = [
    { id: 'dashboard', labelKey: 'common.dashboardTab' },
    { id: 'accounts', labelKey: 'finance.tabs.accounts' },
    { id: 'journal', labelKey: 'finance.tabs.journal' },
    { id: 'banks', labelKey: 'finance.tabs.banks' },
    { id: 'pnl', labelKey: 'finance.tabs.pnl' },
    { id: 'balanceSheet', labelKey: 'finance.tabs.balanceSheet' },
    { id: 'expenses', labelKey: 'finance.tabs.expenses' },
    { id: 'currencies', labelKey: 'finance.tabs.currencies' },
  ];

  protected readonly active = signal(initialTab('dashboard'));
  private readonly navigateToTab = tabNavigator();
  protected readonly accounts = signal<Account[]>([]);
  protected readonly pnl = signal<StatementRow[]>([]);
  protected readonly balanceSheet = signal<StatementRow[]>([]);

  constructor() {
    super();
    this.loadFor(this.active());
  }

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
    this.loadFor(tabId);
  }

  private loadFor(tabId: string): void {
    if (tabId === 'accounts') {
      this.api
        .get<Account[]>(API_ENDPOINTS.finance.accounts)
        .subscribe((flat) => this.accounts.set(nestAccounts(flat)));
    } else if (tabId === 'pnl' && !this.pnl().length) {
      this.api
        .get<StatementRow[]>(API_ENDPOINTS.finance.profitLoss)
        .subscribe((rows) => this.pnl.set(rows));
    } else if (tabId === 'balanceSheet' && !this.balanceSheet().length) {
      this.api
        .get<StatementRow[]>(API_ENDPOINTS.finance.balanceSheet)
        .subscribe((rows) => this.balanceSheet.set(rows));
    }
  }
}
