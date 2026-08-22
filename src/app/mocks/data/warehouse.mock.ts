import {
  StockItem,
  StockMovement,
  Warehouse,
} from '../../core/models/warehouse.models';

/** MOCK LAYER — warehouses incl. the virtual lab tank store (BRD). */
export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'wh-spare', nameKey: 'warehouse.names.spareParts', kind: 'spare-parts', occupancyPercent: 62, itemsCount: 340, totalValue: 1250000 },
  { id: 'wh-chem', nameKey: 'warehouse.names.chemicals', kind: 'chemicals', occupancyPercent: 48, itemsCount: 58, totalValue: 890000 },
  { id: 'wh-lab', nameKey: 'warehouse.names.labVirtual', kind: 'lab-virtual', occupancyPercent: 12, itemsCount: 14, totalValue: 96000 },
  { id: 'wh-grease', nameKey: 'warehouse.names.greaseOils', kind: 'grease-oils', occupancyPercent: 35, itemsCount: 42, totalValue: 210000 },
  { id: 'wh-dasht', nameKey: 'warehouse.names.dashtRaw', kind: 'dasht-raw', occupancyPercent: 81, itemsCount: 12, totalValue: 3400000 },
  { id: 'wh-fin1', nameKey: 'warehouse.names.finishedFirst', kind: 'finished-first', occupancyPercent: 57, itemsCount: 24, totalValue: 5150000 },
  { id: 'wh-fin2', nameKey: 'warehouse.names.finishedSecond', kind: 'finished-second', occupancyPercent: 22, itemsCount: 9, totalValue: 620000 },
];

export const MOCK_STOCK_ITEMS: StockItem[] = [
  { code: 'DSH-001', name: 'ورق دشت درجة أولى', name_en: 'Recovered Paper — Grade 1', warehouseId: 'wh-dasht', unitKey: 'units.kg', quantity: 148000, minimumStock: 50000, unitCost: 9.5, isBelowMinimum: false },
  { code: 'DSH-002', name: 'ورق دشت درجة ثانية', name_en: 'Recovered Paper — Grade 2', warehouseId: 'wh-dasht', unitKey: 'units.kg', quantity: 36500, minimumStock: 40000, unitCost: 6.75, isBelowMinimum: true },
  { code: 'DSH-002-S1', parentCode: 'DSH-002', name: 'ورق دشت درجة ثانية — تحويل داخلي', name_en: 'Recovered Paper Grade 2 — Internal Transfer', warehouseId: 'wh-dasht', unitKey: 'units.kg', quantity: 5200, minimumStock: 0, unitCost: 6.75, isBelowMinimum: false },
  { code: 'CHM-011', name: 'كيماوي نشا كاتيوني', name_en: 'Cationic Starch Chemical', warehouseId: 'wh-chem', unitKey: 'units.kg', quantity: 1200, minimumStock: 2000, unitCost: 42, isBelowMinimum: true },
  { code: 'CHM-014', name: 'مثبت رغوة', name_en: 'Foam Stabilizer', warehouseId: 'wh-chem', unitKey: 'units.liter', quantity: 3400, minimumStock: 800, unitCost: 55, isBelowMinimum: false },
  { code: 'SPR-201', name: 'رولمان بلي 6204', name_en: 'Ball Bearing 6204', warehouseId: 'wh-spare', unitKey: 'units.piece', quantity: 14, minimumStock: 10, unitCost: 380, isBelowMinimum: false },
  { code: 'SPR-318', name: 'سير ناقل حركة B-52', name_en: 'Drive Belt B-52', warehouseId: 'wh-spare', unitKey: 'units.piece', quantity: 2, minimumStock: 6, unitCost: 940, isBelowMinimum: true },
  { code: 'FIN-SMP-22', name: 'سوبر مكس مطبخ ط ٢ ج ٢٢', name_en: 'Super Mix Kitchen T2 G22', warehouseId: 'wh-fin1', unitKey: 'units.kg', quantity: 61200, minimumStock: 15000, unitCost: 27.5, isBelowMinimum: false },
  { code: 'FIN-TWL-25', name: 'تواليت فاخر ج ٢٥', name_en: 'Premium Toilet Tissue G25', warehouseId: 'wh-fin1', unitKey: 'units.kg', quantity: 8250, minimumStock: 10000, unitCost: 31, isBelowMinimum: true },
  { code: 'FIN2-SMP-22', name: 'سوبر مكس درجة ثانية ج ٢٢', name_en: 'Super Mix Grade 2 G22', warehouseId: 'wh-fin2', unitKey: 'units.kg', quantity: 4300, minimumStock: 0, unitCost: 18, isBelowMinimum: false },
  { code: 'SPR-409', name: 'فلتر هواء MP-1', name_en: 'Air Filter MP-1', warehouseId: 'wh-spare', unitKey: 'units.piece', quantity: 0, minimumStock: 4, unitCost: 220, isBelowMinimum: true },
  { code: 'CHM-020', name: 'مضاد رغوة سيليكون', name_en: 'Silicone Defoamer', warehouseId: 'wh-chem', unitKey: 'units.liter', quantity: 0, minimumStock: 50, unitCost: 78, isBelowMinimum: true },
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const MOCK_MOVEMENTS: StockMovement[] = [
  { id: 'mv-1', number: 'RCV-2026-0841', date: daysAgo(0), type: 'receipt', itemCode: 'DSH-001', itemName: 'ورق دشت درجة أولى', quantity: 15300, unitKey: 'units.kg', toWarehouseId: 'wh-dasht', referenceKey: 'warehouse.refs.weighing', reference: '3018', byUser: 'STORE1' },
  { id: 'mv-2', number: 'ISS-2026-0512', date: daysAgo(0), type: 'issue', itemCode: 'CHM-011', itemName: 'كيماوي نشا كاتيوني', quantity: 260, unitKey: 'units.kg', fromWarehouseId: 'wh-chem', toWarehouseId: 'wh-lab', referenceKey: 'warehouse.refs.dailyBatch', reference: 'B-2026-224', byUser: 'LAB1' },
  { id: 'mv-3', number: 'ISS-2026-0513', date: daysAgo(1), type: 'issue', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantity: 14500, unitKey: 'units.kg', fromWarehouseId: 'wh-fin1', referenceKey: 'warehouse.refs.salesOrder', reference: 'SO-2026-118', byUser: 'STORE1' },
  { id: 'mv-4', number: 'TRF-2026-0102', date: daysAgo(1), type: 'transfer', itemCode: 'DSH-002-S1', itemName: 'ورق دشت درجة ثانية — تحويل داخلي', quantity: 5200, unitKey: 'units.kg', fromWarehouseId: 'wh-dasht', toWarehouseId: 'wh-fin2', referenceKey: 'warehouse.refs.weighing', reference: '3011', byUser: 'STORE2' },
  { id: 'mv-5', number: 'RCV-2026-0842', date: daysAgo(2), type: 'receipt', itemCode: 'SPR-201', itemName: 'رولمان بلي 6204', quantity: 10, unitKey: 'units.piece', toWarehouseId: 'wh-spare', referenceKey: 'warehouse.refs.purchaseOrder', reference: 'PO-2026-077', byUser: 'STORE1' },
  { id: 'mv-6', number: 'ADJ-2026-0009', date: daysAgo(3), type: 'adjustment', itemCode: 'FIN-TWL-25', itemName: 'تواليت فاخر ج ٢٥', quantity: -120, unitKey: 'units.kg', fromWarehouseId: 'wh-fin1', referenceKey: 'warehouse.refs.stockCount', reference: 'CNT-2026-03', byUser: 'ADMIN' },
  { id: 'mv-7', number: 'RCV-2026-0843', date: daysAgo(3), type: 'receipt', itemCode: 'CHM-014', itemName: 'مثبت رغوة', quantity: 800, unitKey: 'units.liter', toWarehouseId: 'wh-chem', referenceKey: 'warehouse.refs.purchaseOrder', reference: 'PO-2026-081', byUser: 'STORE1' },
  { id: 'mv-8', number: 'RCV-2026-0844', date: daysAgo(4), type: 'receipt', itemCode: 'FIN-SMP-22', itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢', quantity: 9200, unitKey: 'units.kg', toWarehouseId: 'wh-fin1', referenceKey: 'warehouse.refs.weighing', reference: '3022', byUser: 'STORE2' },
];

export function listReceipts(): StockMovement[] {
  return MOCK_MOVEMENTS.filter((row) => row.type === 'receipt');
}

export function createReceipt(body: unknown): StockMovement {
  const draft = body as Partial<StockMovement>;
  const row: StockMovement = {
    id: `mv-${Date.now()}`,
    number: draft.number || `RCV-${Date.now()}`,
    date: draft.date || new Date().toISOString(),
    type: 'receipt',
    itemCode: draft.itemCode || '',
    itemName: draft.itemName || '',
    quantity: Number(draft.quantity) || 0,
    unitKey: draft.unitKey || 'units.kg',
    toWarehouseId: draft.toWarehouseId,
    referenceKey: draft.referenceKey,
    reference: draft.reference,
    byUser: draft.byUser || '',
  };
  MOCK_MOVEMENTS.unshift(row);
  return row;
}
