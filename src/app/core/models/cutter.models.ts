/**
 * المقص — Cutter/rewinder domain.
 * Each produced roll gets a weighing, a size and a printable label
 * (the card glued on the roll) carrying a barcode with serial.
 */

export interface CutterRoll {
  id: string;
  /** Barcode value printed on the label, e.g. "8444/268621". */
  barcode: string;
  serial: number;
  batchNo: string;
  /** Product / spec name shown on the label (per customer spec code). */
  specCode: string;
  specName: string;
  customerCode?: string;
  weightKg: number;
  gsm: number;
  rollWidthMm: number;
  diameterMm: number;
  grade: 'first' | 'second';
  notes?: string;
  addUser: string;
  createdAt: string;
  printedCount: number;
}

export interface CutterRollCreateRequest {
  specCode: string;
  customerCode?: string;
  weightKg: number;
  gsm: number;
  rollWidthMm: number;
  diameterMm: number;
  grade: 'first' | 'second';
  notes?: string;
}

/** Customer specification codes agreed with Quality. */
export interface CustomerSpec {
  specCode: string;
  specName: string;
  customerCode: string;
  gsm: number;
  rollWidthMm: number;
  attachmentUrl?: string;
}
