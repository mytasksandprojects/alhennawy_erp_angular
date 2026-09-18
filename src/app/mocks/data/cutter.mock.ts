import {
  CustomerSpec,
  CutterRoll,
  CutterRollBatchCreateRequest,
  CutterRollCreateRequest,
} from '../../core/models/cutter.models';
import { TechDataSheet } from '../../core/models/quality.models';
import { MOCK_TECH_SHEETS } from './quality.mock';
import { MockApiError } from '../mock-backend.interceptor';

/**
 * MOCK LAYER — stateful مقص (cutter) simulation.
 * Printing a customer-spec label immediately deducts the roll from the
 * customer quantity (BRD rule), represented here by `printedCount`.
 */
let rollSerial = 268623;

export const MOCK_SPECS: CustomerSpec[] = [
  {
    specCode: 'SMP-22',
    specName: 'سوبر مكس مطبخ ط ٢ ج ٢٢',
    customerCode: 'CUS-001',
    gsm: 22,
    rollWidthMm: 160,
    attachmentUrl: 'assets/specs/smp-22.pdf',
  },
  {
    specCode: 'TWL-25',
    specName: 'تواليت فاخر ج ٢٥',
    customerCode: 'CUS-002',
    gsm: 25,
    rollWidthMm: 113,
  },
  {
    specCode: 'NPK-18',
    specName: 'نابكن سادة ج ١٨',
    customerCode: 'CUS-003',
    gsm: 18,
    rollWidthMm: 250,
  },
];

export const MOCK_ROLLS: CutterRoll[] = [
  {
    id: 'r-268621',
    barcode: '8444/268621',
    serial: 268621,
    batchNo: '8444',
    specCode: 'SMP-22',
    specName: 'سوبر مكس مطبخ ط ٢ ج ٢٢',
    customerCode: 'CUS-001',
    weightKg: 269,
    gsm: 22,
    rollWidthMm: 45,
    diameterMm: 113,
    ply: '2',
    orderNumbers: 'PRD-2026-0221',
    mainSerial: 268621,
    subIndex: 1,
    grade: 'first',
    notes: 'L2+GN',
    addUser: 'STORE1',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    printedCount: 1,
  },
  {
    id: 'r-268622',
    barcode: '17022/268622',
    serial: 268622,
    batchNo: '17022',
    specCode: 'SMP-22',
    specName: 'سوبر مكس مطبخ ط ٢ ج ٢٢',
    customerCode: 'CUS-001',
    weightKg: 474,
    gsm: 22,
    rollWidthMm: 160,
    diameterMm: 113,
    ply: '2',
    orderNumbers: 'PRD-2026-0221',
    mainSerial: 268621,
    subIndex: 2,
    grade: 'first',
    notes: 'L2+R1',
    addUser: 'STORE1',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    printedCount: 1,
  },
];

export function listRolls(query: URLSearchParams): CutterRoll[] {
  const grade = query.get('grade');
  return MOCK_ROLLS
    .filter((r) => !grade || r.grade === grade)
    .sort((a, b) => b.serial - a.serial);
}

/** Serial the next roll will get — previewed on the registration form. */
export function peekRollSerial(): { serial: number } {
  return { serial: rollSerial };
}

/**
 * Every produced roll is registered in Quality's technical data sheet
 * list so the lab can fill in the measured values per roll serial.
 */
function registerTechSheet(roll: CutterRoll): void {
  const sheet: TechDataSheet = {
    id: `tds-r-${roll.serial}`,
    specCode: roll.specCode,
    specName: roll.specName,
    gsm: roll.gsm,
    rollSerial: roll.serial,
    ply: roll.ply,
    thickness: 0,
    brightnessPercent: 0,
    tensileMd: 0,
    tensileCd: 0,
  };
  MOCK_TECH_SHEETS.unshift(sheet);
}

function buildRoll(
  spec: CustomerSpec,
  base: Pick<CutterRoll, 'weightKg' | 'gsm' | 'rollWidthMm' | 'diameterMm' | 'grade'>,
  extra: {
    serial: number;
    batchNo: string;
    customerCode?: string;
    ply?: string;
    orderNumbers?: string;
    mainSerial?: number;
    subIndex?: number;
    notes?: string;
  },
): CutterRoll {
  const roll: CutterRoll = {
    id: `r-${extra.serial}`,
    barcode: `${extra.batchNo}/${extra.serial}`,
    serial: extra.serial,
    batchNo: extra.batchNo,
    specCode: spec.specCode,
    specName: spec.specName,
    customerCode: extra.customerCode ?? spec.customerCode,
    ply: extra.ply,
    orderNumbers: extra.orderNumbers,
    mainSerial: extra.mainSerial ?? extra.serial,
    subIndex: extra.subIndex ?? 1,
    weightKg: base.weightKg,
    gsm: base.gsm,
    rollWidthMm: base.rollWidthMm,
    diameterMm: base.diameterMm,
    grade: base.grade,
    notes: extra.notes,
    addUser: 'STORE1',
    createdAt: new Date().toISOString(),
    printedCount: 0,
  };
  MOCK_ROLLS.unshift(roll);
  registerTechSheet(roll);
  return roll;
}

export function createRoll(body: unknown): CutterRoll {
  const req = body as CutterRollCreateRequest;
  const spec = MOCK_SPECS.find((s) => s.specCode === req.specCode);
  if (!spec) throw new MockApiError(400, 'unknown-spec');
  if (req.weightKg <= 0 || req.gsm <= 0 || req.rollWidthMm <= 0) {
    throw new MockApiError(400, 'invalid-roll');
  }
  const serial = rollSerial++;
  const batchNo = String(8000 + Math.floor(Math.random() * 9999));
  return buildRoll(spec, req, {
    serial,
    batchNo,
    customerCode: req.customerCode,
    ply: req.ply,
    orderNumbers: req.orderNumbers,
    mainSerial: req.mainSerial ?? serial,
    subIndex: req.subIndex ?? 1,
    notes: req.notes,
  });
}

/**
 * Multi-roll registration: one main serial for the batch + one serial
 * per sub-roll entry. Each sub-roll is printable on its own label and
 * registered in the quality technical data sheet.
 */
export function createRolls(body: unknown): CutterRoll[] {
  const req = body as CutterRollBatchCreateRequest;
  const spec = MOCK_SPECS.find((s) => s.specCode === req.specCode);
  if (!spec) throw new MockApiError(400, 'unknown-spec');
  const entries = req.entries ?? [];
  if (!entries.length) throw new MockApiError(400, 'invalid-roll');
  for (const entry of entries) {
    if (entry.weightKg <= 0 || entry.gsm <= 0 || entry.rollWidthMm <= 0) {
      throw new MockApiError(400, 'invalid-roll');
    }
  }
  const mainSerial = rollSerial++;
  const batchNo = String(8000 + Math.floor(Math.random() * 9999));
  return entries.map((entry, index) =>
    buildRoll(spec, entry, {
      serial: rollSerial++,
      batchNo,
      customerCode: req.customerCode,
      ply: req.ply,
      orderNumbers: req.orderNumbers,
      mainSerial,
      subIndex: index + 1,
      notes: req.notes,
    }),
  );
}

export function registerPrint(rollId: string): CutterRoll {
  const roll = MOCK_ROLLS.find((r) => r.id === rollId);
  if (!roll) throw new MockApiError(404, 'not-found');
  roll.printedCount += 1;
  return roll;
}
