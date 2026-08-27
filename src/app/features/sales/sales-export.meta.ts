import { ExportDocStage, ExportOrder } from '../../core/models/sales.models';

export const EXPORT_NEXT: Record<ExportDocStage, ExportDocStage | null> = {
  quotation: 'proforma',
  'internal-approval': 'proforma',
  proforma: 'supply-order',
  'supply-order': 'warehouse',
  warehouse: 'production-scheduled',
  'production-scheduled': 'logistics',
  logistics: 'production',
  production: 'issued',
  issued: 'invoiced',
  invoiced: null,
};

export const EXPORT_TONE: Record<ExportDocStage, 'neutral' | 'info' | 'warning' | 'success'> = {
  quotation: 'neutral',
  'internal-approval': 'info',
  proforma: 'info',
  'supply-order': 'info',
  warehouse: 'warning',
  'production-scheduled': 'warning',
  logistics: 'warning',
  production: 'warning',
  issued: 'success',
  invoiced: 'success',
};

export const EXPORT_RANK: Record<ExportDocStage, number> = {
  quotation: 0,
  'internal-approval': 1,
  proforma: 2,
  'supply-order': 3,
  warehouse: 4,
  'production-scheduled': 5,
  logistics: 6,
  production: 7,
  issued: 8,
  invoiced: 9,
};

export function exportLines(row: ExportOrder): { name: string; qty: number }[] {
  try {
    const parsed = JSON.parse(String(row.linesJson || '[]')) as { itemName?: string; quantity?: number }[];
    if (parsed.length) {
      return parsed.map((line) => ({ name: String(line.itemName || ''), qty: Number(line.quantity || 0) }));
    }
  } catch {
    /* header */
  }
  return row.itemName ? [{ name: String(row.itemName), qty: Number(row.quantityKg || 0) }] : [];
}
