/** إدارة المخازن — Warehouse domain. */
import { Localized } from './common.models';


export type WarehouseKind =
  | 'spare-parts'
  | 'chemicals'
  | 'lab-virtual'
  | 'grease-oils'
  | 'dasht-raw'
  | 'raw-materials'
  | 'supplies'
  | 'finished-first'
  | 'finished-second';

export interface Warehouse extends Localized {
  id: string;
  nameKey: string;
  kind: WarehouseKind;
  occupancyPercent: number;
  itemsCount: number;
  totalValue: number;
  /** When set, items added here must pick a main group and a sub-group. */
  requireGroups?: boolean;
}

export interface StockItem extends Localized {
  code: string;
  /** SUB code parent, when created for internal transfer weighings. */
  parentCode?: string;
  name: string;
  warehouseId: string;
  /** مجموعة أساسية from the spare-parts tree. */
  groupKey?: string;
  /** مجموعة فرعية — parent is groupKey. */
  subGroupKey?: string;
  unitKey: string;
  quantity: number;
  minimumStock: number;
  unitCost: number;
  isBelowMinimum: boolean;
  /** Product spec — الطبقات / اللون / الجراماج / العرض (finished goods). */
  ply?: string;
  color?: string;
  gsm?: number;
  widthMm?: number;
  /** Free-text bin / section, e.g. «سيكشن أ — الرف 3». */
  location?: string;
  /** تاريخ آخر حركة — date of last movement. */
  movementDate?: string;
  /** رصيد أول المدة — beginning balance. */
  beginningBalance?: number;
}

export type MovementType =
  | 'receipt'
  | 'issue'
  | 'transfer'
  | 'adjustment'
  | 'warehouse-return'
  | 'supplier-return';

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
  /** Issue destination: محلي → work order • تصدير → export order + container. */
  toType?: 'local' | 'export';
  /** أمر الشغل / أمر التصدير the issue was made for. */
  orderNumber?: string;
  containerNumber?: string;
  referenceKey?: string;
  reference?: string;
  byUser: string;
  linesJson?: string;
}

/** أدوات مسلّمة للفنيين وتعود للمخزن. */
export interface ToolCustody {
  id: string;
  number: string;
  itemCode?: string;
  itemName: string;
  warehouseId: string;
  holderName: string;
  issuedAt: string;
  returnedAt?: string;
  status: 'out' | 'returned';
}

/** جرد كمية النظام مقابل العد الفعلي. */
export interface StockCount {
  id: string;
  number: string;
  date: string;
  warehouseId: string;
  itemCode: string;
  itemName: string;
  systemQty: number;
  countedQty: number;
  difference: number;
}
