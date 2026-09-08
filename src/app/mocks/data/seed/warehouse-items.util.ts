import { StockItem } from '../../../core/models/warehouse.models';

/** Compact factory for Excel-seeded stock rows. */
export function stock(
  code: string,
  name: string,
  nameEn: string,
  warehouseId: string,
  groupKey: string,
  subGroupKey: string,
  unitKey: string,
): StockItem {
  return {
    code,
    name,
    name_en: nameEn,
    warehouseId,
    groupKey: groupKey || undefined,
    subGroupKey: subGroupKey || undefined,
    unitKey,
    quantity: 1,
    minimumStock: 0,
    unitCost: 0,
    isBelowMinimum: false,
  };
}
