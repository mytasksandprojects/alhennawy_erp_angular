import { FormField, TableColumn } from '../../core/models/common.models';
import { LanguageOption } from '../../core/models/config.models';
import { boolOptions, keysToOptions } from '../../shared/crud/options';
import { extraLanguageLabelFields } from '../system/system.columns';

export const JOURNAL_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'finance.fields.entryNo', type: 'number', align: 'center' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'sourceKey', labelKey: 'finance.fields.source', type: 'key' },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
  { key: 'totalDebit', labelKey: 'finance.fields.debit', type: 'currency' },
  { key: 'totalCredit', labelKey: 'finance.fields.credit', type: 'currency' },
  {
    key: 'posted',
    labelKey: 'finance.fields.posted',
    type: 'badge',
    keyPrefix: 'common.bool.',
    badgeToneMap: { true: 'success', false: 'warning' },
  },
];

export const BANK_COLUMNS: TableColumn[] = [
  { key: 'bankNameKey', labelKey: 'finance.fields.bank', type: 'key' },
  { key: 'accountNumber', labelKey: 'finance.fields.accountNumber' },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'balance', labelKey: 'common.balance', type: 'currency' },
];

export const ACCOUNT_COLUMNS: TableColumn[] = [
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'parentCode', labelKey: 'finance.fields.parentCode' },
  { key: 'level', labelKey: 'finance.fields.level', type: 'number', align: 'center' },
  {
    key: 'nature',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'finance.nature.',
    badgeToneMap: { debit: 'info', credit: 'warning' },
  },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
];

export const JOURNAL_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'finance.fields.entryNo', type: 'number', required: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'sourceKey', labelKey: 'finance.fields.source', type: 'select', lookup: 'journalSources' },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
  { key: 'totalDebit', labelKey: 'finance.fields.debit', type: 'number' },
  { key: 'totalCredit', labelKey: 'finance.fields.credit', type: 'number' },
  { key: 'posted', labelKey: 'finance.fields.posted', type: 'select', options: boolOptions },
];

export const BANK_FIELDS: FormField[] = [
  { key: 'bankNameKey', labelKey: 'finance.fields.bank', type: 'select', lookup: 'bankNames' },
  { key: 'accountNumber', labelKey: 'finance.fields.accountNumber', required: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'balance', labelKey: 'common.balance', type: 'number' },
];

export const EXPENSE_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'categoryKey', labelKey: 'finance.fields.category', type: 'key' },
  { key: 'costCenter', labelKey: 'finance.fields.costCenter', align: 'center' },
  { key: 'description', labelKey: 'finance.fields.description', multilang: true },
  { key: 'amount', labelKey: 'finance.fields.amount', type: 'currency' },
  { key: 'currency', labelKey: 'common.currency', align: 'center' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
];

export const EXPENSE_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date', required: true },
  { key: 'categoryKey', labelKey: 'finance.fields.category', type: 'select', lookup: 'expenseCategories', required: true },
  { key: 'costCenter', labelKey: 'finance.fields.costCenter' },
  { key: 'description', labelKey: 'finance.fields.description', type: 'textarea', multilang: true },
  { key: 'amount', labelKey: 'finance.fields.amount', type: 'number', required: true },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies', rateKey: 'exchangeRate' },
  { key: 'exchangeRate', labelKey: 'finance.fields.rate', type: 'number' },
];

export const ACCOUNT_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', required: true },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'parentCode', labelKey: 'finance.fields.parentCode' },
  { key: 'level', labelKey: 'finance.fields.level', type: 'number' },
  { key: 'nature', labelKey: 'common.type', type: 'select', options: keysToOptions('finance.nature.', ['debit', 'credit']) },
  { key: 'currency', labelKey: 'common.currency', type: 'select', lookup: 'currencies' },
  { key: 'isPostable', labelKey: 'finance.fields.postable', type: 'select', options: boolOptions },
];

/**
 * العملات — admin-managed; feeds every currency dropdown system-wide.
 * Non-EGP currencies must carry a default exchange rate to EGP; order
 * and purchase forms prefill it and allow a manual override per record.
 */
export const CURRENCY_COLUMNS: TableColumn[] = [
  { key: 'value', labelKey: 'finance.fields.currencyCode' },
  { key: 'labelAr', labelKey: 'system.fields.labelAr' },
  { key: 'labelEn', labelKey: 'system.fields.labelEn' },
  { key: 'rate', labelKey: 'finance.fields.rate', type: 'number', align: 'center' },
];

/** One label input per configured language (new languages auto-appear). */
export function currencyFields(languages: LanguageOption[]): FormField[] {
  return [
    { key: 'value', labelKey: 'finance.fields.currencyCode', required: true },
    { key: 'labelAr', labelKey: 'system.fields.labelAr', required: true },
    { key: 'labelEn', labelKey: 'system.fields.labelEn', required: true },
    ...extraLanguageLabelFields(languages),
    { key: 'rate', labelKey: 'finance.fields.rate', type: 'number', required: true },
  ];
}
