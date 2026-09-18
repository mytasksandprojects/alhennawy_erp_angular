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
  /** Number of plies (الطبقات) carried over from the production order. */
  ply?: string;
  /** Comma-separated production order numbers this roll was cut for. */
  orderNumbers?: string;
  /** Serial of the parent batch the sub-roll was cut from (== serial for standalone rolls). */
  mainSerial?: number;
  /** Position inside the parent batch (1..n) for sub-rolls. */
  subIndex?: number;
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
  ply?: string;
  orderNumbers?: string;
  mainSerial?: number;
  subIndex?: number;
  weightKg: number;
  gsm: number;
  rollWidthMm: number;
  diameterMm: number;
  grade: 'first' | 'second';
  notes?: string;
}

/** One sub-roll inside a multi-roll registration (بكرة فرعية). */
export interface CutterRollBatchEntry {
  weightKg: number;
  gsm: number;
  rollWidthMm: number;
  diameterMm: number;
  grade: 'first' | 'second';
}

/**
 * Registering a batch of sub-rolls in one submit: the batch gets a main
 * serial, every entry gets its own serial and its own printed label.
 */
export interface CutterRollBatchCreateRequest {
  specCode: string;
  customerCode?: string;
  ply?: string;
  orderNumbers?: string;
  notes?: string;
  entries: CutterRollBatchEntry[];
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
