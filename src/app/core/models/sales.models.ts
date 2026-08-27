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
  specAttachmentUrl?: string;
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
  /** JSON cart of extra item codes — same shape as purchase request lines. */
  linesJson?: string;
  status: WorkOrderStatus;
  currency?: string;
  /** Rate to EGP — prefilled from the currency default, editable per order. */
  exchangeRate?: number;
  availableFromStockKg: number;
  toProduceKg: number;
  /** Only sent by the API when the user has `finance.viewPrices`. */
  agreedPrice?: number;
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
