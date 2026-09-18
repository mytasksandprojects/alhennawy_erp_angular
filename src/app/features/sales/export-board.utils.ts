import { CutterRoll } from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';
import { ExportOrder, SalesOrderLine } from '../../core/models/sales.models';

export function lineTotal(line: SalesOrderLine): number {
  return Number(line.quantity || 0) * Number(line.pricePerKg || 0);
}

export function numFrom(event: Event): number {
  const parsed = Number((event.target as HTMLInputElement).value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function proformaTone(row: ExportOrder): 'warning' | 'success' | 'danger' | 'neutral' {
  return row.proformaStatus === 'approved'
    ? 'success'
    : row.proformaStatus === 'rejected'
      ? 'danger'
      : 'warning';
}

export function requestTone(row: ExportOrder): 'warning' | 'success' | 'danger' | 'neutral' {
  return row.loadingRequestStatus === 'approved'
    ? 'success'
    : row.loadingRequestStatus === 'rejected'
      ? 'danger'
      : 'warning';
}

/** Rolls on hand matching the line's item/spec — shown read-only. */
export function availableRolls(rolls: CutterRoll[], line: SalesOrderLine): number {
  return rolls.filter(
    (roll) =>
      roll.specName === line.itemName ||
      (!!line.gsm && !!line.widthMm && roll.gsm === line.gsm && roll.rollWidthMm === line.widthMm),
  ).length;
}

/** The linked production order must be approved before production starts. */
export function linkedApproved(orders: ProductionOrder[], row: ExportOrder): boolean {
  const order = orders.find(
    (item) => item.id === row.productionOrderId || item.workOrderNumber === row.number,
  );
  return !!order && order.approvalStatus === 'approved';
}
