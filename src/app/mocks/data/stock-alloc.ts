import { nextGenerated } from '../../shared/crud/serial';
import { MOCK_PRODUCTION_ORDERS } from './quality.mock';
import { MOCK_EXPORT_ORDERS, MOCK_WORK_ORDERS } from './sales.mock';
import { MOCK_STOCK_ITEMS } from './warehouse.mock';

type Row = Record<string, unknown>;
export type StockPart = {
  itemCode: string;
  itemName: string;
  quantity: number;
  available: number;
  toProduce: number;
};

const CLOSED_WO = new Set(['invoiced', 'closed']);
const DONE_EX = new Set(['issued', 'invoiced']);

function specOf(code: string): string {
  return code.replace(/^FIN\d*-/, '') || code;
}

function reservedOn(row: { itemCode?: string; availableFromStockKg?: number; linesJson?: string }, code: string): number {
  try {
    const parsed = JSON.parse(String(row.linesJson || '[]')) as { itemCode?: string; quantity?: number; available?: number }[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed
        .filter((line) => line.itemCode === code)
        .reduce((sum, line) => sum + Number(line.available ?? line.quantity ?? 0), 0);
    }
  } catch {
    /* header */
  }
  const codes = String(row.itemCode || '').split(',').map((part) => part.trim());
  return codes.length === 1 && codes[0] === code ? Number(row.availableFromStockKg || 0) : 0;
}

function reservedKg(code: string, skipId: string): number {
  let sum = 0;
  for (const row of MOCK_WORK_ORDERS) {
    if (row.id === skipId || CLOSED_WO.has(row.status)) continue;
    sum += reservedOn(row, code);
  }
  for (const row of MOCK_EXPORT_ORDERS) {
    if (row.id === skipId || DONE_EX.has(row.stage)) continue;
    sum += reservedOn(row, code);
  }
  return sum;
}

export function onHand(code: string, name = '', skipId = ''): number {
  const item = MOCK_STOCK_ITEMS.find((row) => row.code === code || row.name === name);
  return Math.max(0, (item?.quantity ?? 0) - reservedKg(item?.code || code, skipId));
}

function demands(row: Row): { itemCode: string; itemName: string; quantity: number }[] {
  try {
    const parsed = JSON.parse(String(row['linesJson'] || '[]')) as {
      itemCode?: string;
      itemName?: string;
      quantity?: number;
    }[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((line) => ({
        itemCode: String(line.itemCode || ''),
        itemName: String(line.itemName || ''),
        quantity: Number(line.quantity || 0),
      }));
    }
  } catch {
    /* use header qty */
  }
  return [
    {
      itemCode: String(row['itemCode'] || ''),
      itemName: String(row['itemName'] || ''),
      quantity: Number(row['quantityKg'] || 0),
    },
  ].filter((line) => line.quantity > 0 || line.itemCode || line.itemName);
}

export function planStock(row: Row): {
  parts: StockPart[];
  available: number;
  toProduce: number;
  quantityKg: number;
} {
  const skip = String(row['id'] || '');
  const taken = new Map<string, number>();
  const parts: StockPart[] = [];
  let available = 0;
  let toProduce = 0;
  for (const line of demands(row)) {
    const key = line.itemCode || line.itemName;
    const free = Math.max(0, onHand(line.itemCode, line.itemName, skip) - (taken.get(key) ?? 0));
    const take = Math.max(0, Math.min(line.quantity, free));
    const rest = Math.max(0, line.quantity - take);
    taken.set(key, (taken.get(key) ?? 0) + take);
    parts.push({ ...line, available: take, toProduce: rest });
    available += take;
    toProduce += rest;
  }
  return { parts, available, toProduce, quantityKg: available + toProduce };
}

export function spawnShortage(workOrderNumber: string, parts: StockPart[]): void {
  if (!workOrderNumber || MOCK_PRODUCTION_ORDERS.some((row) => row.workOrderNumber === workOrderNumber)) {
    return;
  }
  const finish = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  parts.forEach((part, index) => {
    if (part.toProduce <= 0) return;
    MOCK_PRODUCTION_ORDERS.unshift({
      id: `prd-${Date.now()}-${index}`,
      number: nextGenerated(MOCK_PRODUCTION_ORDERS, 'number', 'PRD'),
      date: new Date().toISOString(),
      workOrderNumber,
      specCode: specOf(part.itemCode),
      specName: part.itemName,
      quantityKg: part.toProduce,
      producedKg: 0,
      wastePercent: 0,
      rollsTarget: Math.max(1, Math.round(part.toProduce / 300)),
      rollsProduced: 0,
      status: 'open',
      expectedFinish: finish,
      autoCreated: true,
    });
  });
}

export function statusFromPlan(available: number, toProduce: number): string {
  if (toProduce <= 0) return 'ready';
  return available > 0 ? 'partially-fulfilled' : 'in-production';
}

export function applyStockPlan(row: Row, spawn: boolean): Row {
  const plan = planStock(row);
  const number = String(row['number'] || '');
  if (spawn) spawnShortage(number, plan.parts);
  let linesJson = row['linesJson'];
  try {
    const parsed = JSON.parse(String(row['linesJson'] || '[]')) as object[];
    if (Array.isArray(parsed) && parsed.length) {
      linesJson = JSON.stringify(
        parsed.map((line, index) => ({
          ...line,
          available: plan.parts[index]?.available,
          toProduce: plan.parts[index]?.toProduce,
        })),
      );
    }
  } catch {
    /* keep */
  }
  return {
    ...row,
    linesJson,
    itemCode: plan.parts.map((part) => part.itemCode).filter(Boolean).join(', ') || row['itemCode'] || '',
    itemName: plan.parts.map((part) => part.itemName).filter(Boolean).join(' · ') || row['itemName'] || '',
    quantityKg: plan.quantityKg || Number(row['quantityKg'] || 0),
    availableFromStockKg: plan.available,
    toProduceKg: plan.toProduce,
    collectionStatusKey: row['collectionStatusKey'] || 'sales.collection.pending',
  };
}
