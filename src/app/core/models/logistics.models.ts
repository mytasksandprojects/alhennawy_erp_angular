/** إدارة اللوجيستيك — Import & export shipments. */

export type ImportStage =
  | 'rfq'
  | 'proforma'
  | 'acid'
  | 'cargox'
  | 'form4'
  | 'customs'
  | 'warehouse-receipt'
  | 'finance-costing'
  | 'closed';

export type ExportShipmentStage =
  | 'booking'
  | 'loading'
  | 'shipped'
  | 'documents'
  | 'delivered'
  | 'closed';

export interface ImportShipment {
  id: string;
  number: string;
  supplierCode: string;
  supplierName: string;
  stage: ImportStage;
  acidNo?: string;
  releasePermitNo?: string;
  releasePermitDate?: string;
  customsNameKey?: string;
  originPort?: string;
  arrivalPort?: string;
  etaDate?: string;
  isLate: boolean;
  costs: ShipmentCost[];
}

export interface ShipmentCost {
  typeKey: string;
  amount: number;
  currency: string;
}

export interface ExportShipment {
  id: string;
  number: string;
  customerCode: string;
  customerName: string;
  stage: ExportShipmentStage;
  containersCount: number;
  vessel?: string;
  portKey?: string;
  loadingDate?: string;
  /** ميناء الشحن / ميناء الوصول / موعد غلق المركب / الوصول المتوقع / وكيل الشحن. */
  originPort?: string;
  arrivalPort?: string;
  cutoffTime?: string;
  etaDate?: string;
  shippingAgent?: string;
  shippingLineInvoicesTotal?: number;
  telexReleased: boolean;
  isLate: boolean;
}

/**
 * باكينج ليست — derived from إذون الصرف of the warehouse: issue movements
 * destined to an export order, grouped per (order, container number).
 */
export interface PackingList {
  id: string;
  number: string;
  /** أمر التصدير this packing list belongs to. */
  orderNumber: string;
  customerName: string;
  containerNumber: string;
  /** إذن الصرف numbers merged into this list. */
  issueNumbers: string;
  itemsSummary?: string;
  itemsCount: number;
  totalQuantity: number;
  unitKey?: string;
  date: string;
}
