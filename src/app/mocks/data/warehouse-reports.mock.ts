import { MOCK_MOVEMENTS, MOCK_STOCK_ITEMS } from './warehouse.mock';

type Row = Record<string, unknown>;
type Mv = (typeof MOCK_MOVEMENTS)[number];
type Line = Mv & { lineCode: string; lineName: string; lineQty: number };

const IN = new Set(['receipt', 'warehouse-return']);
const OUT = new Set(['issue', 'supplier-return']);

function inRange(date: string, from: string, to: string): boolean {
  const day = date.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

function explode(row: Mv): Line[] {
  try {
    const parsed = JSON.parse(String(row.linesJson || '[]')) as {
      itemCode?: string;
      itemName?: string;
      quantity?: number;
    }[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed
        .filter((line) => line.itemCode)
        .map((line) => ({
          ...row,
          lineCode: String(line.itemCode),
          lineName: String(line.itemName || row.itemName),
          lineQty: Math.abs(Number(line.quantity || 0)),
        }));
    }
  } catch {
    /* header-only voucher */
  }
  return [{ ...row, lineCode: row.itemCode, lineName: row.itemName, lineQty: Math.abs(Number(row.quantity)) }];
}

function flow(row: Line, warehouseId: string): [number, number] {
  const qty = row.lineQty;
  if (IN.has(row.type) && (!warehouseId || row.toWarehouseId === warehouseId)) return [qty, 0];
  if (OUT.has(row.type) && (!warehouseId || row.fromWarehouseId === warehouseId)) return [0, qty];
  if (row.type === 'transfer') {
    if (!warehouseId) return [qty, qty];
    if (row.toWarehouseId === warehouseId) return [qty, 0];
    if (row.fromWarehouseId === warehouseId) return [0, qty];
  }
  if (row.type === 'adjustment' && (!warehouseId || row.fromWarehouseId === warehouseId || row.toWarehouseId === warehouseId)) {
    return row.quantity >= 0 ? [qty, 0] : [0, qty];
  }
  return [0, 0];
}

function ofItem(code: string, warehouseId: string): Line[] {
  return MOCK_MOVEMENTS.flatMap(explode)
    .filter((row) => {
      if (row.lineCode !== code) return false;
      if (!warehouseId) return true;
      return row.fromWarehouseId === warehouseId || row.toWarehouseId === warehouseId;
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

/** One row per SKU: inbound / outbound in the period and on-hand balance. */
export function listItemMovementReport(query: URLSearchParams): Row[] {
  const from = query.get('from') ?? '';
  const to = query.get('to') ?? '';
  const warehouseId = query.get('warehouseId') ?? '';
  return MOCK_STOCK_ITEMS.filter((item) => !warehouseId || item.warehouseId === warehouseId).map((item) => {
    let inbound = 0;
    let outbound = 0;
    let movementDate = '';
    let beginningBalance = 0;
    
    // Calculate all metrics from movement history
    const history = ofItem(item.code, warehouseId);
    for (const row of history) {
      const [inn, out] = flow(row, warehouseId);
      
      // Track movement date (latest movement within period)
      if (inRange(row.date, from, to)) {
        inbound += inn;
        outbound += out;
        if (!movementDate || row.date > movementDate) {
          movementDate = row.date;
        }
      }
      
      // Calculate beginning balance from movements before the period
      if (from && row.date.slice(0, 10) < from) {
        beginningBalance += inn - out;
      }
    }
    
    return {
      id: item.code,
      itemCode: item.code,
      itemName: item.name,
      warehouseId: item.warehouseId,
      groupKey: item.groupKey,
      subGroupKey: item.subGroupKey,
      unitKey: item.unitKey,
      location: item.location,
      movementDate: movementDate || new Date().toISOString(),
      inbound,
      outbound,
      beginningBalance,
      balance: item.quantity,
      quantity: item.quantity,
      minimumStock: item.minimumStock,
      isBelowMinimum: item.isBelowMinimum,
      hideZero: item.quantity === 0 ? '0' : '1',
    };
  });
}

/** Ledger for one (or every moving) item: opening + each voucher with a running balance. */
export function listItemCardReport(query: URLSearchParams): Row[] {
  const from = query.get('from') ?? '';
  const to = query.get('to') ?? '';
  const warehouseId = query.get('warehouseId') ?? '';
  const itemCode = query.get('itemCode') ?? '';
  const type = query.get('type') ?? '';
  const items = MOCK_STOCK_ITEMS.filter((item) => {
    if (itemCode) return item.code === itemCode;
    return ofItem(item.code, warehouseId).some((row) => inRange(row.date, from, to));
  });
  const rows: Row[] = [];
  for (const item of items) {
    const history = ofItem(item.code, warehouseId);
    let opening = item.quantity;
    for (const row of [...history].reverse()) {
      if (from && row.date.slice(0, 10) < from) continue;
      const [inn, out] = flow(row, warehouseId);
      opening += out - inn;
    }
    let balance = opening;
    let serial = 0;
    rows.push({
      id: `${item.code}-open`,
      itemCode: item.code,
      itemName: item.name,
      warehouseId: warehouseId || item.warehouseId,
      serial: 0,
      date: from || history[0]?.date || new Date().toISOString(),
      type: 'opening',
      inbound: 0,
      outbound: 0,
      balance: opening,
      number: '',
      reference: '',
      byUser: '',
    });
    for (const row of history) {
      if (!inRange(row.date, from, to)) continue;
      if (type && row.type !== type) continue;
      const [inn, out] = flow(row, warehouseId);
      balance += inn - out;
      serial += 1;
      rows.push({
        id: `${row.id}-${row.lineCode}`,
        itemCode: item.code,
        itemName: row.lineName || item.name,
        warehouseId: warehouseId || row.toWarehouseId || row.fromWarehouseId,
        serial,
        date: row.date,
        type: row.type,
        inbound: inn,
        outbound: out,
        balance,
        number: row.number,
        reference: row.reference,
        byUser: row.byUser,
      });
    }
  }
  return rows;
}
