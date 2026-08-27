import {
  Customer,
  ExportOrder,
  Invoice,
  SalesWorkOrder,
  StatementLine,
} from '../../core/models/sales.models';

/** MOCK LAYER — sales (local work orders + export pipeline). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_CUSTOMERS: Customer[] = [
  { code: 'CUS-009', name: 'مصنع الوفاء للمناديل', name_en: 'Al Wafaa Tissue Factory', region: 'القاهرة', region_en: 'Cairo', currency: 'EGP', balance: 385000 },
  { code: 'CUS-014', name: 'شركة النيل للتغليف', name_en: 'Nile Packaging Co.', region: 'الجيزة', region_en: 'Giza', currency: 'EGP', balance: 512000, specAttachmentUrl: 'assets/specs/smp-22.pdf' },
  { code: 'CUS-021', name: 'الشركة الحديثة للورق الصحي', name_en: 'Modern Hygienic Paper Co.', region: 'الإسكندرية', region_en: 'Alexandria', currency: 'EGP', balance: 149000 },
  { code: 'CUS-EXP-03', name: 'Napoli Tissue S.r.l.', region: 'Italy', currency: 'USD', balance: 84200 },
  { code: 'CUS-EXP-07', name: 'Amman Hygiene Co.', region: 'Jordan', currency: 'USD', balance: 36500 },
];

export const MOCK_WORK_ORDERS: SalesWorkOrder[] = [
  { id: 'wo-1', number: 'SO-2026-0118', date: daysAgo(1), channel: 'local', customerCode: 'CUS-014', customerName: 'شركة النيل للتغليف', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 14500, sizeMm: 160, status: 'invoiced', availableFromStockKg: 14500, toProduceKg: 0, currency: 'EGP', exchangeRate: 1, agreedPrice: 27.5, collectionStatusKey: 'sales.collection.partial', collectionPercent: 50 },
  { id: 'wo-2', number: 'SO-2026-0119', date: daysAgo(0), channel: 'local', customerCode: 'CUS-009', customerName: 'مصنع الوفاء للمناديل', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, sizeMm: 113, status: 'in-production', availableFromStockKg: 8250, toProduceKg: 13750, currency: 'EGP', exchangeRate: 1, agreedPrice: 31, collectionStatusKey: 'sales.collection.deposit', collectionAmount: 200000 },
  { id: 'wo-3', number: 'SO-2026-0120', date: daysAgo(0), channel: 'local', customerCode: 'CUS-021', customerName: 'الشركة الحديثة للورق الصحي', itemCode: 'FIN-NPK-18', itemName: 'نابكن سادة ج ١٨', quantityKg: 9000, sizeMm: 250, status: 'late', availableFromStockKg: 0, toProduceKg: 9000, currency: 'EGP', exchangeRate: 1, agreedPrice: 29.25, collectionStatusKey: 'sales.collection.pending' },
  { id: 'wo-4', number: 'SO-2026-0117', date: daysAgo(4), channel: 'export', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, sizeMm: 160, status: 'ready', availableFromStockKg: 44000, toProduceKg: 0, currency: 'USD', exchangeRate: 48.5, agreedPrice: 0.92, collectionStatusKey: 'sales.collection.paid' },
];

export const MOCK_EXPORT_ORDERS: ExportOrder[] = [
  { id: 'eo-4', number: 'EXP-2026-0034', customerCode: 'CUS-EXP-07', customerName: 'Amman Hygiene Co.', stage: 'quotation', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 0, containersCount: 0, totalUsd: 20240 },
  { id: 'eo-5', number: 'EXP-2026-0033', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', stage: 'internal-approval', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 18000, rollsCount: 0, containersCount: 0, totalUsd: 16560 },
  { id: 'eo-2', number: 'EXP-2026-0032', customerCode: 'CUS-EXP-07', customerName: 'Amman Hygiene Co.', stage: 'proforma', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 48, containersCount: 1, totalUsd: 19800 },
  { id: 'eo-6', number: 'EXP-2026-0035', customerCode: 'CUS-EXP-07', customerName: 'Amman Hygiene Co.', stage: 'supply-order', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 12000, rollsCount: 0, containersCount: 0, totalUsd: 11040 },
  { id: 'eo-1', number: 'EXP-2026-0031', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', stage: 'logistics', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, productionDeadline: daysAhead(4), loadingDate: daysAhead(7), totalUsd: 40480 },
  { id: 'eo-3', number: 'EXP-2026-0030', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', stage: 'invoiced', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, loadingDate: daysAgo(9), eInvoiceNumber: 'EINV-88412', totalUsd: 39875 },
];

const line = (
  id: string,
  daysBack: number,
  docKey: string,
  docNumber: string,
  description: string,
  debit: number,
  credit: number,
  balance: number,
): StatementLine => ({
  id,
  date: daysAgo(daysBack),
  docKey,
  docNumber,
  description,
  debit,
  credit,
  balance,
});

/** كشف حساب العميل — running balances end exactly at each customer's balance. */
export const MOCK_STATEMENTS: Record<string, StatementLine[]> = {
  'CUS-014': [
    line('st-14-1', 40, 'sales.docs.opening', '—', 'رصيد أول المدة', 0, 0, 312625),
    line('st-14-2', 1, 'sales.docs.invoice', 'INV-2026-0455', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 398750, 0, 711375),
    line('st-14-3', 0, 'sales.docs.bank', '25369', 'تحويل بنكي — البنك الأهلي', 0, 199375, 512000),
  ],
  'CUS-009': [
    line('st-09-1', 40, 'sales.docs.opening', '—', 'رصيد أول المدة', 0, 0, 185000),
    line('st-09-2', 6, 'sales.docs.invoice', 'INV-2026-0448', 'تواليت فاخر ج ٢٥', 400000, 0, 585000),
    line('st-09-3', 2, 'sales.docs.bank', '25858', 'دفعة مقدمة — أمر شغل SO-2026-0119', 0, 200000, 385000),
  ],
  'CUS-EXP-03': [
    line('st-e3-1', 40, 'sales.docs.opening', '—', 'Opening balance', 0, 0, 84200),
    line('st-e3-2', 9, 'sales.docs.invoice', 'CI-2026-0031', 'Commercial Invoice — 2 containers', 39875, 0, 124075),
    line('st-e3-3', 5, 'sales.docs.bank', '26219', 'Swift transfer — Banca di Napoli', 0, 39875, 84200),
  ],
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', number: 'INV-2026-0455', kind: 'local', date: daysAgo(1), customerCode: 'CUS-014', customerName: 'شركة النيل للتغليف', currency: 'EGP', exchangeRate: 1, total: 398750, eInvoiceUid: 'EG-EINV-77120', collected: 199375 },
  { id: 'inv-2', number: 'CI-2026-0031', kind: 'commercial', date: daysAgo(9), customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', currency: 'USD', exchangeRate: 48.5, total: 39875, eInvoiceUid: 'EG-EINV-88412', collected: 39875 },
  { id: 'inv-3', number: 'PL-2026-0031', kind: 'packing-list', date: daysAgo(9), customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', currency: 'USD', exchangeRate: 48.5, total: 0, collected: 0 },
];
