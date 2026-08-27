import { ExpenseRecord, StatementRow } from '../../core/models/finance.models';

/** MOCK LAYER — financial statements + expense records for the finance module. */

const row = (
  id: string,
  labelKey: string,
  kind: StatementRow['kind'],
  amount?: number,
): StatementRow => ({ id, labelKey, kind, amount });

/** قائمة الدخل — numbers reconcile with the finance dashboard KPIs. */
export const MOCK_PNL: StatementRow[] = [
  row('rev', 'finance.pnl.revenue', 'header'),
  row('rev-local', 'finance.pnl.localSales', 'line', 11350000),
  row('rev-export', 'finance.pnl.exportSales', 'line', 6480000),
  row('rev-misc', 'finance.pnl.miscRevenue', 'line', 620000),
  row('rev-total', 'finance.pnl.totalRevenue', 'subtotal', 18450000),
  row('cogs', 'finance.pnl.cogs', 'header'),
  row('cogs-raw', 'finance.pnl.rawMaterials', 'line', -6200000),
  row('cogs-labor', 'finance.pnl.directLabor', 'line', -1300000),
  row('cogs-energy', 'finance.pnl.energy', 'line', -900000),
  row('cogs-total', 'finance.pnl.totalCogs', 'subtotal', -8400000),
  row('gross', 'finance.pnl.grossProfit', 'subtotal', 10050000),
  row('opex', 'finance.pnl.opex', 'header'),
  row('opex-salaries', 'finance.pnl.salaries', 'line', -1450000),
  row('opex-maintenance', 'finance.pnl.maintenance', 'line', -720000),
  row('opex-logistics', 'finance.pnl.logistics', 'line', -640000),
  row('opex-marketing', 'finance.pnl.marketing', 'line', -380000),
  row('opex-other', 'finance.pnl.other', 'line', -490000),
  row('opex-total', 'finance.pnl.totalOpex', 'subtotal', -3680000),
  row('operating', 'finance.pnl.operatingProfit', 'subtotal', 6370000),
  row('fin-costs', 'finance.pnl.financeCosts', 'line', -200000),
  row('net', 'finance.pnl.netProfit', 'total', 6170000),
];

/** الميزانية — assets equal liabilities + equity (48,142,700). */
export const MOCK_BALANCE_SHEET: StatementRow[] = [
  row('ca', 'finance.bs.currentAssets', 'header'),
  row('ca-cash', 'finance.bs.cash', 'line', 2290000),
  row('ca-banks', 'finance.bs.banks', 'line', 4820000),
  row('ca-receivables', 'finance.bs.receivables', 'line', 1166700),
  row('ca-inventory', 'finance.bs.inventory', 'line', 11616000),
  row('ca-total', 'finance.bs.totalCurrentAssets', 'subtotal', 19892700),
  row('fa', 'finance.bs.fixedAssets', 'header'),
  row('fa-land', 'finance.bs.land', 'line', 6500000),
  row('fa-buildings', 'finance.bs.buildings', 'line', 8200000),
  row('fa-machinery', 'finance.bs.machinery', 'line', 12400000),
  row('fa-vehicles', 'finance.bs.vehicles', 'line', 1150000),
  row('fa-total', 'finance.bs.totalFixedAssets', 'subtotal', 28250000),
  row('assets-total', 'finance.bs.totalAssets', 'total', 48142700),
  row('liab', 'finance.bs.liabilities', 'header'),
  row('liab-suppliers', 'finance.bs.suppliers', 'line', 862500),
  row('liab-notes', 'finance.bs.notesPayable', 'line', 540000),
  row('liab-accruals', 'finance.bs.accruals', 'line', 310200),
  row('liab-total', 'finance.bs.totalLiabilities', 'subtotal', 1712700),
  row('eq', 'finance.bs.equity', 'header'),
  row('eq-capital', 'finance.bs.capital', 'line', 30000000),
  row('eq-retained', 'finance.bs.retainedEarnings', 'line', 10260000),
  row('eq-year', 'finance.bs.yearProfit', 'line', 6170000),
  row('eq-total', 'finance.bs.totalEquity', 'subtotal', 46430000),
  row('le-total', 'finance.bs.totalLiabilitiesEquity', 'total', 48142700),
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const MOCK_EXPENSES: ExpenseRecord[] = [
  { id: 'exp-1', date: daysAgo(0), categoryKey: 'finance.expenseCategories.rawMaterials', costCenter: 'CC-PROD', description: 'شراء دشت المنوفية — دفعة أغسطس', amount: 1453500, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-2', date: daysAgo(0), categoryKey: 'finance.expenseCategories.energy', costCenter: 'CC-PROD', description: 'فاتورة كهرباء المصنع', amount: 182400, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-3', date: daysAgo(1), categoryKey: 'finance.expenseCategories.salaries', costCenter: 'CC-ADM', description: 'مرتبات شهر يوليو', amount: 1180000, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-4', date: daysAgo(2), categoryKey: 'finance.expenseCategories.maintenance', costCenter: 'CC-PROD', description: 'صيانة ماكينة التقطيع الأولى', amount: 96500, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-5', date: daysAgo(3), categoryKey: 'finance.expenseCategories.logistics', costCenter: 'CC-EXP', description: 'شحن حاوية تصدير إلى الأردن', amount: 68000, currency: 'USD', exchangeRate: 48.5 },
  { id: 'exp-6', date: daysAgo(4), categoryKey: 'finance.expenseCategories.other', costCenter: 'CC-ADM', description: 'أدوات مكتبية وضيافة', amount: 12750, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-7', date: daysAgo(5), categoryKey: 'finance.expenseCategories.rawMaterials', costCenter: 'CC-PROD', description: 'كيماويات معالجة المياه', amount: 495000, currency: 'EGP', exchangeRate: 1 },
  { id: 'exp-8', date: daysAgo(6), categoryKey: 'finance.expenseCategories.logistics', costCenter: 'CC-IMP', description: 'رسوم جمركية — لب ورق مستورد', amount: 243600, currency: 'EGP', exchangeRate: 1 },
];

export const MOCK_LEDGER = [
  { id: 'gl-1', date: daysAgo(1), accountCode: '4101', accountName: 'مبيعات محلية', reference: 'INV-2026-0455', debit: 0, credit: 398750, balance: 398750 },
  { id: 'gl-2', date: daysAgo(1), accountCode: '1201', accountName: 'عملاء', reference: 'INV-2026-0455', debit: 398750, credit: 0, balance: 398750 },
  { id: 'gl-3', date: daysAgo(0), accountCode: '1201', accountName: 'عملاء', reference: 'INV-2026-0455', debit: 0, credit: 199375, balance: 199375 },
  { id: 'gl-4', date: daysAgo(0), accountCode: '1102', accountName: 'بنك أهلي — جنيه', reference: 'INV-2026-0455', debit: 199375, credit: 0, balance: 199375 },
  { id: 'gl-5', date: daysAgo(9), accountCode: '4102', accountName: 'مبيعات تصدير', reference: 'CI-2026-0031', debit: 0, credit: 39875, balance: 39875 },
];

export const MOCK_TRIAL_BALANCE = [
  { id: 'tb-1', accountCode: '1101', accountName: 'نقدية', debit: 2290000, credit: 0 },
  { id: 'tb-2', accountCode: '1102', accountName: 'بنوك', debit: 4820000, credit: 0 },
  { id: 'tb-3', accountCode: '1201', accountName: 'عملاء', debit: 1166700, credit: 0 },
  { id: 'tb-4', accountCode: '2101', accountName: 'موردون', debit: 0, credit: 862500 },
  { id: 'tb-5', accountCode: '4101', accountName: 'مبيعات محلية', debit: 0, credit: 11350000 },
  { id: 'tb-6', accountCode: '5101', accountName: 'خامات', debit: 6200000, credit: 0 },
];
