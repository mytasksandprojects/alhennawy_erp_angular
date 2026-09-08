import {
  Customer,
  ExportOrder,
  Invoice,
  SalesWorkOrder,
  StatementLine,
} from '../../core/models/sales.models';
import { SEED_CUSTOMERS } from './seed/customers.seed';

/** MOCK LAYER — sales (local work orders + export pipeline). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_CUSTOMERS: Customer[] = SEED_CUSTOMERS;

const qc = (
  mix: 'mixed' | 'pure',
  product: string,
  parent: string,
  ply: string,
  gsm: number,
  width: number,
) => ({
  mixType: `qc.mix.${mix}`,
  productName: product,
  parentFamily: `qc.parents.${parent}`,
  ply,
  color: 'qc.colors.white',
  gsm,
  widthMm: width,
  sizeMm: width,
});

export const MOCK_WORK_ORDERS: SalesWorkOrder[] = [
  { id: 'wo-1', number: 'SO-2026-0118', date: daysAgo(1), channel: 'local', customerCode: 'CUS-001', customerName: 'العالمية للورق الصحي', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 14500, status: 'invoiced', availableFromStockKg: 14500, toProduceKg: 0, currency: 'EGP', exchangeRate: 1, agreedPrice: 27.5, collectionStatusKey: 'sales.collection.partial', collectionPercent: 50, ...qc('mixed', 'سوبر مكس مطبخ', 'kitchenTowel', '2', 22, 160) },
  { id: 'wo-2', number: 'SO-2026-0119', date: daysAgo(0), channel: 'local', customerCode: 'CUS-002', customerName: 'مؤسسة مسك للتجارة والتوريدات', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, status: 'in-production', availableFromStockKg: 8250, toProduceKg: 13750, currency: 'EGP', exchangeRate: 1, agreedPrice: 31, collectionStatusKey: 'sales.collection.deposit', collectionAmount: 200000, ...qc('pure', 'تواليت فاخر', 'toilet', '2', 25, 113) },
  { id: 'wo-3', number: 'SO-2026-0120', date: daysAgo(0), channel: 'local', customerCode: 'CUS-003', customerName: 'شركة الربيع لمنتجات الورق', itemCode: 'FIN-NPK-18', itemName: 'نابكن سادة ج ١٨', quantityKg: 9000, status: 'late', availableFromStockKg: 0, toProduceKg: 9000, currency: 'EGP', exchangeRate: 1, agreedPrice: 29.25, collectionStatusKey: 'sales.collection.pending', ...qc('pure', 'نابكن سادة', 'napkin', '1', 18, 250) },
  { id: 'wo-4', number: 'SO-2026-0117', date: daysAgo(4), channel: 'export', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, status: 'ready', availableFromStockKg: 44000, toProduceKg: 0, currency: 'USD', exchangeRate: 48.5, agreedPrice: 0.92, collectionStatusKey: 'sales.collection.paid', ...qc('mixed', 'Kitchen Super Mix', 'kitchenTowel', '2', 22, 160) },
];

export const MOCK_EXPORT_ORDERS: ExportOrder[] = [
  { id: 'eo-4', number: 'EXP-2026-0034', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'quotation', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 0, containersCount: 0, totalUsd: 20240 },
  { id: 'eo-5', number: 'EXP-2026-0033', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'internal-approval', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 18000, rollsCount: 0, containersCount: 0, totalUsd: 16560 },
  { id: 'eo-2', number: 'EXP-2026-0032', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'proforma', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantityKg: 22000, rollsCount: 48, containersCount: 1, totalUsd: 19800 },
  { id: 'eo-6', number: 'EXP-2026-0035', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'supply-order', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 12000, rollsCount: 0, containersCount: 0, totalUsd: 11040 },
  { id: 'eo-1', number: 'EXP-2026-0031', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'logistics', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, productionDeadline: daysAhead(4), loadingDate: daysAhead(7), totalUsd: 40480 },
  { id: 'eo-3', number: 'EXP-2026-0030', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'invoiced', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, rollsCount: 96, containersCount: 2, loadingDate: daysAgo(9), eInvoiceNumber: 'EINV-88412', totalUsd: 39875 },
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
    line('st-01-1', 40, 'sales.docs.opening', '—', 'رصيد أول المدة', 0, 0, 0),
    line('st-01-2', 1, 'sales.docs.invoice', 'INV-2026-0455', 'سوبر مكس مطبخ ط ٢ ج ٢٢', 398750, 0, 398750),
    line('st-01-3', 0, 'sales.docs.bank', '25369', 'تحويل بنكي — البنك الأهلي', 0, 398750, 0, 'INV-2026-0455'),
  ],
  'CUS-006': [
    line('st-e6-1', 40, 'sales.docs.opening', '—', 'Opening balance', 0, 0, 0),
    line('st-e6-2', 9, 'sales.docs.invoice', 'CI-2026-0031', 'Commercial Invoice — 2 containers', 39875, 0, 39875),
    line('st-e6-3', 5, 'sales.docs.bank', '26219', 'Swift transfer', 0, 39875, 0, 'CI-2026-0031'),
  ],
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', number: 'INV-2026-0455', kind: 'local', date: daysAgo(1), customerCode: 'CUS-001', customerName: 'العالمية للورق الصحي', currency: 'EGP', exchangeRate: 1, total: 398750, eInvoiceUid: 'EG-EINV-77120', collected: 398750 },
  { id: 'inv-2', number: 'CI-2026-0031', kind: 'commercial', date: daysAgo(9), customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', currency: 'USD', exchangeRate: 48.5, total: 39875, eInvoiceUid: 'EG-EINV-88412', collected: 39875 },
  { id: 'inv-3', number: 'PL-2026-0031', kind: 'packing-list', date: daysAgo(9), customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', currency: 'USD', exchangeRate: 48.5, total: 0, collected: 0 },
];

type Line = { itemCode?: string; itemName?: string; quantity?: number; specification?: string };

function parseLines(raw: unknown): Line[] {
  if (Array.isArray(raw)) return raw as Line[];
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Line[]) : [];
  } catch {
    return [];
  }
}

/** Join extra item codes so the work-order / export list still shows one row. */
export function listExportOrders(): ExportOrder[] {
  return MOCK_EXPORT_ORDERS.map((row) => {
    const lines = parseLines(row.linesJson);
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
    };
  });
}

export function listWorkOrders(): SalesWorkOrder[] {
  return MOCK_WORK_ORDERS.map((row) => {
    const lines = parseLines(row.linesJson);
    if (!lines.length) {
      return {
        ...row,
        linesJson: JSON.stringify([
          { itemCode: row.itemCode, itemName: row.itemName, quantity: row.quantityKg, specification: String(row.sizeMm || '') },
        ]),
      };
    }
    return {
      ...row,
      itemName: lines.map((line) => line.itemName || line.itemCode).filter(Boolean).join(' · '),
      itemCode: lines.map((line) => line.itemCode).filter(Boolean).join(', '),
      quantityKg: lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0) || row.quantityKg,
      sizeMm: Number(lines[0]?.specification) || row.sizeMm,
    };
  });
}
