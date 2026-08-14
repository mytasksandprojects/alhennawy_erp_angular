/** إدارة المخازن — Warehouse domain. */
import { Localized } from './common.models';


export type WarehouseKind =
  | 'spare-parts'
  | 'chemicals'
  | 'lab-virtual'
  | 'grease-oils'
  | 'dasht-raw'
  | 'finished-first'
  | 'finished-second';

export interface Warehouse extends Localized {
  id: string;
  nameKey: string;
  kind: WarehouseKind;
  occupancyPercent: number;
  itemsCount: number;
  totalValue: number;
}

export interface StockItem extends Localized {
  code: string;
  /** SUB code parent, when created for internal transfer weighings. */
  parentCode?: string;
  name: string;
  warehouseId: string;
  unitKey: string;
  quantity: number;
  minimumStock: number;
  unitCost: number;
  isBelowMinimum: boolean;
}

export type MovementType = 'receipt' | 'issue' | 'transfer' | 'adjustment';

export interface StockMovement {
  id: string;
  number: string;
  date: string;
  type: MovementType;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitKey: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  referenceKey?: string;
  reference?: string;
  byUser: string;
}
