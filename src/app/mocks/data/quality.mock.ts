import {
  ChemicalBatchConsumption,
  DashtInspection,
  MaintenanceRecord,
  MaterialInspection,
  ProductionOrder,
  TechDataSheet,
} from '../../core/models/quality.models';

/** MOCK LAYER — quality inspections and production orders. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_DASHT_INSPECTIONS: DashtInspection[] = [
  { id: 'di-1', weighingSerial: 3018, date: daysAgo(1), supplierCode: 'SUP-001', supplierName: 'مورد دشت المنوفية', gradeKey: 'quality.grades.first', discountPercent: 3, firstWeightKg: 24500, secondWeightKg: 9200, netWeightKg: 15300, accepted: true, inspector: 'مصطفى رمضان' },
  { id: 'di-2', weighingSerial: 3020, date: daysAgo(0), supplierCode: 'SUP-003', supplierName: 'مورد خامات السادات', gradeKey: 'quality.grades.second', discountPercent: 12, firstWeightKg: 21750, accepted: true, inspector: 'مصطفى رمضان' },
  { id: 'di-3', weighingSerial: 3012, date: daysAgo(3), supplierCode: 'SUP-003', supplierName: 'مورد خامات السادات', gradeKey: 'quality.grades.rejected', discountPercent: 0, firstWeightKg: 18400, secondWeightKg: 9100, netWeightKg: 9300, accepted: false, inspector: 'مصطفى رمضان' },
];

export const MOCK_MATERIAL_INSPECTIONS: MaterialInspection[] = [
  { id: 'mi-1', date: daysAgo(0), materialKey: 'quality.materials.stretch', batchNo: 'STR-2026-88', result: 'accepted' },
  { id: 'mi-2', date: daysAgo(0), materialKey: 'quality.materials.core', batchNo: 'COR-2026-41', result: 'accepted' },
  { id: 'mi-3', date: daysAgo(2), materialKey: 'quality.materials.chemicals', batchNo: 'CHM-2026-19', result: 'rejected', notes: 'كثافة خارج الحدود' },
];

export const MOCK_CHEMICAL_CONSUMPTION: ChemicalBatchConsumption[] = [
  { id: 'cc-1', date: daysAgo(0), tankId: 'TANK-1', chemicalName: 'نشا كاتيوني', quantityKg: 260, costPerKg: 42, totalCost: 10920 },
  { id: 'cc-2', date: daysAgo(0), tankId: 'TANK-2', chemicalName: 'مثبت رغوة', quantityKg: 45, costPerKg: 55, totalCost: 2475 },
  { id: 'cc-3', date: daysAgo(1), tankId: 'TANK-1', chemicalName: 'نشا كاتيوني', quantityKg: 250, costPerKg: 42, totalCost: 10500 },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  { id: 'mn-4', machineNameKey: 'quality.machines.paperMachine', date: daysAgo(0), typeKey: 'quality.maintenanceTypes.corrective', description: 'اهتزاز غير طبيعي في القسم الرطب', downtimeHours: 0, status: 'pending', source: 'production' },
  { id: 'mn-1', machineNameKey: 'quality.machines.paperMachine', date: daysAhead(2), typeKey: 'quality.maintenanceTypes.preventive', description: 'تغيير سيور القسم الجاف', downtimeHours: 6, status: 'scheduled', source: 'quality', scheduledAt: daysAhead(2) },
  { id: 'mn-2', machineNameKey: 'quality.machines.rewinder', date: daysAgo(1), typeKey: 'quality.maintenanceTypes.corrective', description: 'ضبط سكاكين المقص', downtimeHours: 3, status: 'done', source: 'quality' },
  { id: 'mn-3', machineNameKey: 'quality.machines.boiler', date: daysAgo(0), typeKey: 'quality.maintenanceTypes.inspection', description: 'فحص دوري للغلاية', downtimeHours: 1, status: 'in-progress', source: 'quality', scheduledAt: daysAgo(0) },
];

export const MOCK_TECH_SHEETS: TechDataSheet[] = [
  { id: 'tds-1', specCode: 'SMP-22', specName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', gsm: 22, moisturePercent: 6.2, brightnessPercent: 82, burst: 1.8, tensile: 12.4, notes: 'مطابق لمواصفة العميل' },
  { id: 'tds-2', specCode: 'TWL-25', specName: 'تواليت فاخر ج ٢٥', gsm: 25, moisturePercent: 5.8, brightnessPercent: 84, burst: 2.1, tensile: 13.1 },
];

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
  { id: 'po-1', number: 'PRD-2026-0221', date: daysAgo(1), workOrderNumber: 'SO-2026-0119', specCode: 'TWL-25', specName: 'تواليت فاخر ج ٢٥', quantityKg: 13750, producedKg: 8100, wastePercent: 3.4, rollsTarget: 46, rollsProduced: 27, status: 'in-progress', expectedFinish: daysAhead(2), autoCreated: true },
  { id: 'po-2', number: 'PRD-2026-0220', date: daysAgo(4), workOrderNumber: 'SO-2026-0117', specCode: 'SMP-22', specName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantityKg: 44000, producedKg: 44000, wastePercent: 2.8, rollsTarget: 96, rollsProduced: 96, status: 'completed', expectedFinish: daysAgo(1), autoCreated: false },
  { id: 'po-3', number: 'PRD-2026-0222', date: daysAgo(0), workOrderNumber: 'SO-2026-0120', specCode: 'NPK-18', specName: 'نابكن سادة ج ١٨', quantityKg: 9000, producedKg: 0, wastePercent: 0, rollsTarget: 30, rollsProduced: 0, status: 'open', expectedFinish: daysAhead(6), autoCreated: true },
];
