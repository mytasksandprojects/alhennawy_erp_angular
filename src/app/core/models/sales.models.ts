/** المبيعات — Sales domain (local + export). */
import { Localized } from './common.models';


export type WorkOrderStatus =
  | 'new'
  | 'warehouse-check'
  | 'partially-fulfilled'
  | 'in-production'
  | 'ready'
  | 'late'
  | 'invoiced'
  | 'closed';

export type ExportDocStage =
  | 'quotation'
  | 'internal-approval'
  | 'proforma'
  | 'supply-order'
  | 'warehouse'
  | 'production-scheduled'
  | 'logistics'
  | 'production'
  | 'issued'
  | 'invoiced';

export interface Customer extends Localized {
  code: string;
  name: string;
  region: string;
  currency: string;
  balance: number;
  /** Local customers (EGP) appear in work orders; export ones in the export pipeline. */
  channel: 'local' | 'export';
  specAttachmentUrl?: string;
}

/** Rich order line — each entry carries its own spec and pricing. */
export interface SalesOrderLine {
  itemCode?: string;
  itemName: string;
  ply?: string;
  color?: string;
  widthMm?: number;
  gsm?: number;
  quantity?: number;
  pricePerKg?: number;
  /** Rolls requested for this line/size at the warehouse step. */
  rolls?: number;
  specification?: string;
  unitKey?: string;
  available?: number;
  toProduce?: number;
}

export interface SalesWorkOrder {
  id: string;
  number: string;
  date: string;
  channel: 'local' | 'export';
  customerCode: string;
  customerName: string;
  itemCode: string;
  itemName: string;
  quantityKg: number;
  sizeMm: number;
  mixType?: string;
  productName?: string;
  parentFamily?: string;
  ply?: string;
  color?: string;
  gsm?: number;
  widthMm?: number;
  /** JSON cart of extra item codes — same shape as purchase request lines. */
  linesJson?: string;
  status: WorkOrderStatus;
  currency?: string;
  /** Rate to EGP — prefilled from the currency default, editable per order. */
  exchangeRate?: number;
  availableFromStockKg: number;
  toProduceKg: number;
  /** الكمية المتاحة خُصمت فعليًا من المخزن — لا تُحسب حجزًا مرة أخرى. */
  stockDeducted?: boolean;
  /** Only sent by the API when the user has `finance.viewPrices`. */
  agreedPrice?: number;
  /** Σ(quantity × pricePerKg) over `linesJson` — sales-entered pricing. */
  totalPrice?: number;
  collectionStatusKey: string;
  collectionPercent?: number;
  collectionAmount?: number;
}

export interface ExportOrder {
  id: string;
  number: string;
  customerCode: string;
  customerName: string;
  stage: ExportDocStage;
  itemCode?: string;
  itemName?: string;
  quantityKg?: number;
  /** JSON cart — same shape as work-order / purchase-request lines. */
  linesJson?: string;
  availableFromStockKg?: number;
  toProduceKg?: number;
  rollsCount: number;
  containersCount: number;
  productionDeadline?: string;
  loadingDate?: string;
  eInvoiceNumber?: string;
  totalUsd?: number;
  /** طلب تجريبي — flagged before the proforma is issued. */
  trialOrder?: boolean;
  /** Proforma must be approved before it can be printed or advanced. */
  proformaStatus?: 'pending' | 'approved' | 'rejected';
  /** Linked production order (auto-created at the production step). */
  productionOrderId?: string;
  /** Date set by Production when it approves the linked order. */
  productionDate?: string;
  /** Request to move the loading date — approved/rejected by Production. */
  requestedLoadingDate?: string;
  loadingRequestStatus?: 'pending' | 'approved' | 'rejected';
  /** الكمية المتاحة خُصمت فعليًا من المخزن — لا تُحسب حجزًا مرة أخرى. */
  stockDeducted?: boolean;
}

/** فاتورة ضريبية — queued for the Egyptian Tax Authority e-invoice API. */
export interface TaxInvoice {
  id: string;
  number: string;
  date: string;
  customerCode: string;
  customerName: string;
  currency: string;
  total: number;
  /** ready → waiting to be sent; sent → submitted to the ETA portal. */
  status: 'ready' | 'sent';
  sentAt?: string;
  eInvoiceUid?: string;
}

/** إعدادات المبيعات — persisted per-company sales preferences. */
export interface SalesSettings {
  id: string;
  /** Warehouses whose items appear in order item dropdowns (comma-joined ids). */
  warehouseIds: string;
  termsConditions: string;
  bankInfo: string;
  paymentOptions: string;
  proformaExpiryDays: number;
}

/** كشف حساب العميل — one statement line with a running balance. */
export interface StatementLine {
  id: string;
  date: string;
  /** Document type (sales invoice / bank transaction / opening balance). */
  docKey: string;
  docNumber: string;
  /** Invoice / customer invoice number shown as the statement reference. */
  reference?: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Invoice {
  id: string;
  number: string;
  kind: 'commercial' | 'local' | 'packing-list';
  date: string;
  customerCode: string;
  customerName: string;
  currency: string;
  exchangeRate?: number;
  total: number;
  eInvoiceUid?: string;
  collected: number;
}
