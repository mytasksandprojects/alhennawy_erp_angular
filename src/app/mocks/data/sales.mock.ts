import {
  Customer,
  ExportOrder,
  Invoice,
  SalesOrderLine,
  SalesWorkOrder,
  StatementLine,
  TaxInvoice,
} from '../../core/models/sales.models';
import { SEED_CUSTOMERS } from './seed/customers.seed';

/** MOCK LAYER — sales (local work orders + export pipeline). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_CUSTOMERS: Customer[] = SEED_CUSTOMERS;

export const localCustomers = () => MOCK_CUSTOMERS.filter((row) => row.channel === 'local');
export const exportCustomers = () => MOCK_CUSTOMERS.filter((row) => row.channel === 'export');

const qc = (
  mix: 'mixed' | 'pure',
  product: string,
  ply: string,
  gsm: number,
  width: number,
) => ({
  mixType: `qc.mix.${mix}`,
  productName: product,
  parentFamily: product,
  ply,
  color: 'qc.colors.white',
  gsm,
  widthMm: width,
  sizeMm: width,
});

const line = (
  itemCode: string,
  itemName: string,
  quantity: number,
  pricePerKg: number,
  extra: Partial<SalesOrderLine> = {},
): string =>
  JSON.stringify([{ itemCode, itemName, quantity, pricePerKg, unitKey: 'units.kg', ...extra }]);

export const MOCK_WORK_ORDERS: SalesWorkOrder[] = [
  { id: 'wo-1', number: 'SO-2026-0118', date: daysAgo(1), channel: 'local', customerCode: 'CUS-001', customerName: 'العالمية للورق الصحي', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 14500, status: 'invoiced', availableFromStockKg: 14500, toProduceKg: 0, currency: 'EGP', exchangeRate: 1, agreedPrice: 27.5, totalPrice: 398750, collectionStatusKey: 'sales.collection.partial', collectionPercent: 50, linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 14500, 27.5, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }), ...qc('mixed', 'سوبر مكس مطبخ', '2', 22, 160) },
  { id: 'wo-2', number: 'SO-2026-0119', date: daysAgo(0), channel: 'local', customerCode: 'CUS-002', customerName: 'مؤسسة مسك للتجارة والتوريدات', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, status: 'in-production', availableFromStockKg: 8250, toProduceKg: 13750, currency: 'EGP', exchangeRate: 1, agreedPrice: 31, totalPrice: 682000, collectionStatusKey: 'sales.collection.deposit', collectionAmount: 200000, linesJson: line('FIN-TWL-25', 'تواليت فاخر ج ٢٥', 22000, 31, { ply: '2', color: 'qc.colors.white', gsm: 25, widthMm: 113 }), ...qc('pure', 'تواليت فاخر', '2', 25, 113) },
  { id: 'wo-3', number: 'SO-2026-0120', date: daysAgo(0), channel: 'local', customerCode: 'CUS-003', customerName: 'شركة الربيع لمنتجات الورق', itemCode: 'FIN-NPK-18', itemName: 'نابكن سادة ج ١٨', quantityKg: 9000, status: 'late', availableFromStockKg: 0, toProduceKg: 9000, currency: 'EGP', exchangeRate: 1, agreedPrice: 29.25, totalPrice: 263250, collectionStatusKey: 'sales.collection.pending', linesJson: line('FIN-NPK-18', 'نابكن سادة ج ١٨', 9000, 29.25, { ply: '1', color: 'qc.colors.white', gsm: 18, widthMm: 250 }), ...qc('pure', 'نابكن سادة', '1', 18, 250) },
  { id: 'wo-4', number: 'SO-2026-0117', date: daysAgo(4), channel: 'local', customerCode: 'CUS-011', customerName: 'الدولية لتصنيع وتقطيع وتعبئة منتجات الورق', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, status: 'ready', availableFromStockKg: 44000, toProduceKg: 0, currency: 'EGP', exchangeRate: 1, agreedPrice: 27.5, totalPrice: 1210000, collectionStatusKey: 'sales.collection.paid', linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 44000, 27.5, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }), ...qc('mixed', 'سوبر مكس مطبخ', '2', 22, 160) },
];

export const MOCK_EXPORT_ORDERS: ExportOrder[] = [
  { id: 'eo-4', number: 'EXP-2026-0034', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'quotation', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 0, containersCount: 0, totalUsd: 20240, linesJson: line('FIN-TWL-25', 'تواليت فاخر ج ٢٥', 22000, 0.92, { ply: '2', color: 'qc.colors.white', gsm: 25, widthMm: 113 }) },
  { id: 'eo-5', number: 'EXP-2026-0033', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'internal-approval', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 18000, rollsCount: 0, containersCount: 0, totalUsd: 16560, linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 18000, 0.92, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }) },
  { id: 'eo-2', number: 'EXP-2026-0032', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'proforma', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 48, containersCount: 1, totalUsd: 19800, proformaStatus: 'pending', linesJson: line('FIN-TWL-25', 'تواليت فاخر ج ٢٥', 22000, 0.9, { ply: '2', color: 'qc.colors.white', gsm: 25, widthMm: 113 }) },
  { id: 'eo-6', number: 'EXP-2026-0035', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'supply-order', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 12000, rollsCount: 0, containersCount: 0, totalUsd: 11040, proformaStatus: 'approved', linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 12000, 0.92, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }) },
  { id: 'eo-1', number: 'EXP-2026-0031', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'logistics', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, productionDeadline: daysAhead(4), loadingDate: daysAhead(7), totalUsd: 40480, proformaStatus: 'approved', linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 44000, 0.92, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }) },
  { id: 'eo-3', number: 'EXP-2026-0030', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'invoiced', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, loadingDate: daysAgo(9), eInvoiceNumber: 'EINV-88412', totalUsd: 39875, proformaStatus: 'approved', linesJson: line('FIN-SMP-22', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 44000, 0.906, { ply: '2', color: 'qc.colors.white', gsm: 22, widthMm: 160 }) },
];

/** فواتير ضريبية — كل فاتورة تنتظر الإرسال لمنظومة الفاتورة الإلكترونية. */
export const MOCK_TAX_INVOICES: TaxInvoice[] = [
  { id: 'tax-1', number: 'TAX-2026-0455', date: daysAgo(1), customerCode: 'CUS-001', customerName: 'العالمية للورق الصحي', currency: 'EGP', total: 398750, status: 'ready' },
  { id: 'tax-2', number: 'TAX-2026-0456', date: daysAgo(0), customerCode: 'CUS-002', customerName: 'مؤسسة مسك للتجارة والتوريدات', currency: 'EGP', total: 682000, status: 'ready' },
  { id: 'tax-3', number: 'TAX-2026-0450', date: daysAgo(6), customerCode: 'CUS-003', customerName: 'شركة الربيع لمنتجات الورق', currency: 'EGP', total: 263250, status: 'sent', sentAt: daysAgo(5), eInvoiceUid: 'EG-ETA-55301' },
];

const stmtLine = (
  id: string,
  daysBack: number,
  docKey: string,
  docNumber: string,
  description: string,
  debit: number,
  credit: number,
  balance: number,
  reference?: string,
): StatementLine => ({
  id,
  date: daysAgo(daysBack),
  docKey,
  docNumber,
  reference: reference ?? (docKey === 'sales.docs.invoice' ? docNumber : ''),
  description,
  debit,
  credit,
  balance,
});

/** كشف حساب العميل — running balances end exactly at each customer's balance. */
export const MOCK_STATEMENTS: Record<string, StatementLine[]> = {
  'CUS-001': [
    stmtLine('st-01-1', 40, 'sales.docs.opening', '—', 'رصيد أول المدة', 0, 0, 0),
    stmtLine('st-01-2', 1, 'sales.docs.invoice', 'INV-2026-0455', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 398750, 0, 398750),
    stmtLine('st-01-3', 0, 'sales.docs.bank', '25369', 'تحويل بنكي — البنك الأهلي', 0, 398750, 0, 'INV-2026-0455'),
  ],
  'CUS-006': [
    stmtLine('st-e6-1', 40, 'sales.docs.opening', '—', 'Opening balance', 0, 0, 0),
    stmtLine('st-e6-2', 9, 'sales.docs.invoice', 'CI-2026-0031', 'Commercial Invoice — 2 containers', 39875, 0, 39875),
    stmtLine('st-e6-3', 5, 'sales.docs.bank', '26219', 'Swift transfer', 0, 39875, 0, 'CI-2026-0031'),
  ],
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', number: 'INV-2026-0455', kind: 'local', date: daysAgo(1), customerCode: 'CUS-001', customerName: 'العالمية للورق الصحي', currency: 'EGP', exchangeRate: 1, total: 398750, eInvoiceUid: 'EG-EINV-77120', collected: 398750 },
  { id: 'inv-2', number: 'CI-2026-0031', kind: 'commercial', date: daysAgo(9), customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', currency: 'USD', exchangeRate: 48.5, total: 39875, eInvoiceUid: 'EG-EINV-88412', collected: 39875 },
  { id: 'inv-3', number: 'PL-2026-0031', kind: 'packing-list', date: daysAgo(9), customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', currency: 'USD', exchangeRate: 48.5, total: 0, collected: 0 },
];

export function parseSalesLines(raw: unknown): SalesOrderLine[] {
  if (Array.isArray(raw)) return raw as SalesOrderLine[];
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SalesOrderLine[]) : [];
  } catch {
    return [];
  }
}

/** Σ(quantity × pricePerKg) — order total from its priced lines. */
export function salesLinesTotal(lines: SalesOrderLine[]): number {
  return lines.reduce(
    (sum, row) => sum + Number(row.quantity || 0) * Number(row.pricePerKg || 0),
    0,
  );
}

/** Join extra item codes so the work-order / export list still shows one row. */
export function listExportOrders(): ExportOrder[] {
  return MOCK_EXPORT_ORDERS.map((row) => {
    const lines = parseSalesLines(row.linesJson);
    if (!lines.length) {
      return {
        ...row,
        linesJson: row.itemName
          ? JSON.stringify([{ itemCode: row.itemCode, itemName: row.itemName, quantity: row.quantityKg }])
          : row.linesJson,
      };
    }
    return {
      ...row,
      itemName: lines.map((line) => line.itemName || line.itemCode).filter(Boolean).join(' · '),
      itemCode: lines.map((line) => line.itemCode).filter(Boolean).join(', '),
      quantityKg: lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0) || row.quantityKg,
      rollsCount: lines.reduce((sum, line) => sum + Number(line.rolls || 0), 0) || row.rollsCount,
    };
  });
}

export function listWorkOrders(): SalesWorkOrder[] {
  return MOCK_WORK_ORDERS.map((row) => {
    const lines = parseSalesLines(row.linesJson);
    if (!lines.length) {
      return {
        ...row,
        linesJson: JSON.stringify([
          { itemCode: row.itemCode, itemName: row.itemName, quantity: row.quantityKg, specification: String(row.sizeMm || '') },
        ]),
      };
    }
    const first = lines[0];
    return {
      ...row,
      itemName: lines.map((line) => line.itemName || line.itemCode).filter(Boolean).join(' · '),
      itemCode: lines.map((line) => line.itemCode).filter(Boolean).join(', '),
      quantityKg: lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0) || row.quantityKg,
      sizeMm: Number(first?.widthMm || first?.specification) || row.sizeMm,
      ply: first?.ply ?? row.ply,
      color: first?.color ?? row.color,
      gsm: Number(first?.gsm) || row.gsm,
      widthMm: Number(first?.widthMm) || row.widthMm,
      totalPrice: salesLinesTotal(lines) || row.totalPrice,
    };
  });
}
