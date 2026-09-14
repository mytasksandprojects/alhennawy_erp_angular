import { StockCount, StockMovement, ToolCustody } from '../../core/models/warehouse.models';
import { MOCK_LOOKUP_VALUES } from './lookups.mock';
import { MOCK_MOVEMENTS, MOCK_STOCK_ITEMS } from './warehouse.mock';

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const STORE: Record<string, string> = {
  'wh-spare': 'SPR',
  'wh-raw': 'RAW',
  'wh-supplies': 'SPL',
  'wh-chem': 'CHM',
  'wh-dasht': 'DSH',
  'wh-fin1': 'FIN',
  'wh-fin2': 'FN2',
  'wh-lab': 'LAB',
  'wh-grease': 'GRS',
};

function groupTag(groupKey: string): string {
  const id = groupKey.replace(/^itemGroups\./, '');
  const parts = id.replace(/([A-Z])/g, '-$1').replace(/^-/, '').split('-').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return id.slice(0, 3).toUpperCase() || 'XX';
}

function prefixOf(warehouseId: string, groupKey: string): string {
  const store = STORE[warehouseId] || 'ITM';
  const row = MOCK_LOOKUP_VALUES.find((item) => item.group === 'itemGroups' && item.value === groupKey);
  const tag = (row?.codePrefix || groupTag(groupKey || '')).replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'XX';
  return `${store}-${tag}`;
}

export function nextItemCode(warehouseId: string, groupKey: string): string {
  const head = prefixOf(warehouseId, groupKey);
  let max = 0;
  for (const item of MOCK_STOCK_ITEMS) {
    if (!item.code.startsWith(`${head}-`)) continue;
    const n = Number(item.code.slice(head.length + 1));
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return `${head}-${String(max + 1).padStart(4, '0')}`;
}

export function assignItemCode(row: Record<string, unknown>): Record<string, unknown> {
  const code = String(row['code'] || '');
  if (code && !code.startsWith('ITM-')) return row;
  return { ...row, code: nextItemCode(String(row['warehouseId'] || ''), String(row['groupKey'] || '')) };
}

type Line = { itemCode?: string; itemName?: string; quantity?: number; unitKey?: string };

function linesOf(row: Record<string, unknown>): Line[] {
  try {
    const parsed = JSON.parse(String(row['linesJson'] || '[]')) as unknown;
    return Array.isArray(parsed) ? (parsed as Line[]) : [];
  } catch {
    return [];
  }
}

export function prepareMovement(row: Record<string, unknown>): Record<string, unknown> {
  const lines = linesOf(row);
  if (!lines.length) return row;
  return {
    ...row,
    itemCode: lines.map((line) => line.itemCode).filter(Boolean).join(', '),
    itemName: lines.map((line) => line.itemName).filter(Boolean).join(' · ') || row['itemName'],
    quantity: lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0),
    unitKey: lines[0]?.unitKey || row['unitKey'] || 'units.piece',
  };
}

export const MOCK_TOOL_CUSTODY: ToolCustody[] = [
  { id: 'tc-1', number: 'CST-2026-0001', itemName: 'ميكرومتر خارجي 0-25', warehouseId: 'wh-spare', holderName: 'أحمد حمدي شعبان حمزة', issuedAt: daysAgo(2), status: 'out' },
  { id: 'tc-2', number: 'CST-2026-0002', itemName: 'طقم مفكات', warehouseId: 'wh-spare', holderName: 'محمد عبد الغفار محمد ابو ادريس', issuedAt: daysAgo(8), returnedAt: daysAgo(1), status: 'returned' },
];

export const MOCK_STOCK_COUNTS: StockCount[] = [
  { id: 'sc-1', number: 'CNT-2026-0001', date: daysAgo(1), warehouseId: 'wh-spare', itemCode: 'SPR-201', itemName: 'رولمان بلي 6204', systemQty: 14, countedQty: 13, difference: -1 },
  { id: 'sc-2', number: 'CNT-2026-0002', date: daysAgo(1), warehouseId: 'wh-raw', itemCode: 'RAW-005', itemName: 'كلور', systemQty: 1, countedQty: 1, difference: 0 },
];

export function prepareStockCount(row: Record<string, unknown>): Record<string, unknown> {
  const code = String(row['itemCode'] || '');
  const item = MOCK_STOCK_ITEMS.find((entry) => entry.code === code);
  const system = Number(row['systemQty'] || item?.quantity || 0);
  const counted = Number(row['countedQty'] || 0);
  const difference = counted - system;
  if (item) {
    item.quantity = counted;
    item.isBelowMinimum = counted > 0 && counted <= item.minimumStock;
  }
  if (difference !== 0 && code) {
    const movement: StockMovement = {
      id: `mv-cnt-${Date.now()}`,
      number: `ADJ-${Date.now()}`,
      date: String(row['date'] || new Date().toISOString()),
      type: 'adjustment',
      itemCode: code,
      itemName: String(row['itemName'] || item?.name || ''),
      quantity: difference,
      unitKey: item?.unitKey || 'units.piece',
      fromWarehouseId: String(row['warehouseId'] || item?.warehouseId || ''),
      referenceKey: 'warehouse.refs.stockCount',
      reference: String(row['number'] || ''),
      byUser: 'COUNT',
    };
    MOCK_MOVEMENTS.unshift(movement);
  }
  return { ...row, systemQty: system, countedQty: counted, difference };
}

for (const row of MOCK_LOOKUP_VALUES) {
  if (row.group === 'itemGroups' && !row.codePrefix) row.codePrefix = groupTag(row.value);
}
