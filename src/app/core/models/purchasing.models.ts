/** إدارة المشتريات — Purchasing domain. */
import { Localized } from './common.models';


export type PurchaseRequestStatus = 'pending' | 'approved' | 'rejected' | 'ordered';
export type PurchaseOrderStatus = 'open' | 'partially-received' | 'received' | 'late' | 'closed';

export interface Supplier extends Localized {
  code: string;
  name: string;
  currency: string;
  balance: number;
  onTimeDeliveryPercent: number;
}

export interface PurchaseRequestLine {
  itemCode: string;
  itemName: string;
  quantity: number;
  unitKey: string;
  specification?: string;
}

export interface PurchaseRequest {
  id: string;
  number: string;
  date: string;
  requestingDepartmentKey: string;
  status: PurchaseRequestStatus;
  itemName?: string;
  quantity?: number;
  /** Form draft of `lines` as JSON — not stored as its own column. */
  linesJson?: string;
  lines: PurchaseRequestLine[];
}

export interface PurchaseOrder {
  id: string;
  number: string;
  date: string;
  supplierCode: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  currency: string;
  /** Rate to EGP — prefilled from the currency default, editable per order. */
  exchangeRate?: number;
  totalValue: number;
  expectedDelivery: string;
  leadTimeDays?: number;
  requestId?: string;
}

export interface SupplierQuotation {
  id: string;
  requestId: string;
  supplierCode: string;
  supplierName: string;
  totalValue: number;
  currency: string;
  exchangeRate?: number;
  deliveryDays: number;
  technicalScore: number;
  selected: boolean;
}
