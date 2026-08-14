import {
  Account,
  BankAccount,
  JournalEntry,
} from '../../core/models/finance.models';

/** MOCK LAYER — chart of accounts matching the BRD tree (أصول، حقوق ملكية، خصوم، إيرادات، مشتريات، مصروفات). */
export const MOCK_ACCOUNTS: Account[] = [
  { code: '1', name: 'الأصول', name_en: 'Assets', level: 1, nature: 'debit', currency: 'EGP', isPostable: false, costCenterRequired: false, children: [
    { code: '11', name: 'الأصول الثابتة', name_en: 'Fixed Assets', parentCode: '1', level: 2, nature: 'debit', currency: 'EGP', isPostable: false, costCenterRequired: false, children: [
      { code: '111', name: 'أراضي', name_en: 'Land', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '112', name: 'كاميرات مراقبة', name_en: 'CCTV', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '113', name: 'سيارات', name_en: 'Vehicles', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '114', name: 'آلات ومعدات', name_en: 'Machinery', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '115', name: 'مباني وإنشاءات', name_en: 'Buildings', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '116', name: 'أجهزة معملية وموازين', name_en: 'Lab & Scales', parentCode: '11', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    ]},
    { code: '13', name: 'الأصول المتداولة', name_en: 'Current Assets', parentCode: '1', level: 2, nature: 'debit', currency: 'EGP', isPostable: false, costCenterRequired: false, children: [
      { code: '131', name: 'الخزينة الرئيسية جنيه مصري', name_en: 'Main Cash EGP', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '132', name: 'الخزينة الرئيسية عملات أجنبية', name_en: 'Main Cash FX', parentCode: '13', level: 3, nature: 'debit', currency: 'USD', isPostable: true, costCenterRequired: false },
      { code: '133', name: 'العهد', name_en: 'Custody', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '134', name: 'السلف', name_en: 'Advances', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '135', name: 'المخزون', name_en: 'Inventory', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '136', name: 'العملاء', name_en: 'Customers', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
      { code: '137', name: 'البنوك', name_en: 'Banks', parentCode: '13', level: 3, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    ]},
  ]},
  { code: '2', name: 'حقوق الملكية', name_en: 'Equity', level: 1, nature: 'credit', currency: 'EGP', isPostable: false, costCenterRequired: false, children: [
    { code: '21', name: 'رأس المال', name_en: 'Capital', parentCode: '2', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '22', name: 'جاري المساهمين', name_en: 'Shareholders', parentCode: '2', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '23', name: 'أرباح العام', name_en: 'Year Profit', parentCode: '2', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '24', name: 'أرباح مرحلة', name_en: 'Retained Earnings', parentCode: '2', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '25', name: 'احتياطي عام', name_en: 'General Reserve', parentCode: '2', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
  ]},
  { code: '3', name: 'الخصوم', name_en: 'Liabilities', level: 1, nature: 'credit', currency: 'EGP', isPostable: false, costCenterRequired: false, children: [
    { code: '31', name: 'أوراق الدفع', name_en: 'Notes Payable', parentCode: '3', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '32', name: 'الموردين', name_en: 'Suppliers', parentCode: '3', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '33', name: 'دائنو شراء أصول ثابتة', name_en: 'Fixed Asset Creditors', parentCode: '3', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '34', name: 'توزيعات الأرباح', name_en: 'Dividends', parentCode: '3', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
    { code: '35', name: 'حسابات تحت التسوية', name_en: 'Suspense', parentCode: '3', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
  ]},
  { code: '4', name: 'الإيرادات', name_en: 'Revenue', level: 1, nature: 'credit', currency: 'EGP', isPostable: false, costCenterRequired: true, children: [
    { code: '41', name: 'صافي المبيعات', name_en: 'Net Sales', parentCode: '4', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: true },
    { code: '42', name: 'مردودات المبيعات', name_en: 'Sales Returns', parentCode: '4', level: 2, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: true },
    { code: '43', name: 'إيرادات متنوعة', name_en: 'Misc Revenue', parentCode: '4', level: 2, nature: 'credit', currency: 'EGP', isPostable: true, costCenterRequired: false },
  ]},
  { code: '5', name: 'صافي المشتريات', name_en: 'Net Purchases', level: 1, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: true },
  { code: '6', name: 'المصروفات', name_en: 'Expenses', level: 1, nature: 'debit', currency: 'EGP', isPostable: false, costCenterRequired: true, children: [
    { code: '61', name: 'مصاريف التشغيل', name_en: 'Operating', parentCode: '6', level: 2, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: true },
    { code: '62', name: 'مصروفات إدارية وعمومية', name_en: 'G&A', parentCode: '6', level: 2, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: true },
    { code: '63', name: 'مصروفات تسويقية', name_en: 'Marketing', parentCode: '6', level: 2, nature: 'debit', currency: 'EGP', isPostable: true, costCenterRequired: true },
  ]},
];

function flattenAccounts(nodes: Account[]): Account[] {
  const out: Account[] = [];
  for (const node of nodes) {
    const { children, ...row } = node;
    out.push(row);
    if (children?.length) out.push(...flattenAccounts(children));
  }
  return out;
}

/** Flat chart of accounts — source of truth for GET + CRUD. */
export const MOCK_ACCOUNT_FLAT = flattenAccounts(MOCK_ACCOUNTS);

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  { id: 'je-1', number: 1041, date: daysAgo(0), currency: 'EGP', exchangeRate: 1, sourceKey: 'finance.sources.weighbridge', posted: true, totalDebit: 145350, totalCredit: 145350, lines: [
    { accountCode: '135', accountName: 'المخزون', debit: 145350, credit: 0, descriptionKey: 'finance.desc.dashtReceipt' },
    { accountCode: '32', accountName: 'الموردين', debit: 0, credit: 145350, descriptionKey: 'finance.desc.dashtReceipt' },
  ]},
  { id: 'je-2', number: 1042, date: daysAgo(0), currency: 'USD', exchangeRate: 48.6, sourceKey: 'finance.sources.export', posted: true, totalDebit: 39875, totalCredit: 39875, lines: [
    { accountCode: '136', accountName: 'العملاء', debit: 39875, credit: 0, descriptionKey: 'finance.desc.exportInvoice' },
    { accountCode: '41', accountName: 'صافي المبيعات', debit: 0, credit: 39875, costCenter: 'CC-EXP', descriptionKey: 'finance.desc.exportInvoice' },
  ]},
  { id: 'je-3', number: 1043, date: daysAgo(1), currency: 'EGP', exchangeRate: 1, sourceKey: 'finance.sources.customs', posted: false, totalDebit: 86200, totalCredit: 86200, lines: [
    { accountCode: '135', accountName: 'المخزون', debit: 86200, credit: 0, descriptionKey: 'finance.desc.clearanceCosts' },
    { accountCode: '137', accountName: 'البنوك', debit: 0, credit: 86200, descriptionKey: 'finance.desc.clearanceCosts' },
  ]},
];

export const MOCK_BANKS: BankAccount[] = [
  { id: 'bk-1', bankNameKey: 'finance.banks.nbeEgp', accountNumber: '1234-5678-901', currency: 'EGP', balance: 4820000 },
  { id: 'bk-2', bankNameKey: 'finance.banks.nbeUsd', accountNumber: '1234-5678-902', currency: 'USD', balance: 315000 },
  { id: 'bk-3', bankNameKey: 'finance.banks.cibEgp', accountNumber: '9988-7766-554', currency: 'EGP', balance: 1975000 },
];
