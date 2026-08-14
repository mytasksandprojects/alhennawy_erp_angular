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
  shippingLineInvoicesTotal?: number;
  telexReleased: boolean;
  isLate: boolean;
}
