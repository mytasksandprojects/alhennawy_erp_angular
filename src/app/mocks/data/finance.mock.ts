import { BankAccount, JournalEntry } from '../../core/models/finance.models';
import { SEED_ACCOUNTS_1 } from './seed/accounts-1';
import { SEED_ACCOUNTS_2 } from './seed/accounts-2';
import { SEED_ACCOUNTS_3 } from './seed/accounts-3';

/** Flat chart of accounts from the approved Excel workbook. */
export const MOCK_ACCOUNT_FLAT = [...SEED_ACCOUNTS_1, ...SEED_ACCOUNTS_2, ...SEED_ACCOUNTS_3];

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  { id: 'je-1', number: 1041, date: daysAgo(0), currency: 'EGP', exchangeRate: 1, sourceKey: 'finance.sources.weighbridge', posted: true, totalDebit: 145350, totalCredit: 145350, lines: [
    { accountCode: '1207', accountName: 'المخازن', debit: 145350, credit: 0, descriptionKey: 'finance.desc.dashtReceipt' },
    { accountCode: '2102', accountName: 'الموردون / حسابات دائنة', debit: 0, credit: 145350, descriptionKey: 'finance.desc.dashtReceipt' },
  ]},
  { id: 'je-2', number: 1042, date: daysAgo(0), currency: 'USD', exchangeRate: 48.6, sourceKey: 'finance.sources.export', posted: true, totalDebit: 39875, totalCredit: 39875, lines: [
    { accountCode: '1206', accountName: 'العملاء', debit: 39875, credit: 0, descriptionKey: 'finance.desc.exportInvoice' },
    { accountCode: '41', accountName: 'صافي المبيعات', debit: 0, credit: 39875, costCenter: 'CC-EXP', descriptionKey: 'finance.desc.exportInvoice' },
  ]},
  { id: 'je-3', number: 1043, date: daysAgo(1), currency: 'EGP', exchangeRate: 1, sourceKey: 'finance.sources.customs', posted: false, totalDebit: 86200, totalCredit: 86200, lines: [
    { accountCode: '1207', accountName: 'المخازن', debit: 86200, credit: 0, descriptionKey: 'finance.desc.clearanceCosts' },
    { accountCode: '1204', accountName: 'حسابات البنوك', debit: 0, credit: 86200, descriptionKey: 'finance.desc.clearanceCosts' },
  ]},
];

export const MOCK_BANKS: BankAccount[] = [
  { id: 'bk-1', bankNameKey: 'finance.banks.nbeEgp', accountNumber: '1234-5678-901', currency: 'EGP', balance: 4820000 },
  { id: 'bk-2', bankNameKey: 'finance.banks.nbeUsd', accountNumber: '1234-5678-902', currency: 'USD', balance: 315000 },
  { id: 'bk-3', bankNameKey: 'finance.banks.cibEgp', accountNumber: '9988-7766-554', currency: 'EGP', balance: 1975000 },
];
