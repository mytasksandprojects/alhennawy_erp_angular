/** مصنع الكيماويات — its own output, staff and purchases. */
import { Localized } from './common.models';


/** كميات إنتاج مصنع الكيماويات */
export interface ChemicalsOutput extends Localized {
  id: string;
  date: string;
  product: string;
  quantityKg: number;
  batchNumber: string;
  notes?: string;
}

/** العاملون بمصنع الكيماويات */
export interface ChemicalsStaff extends Localized {
  id: string;
  code: string;
  name: string;
  role: string;
  phone?: string;
  salary?: number;
  status: 'active' | 'on-leave' | 'terminated' | 'probation';
  photoUrl?: string;
}

/** مشتريات المصنع — خامات أو تشغيلية */
export interface ChemicalsPurchase {
  id: string;
  date: string;
  item: string;
  supplier: string;
  quantity?: number;
  unit?: string;
  total: number;
  currency: string;
  /** Rate to EGP — prefilled from the currency default, editable. */
  exchangeRate?: number;
  status: 'ordered' | 'received' | 'paid';
}
