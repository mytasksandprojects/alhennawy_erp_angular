/** الإدارة المالية — Finance domain. */
import { Localized } from './common.models';

export type AccountNature = 'debit' | 'credit';

export interface Account extends Localized {
  code: string;
  /** Default-language name; other languages stored flat as name_<code>. */
  name: string;
  parentCode?: string;
  level: number;
  nature: AccountNature;
  currency: string;
  isPostable: boolean;
  costCenterRequired: boolean;
  children?: Account[];
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  costCenter?: string;
  descriptionKey?: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  number: number;
  date: string;
  currency: string;
  /** Manual rate — export statements show USD even when paid in EGP. */
  exchangeRate: number;
  sourceKey: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  posted: boolean;
}

export interface BankAccount {
  id: string;
  bankNameKey: string;
  accountNumber: string;
  currency: string;
  balance: number;
}

export interface CashFlowSummary {
  inflow: number;
  outflow: number;
  period: string;
}

/** Row of a financial statement (P&L / balance sheet), served by the API. */
export interface StatementRow {
  id: string;
  labelKey: string;
  amount?: number;
  kind: 'header' | 'line' | 'subtotal' | 'total';
}

export interface ExpenseRecord {
  id: string;
  date: string;
  categoryKey: string;
  costCenter: string;
  description: string;
  amount: number;
  currency: string;
  /** Rate to EGP — prefilled from the currency default, editable. */
  exchangeRate?: number;
}
