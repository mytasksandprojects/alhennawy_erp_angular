import { ExportDocStage, ExportOrder, SalesOrderLine } from '../../core/models/sales.models';

/**
 * Export pipeline — production is scheduled and approved in الإنتاج before
 * logistics picks a loading date, so production comes before logistics.
 */
export const EXPORT_NEXT: Record<ExportDocStage, ExportDocStage | null> = {
  quotation: 'proforma',
  'internal-approval': 'proforma',
  proforma: 'supply-order',
  'supply-order': 'warehouse',
  warehouse: 'production-scheduled',
  'production-scheduled': 'production',
  production: 'logistics',
  logistics: 'issued',
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
  production: 'warning',
  logistics: 'warning',
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
  production: 6,
  logistics: 7,
  issued: 8,
  invoiced: 9,
};

export function exportLines(row: ExportOrder): SalesOrderLine[] {
  try {
    const parsed = JSON.parse(String(row.linesJson || '[]')) as SalesOrderLine[];
    if (parsed.length) return parsed;
  } catch {
    /* header */
  }
  return row.itemName
    ? [{ itemName: String(row.itemName), quantity: Number(row.quantityKg || 0) }]
    : [];
}
