import {
  CustomerSpec,
  CutterRoll,
  CutterRollCreateRequest,
} from '../../core/models/cutter.models';
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
    customerCode: 'CUS-014',
    gsm: 22,
    rollWidthMm: 160,
    attachmentUrl: 'assets/specs/smp-22.pdf',
  },
  {
    specCode: 'TWL-25',
    specName: 'تواليت فاخر ج ٢٥',
    customerCode: 'CUS-009',
    gsm: 25,
    rollWidthMm: 113,
  },
  {
    specCode: 'NPK-18',
    specName: 'نابكن سادة ج ١٨',
    customerCode: 'CUS-021',
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
    customerCode: 'CUS-014',
    weightKg: 269,
    gsm: 22,
    rollWidthMm: 45,
    diameterMm: 113,
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
    customerCode: 'CUS-014',
    weightKg: 474,
    gsm: 22,
    rollWidthMm: 160,
    diameterMm: 113,
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

export function createRoll(body: unknown): CutterRoll {
  const req = body as CutterRollCreateRequest;
  const spec = MOCK_SPECS.find((s) => s.specCode === req.specCode);
  if (!spec) throw new MockApiError(400, 'unknown-spec');
  if (req.weightKg <= 0 || req.gsm <= 0 || req.rollWidthMm <= 0) {
    throw new MockApiError(400, 'invalid-roll');
  }
  const serial = rollSerial++;
  const batchNo = String(8000 + Math.floor(Math.random() * 9999));
  const roll: CutterRoll = {
    id: `r-${serial}`,
    barcode: `${batchNo}/${serial}`,
    serial,
    batchNo,
    specCode: spec.specCode,
    specName: spec.specName,
    customerCode: req.customerCode ?? spec.customerCode,
    weightKg: req.weightKg,
    gsm: req.gsm,
    rollWidthMm: req.rollWidthMm,
    diameterMm: req.diameterMm,
    grade: req.grade,
    notes: req.notes,
    addUser: 'STORE1',
    createdAt: new Date().toISOString(),
    printedCount: 0,
  };
  MOCK_ROLLS.unshift(roll);
  return roll;
}

export function registerPrint(rollId: string): CutterRoll {
  const roll = MOCK_ROLLS.find((r) => r.id === rollId);
  if (!roll) throw new MockApiError(404, 'not-found');
  roll.printedCount += 1;
  return roll;
}
