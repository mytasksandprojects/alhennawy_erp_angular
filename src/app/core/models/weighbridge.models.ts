/**
 * الميزان — Weighbridge domain.
 *
 * Every ticket has TWO weighings:
 *  - Incoming goods (e.g. purchases of دشت): first weighing = loaded truck,
 *    second weighing = empty truck. Net = first − second.
 *  - Outgoing goods (e.g. sales of منتج تام): first weighing = empty truck,
 *    second weighing = loaded truck. Net = second − first.
 */

export type WeighingType =
  | 'purchase'
  | 'sales'
  | 'purchase-return'
  | 'sales-return'
  | 'internal-transfer';

/** Which weighing comes first for each direction of goods. */
export type WeighingDirection = 'inbound' | 'outbound';

export type WeighingStatus = 'first-done' | 'completed' | 'cancelled';

export interface WeighingTicket {
  id: string;
  /** Sequential serial — accounting must price every serial, no gaps. */
  serial: number;
  type: WeighingType;
  direction: WeighingDirection;
  status: WeighingStatus;
  date: string;
  vehiclePlate: string;
  driverName: string;
  partyCode: string;
  partyNameKey?: string;
  partyName?: string;
  itemCode: string;
  itemName: string;
  /** For items not yet coded (purchase weighings only). */
  uncodedItemDescription?: string;
  /** SUB code for internal transfers so production codes are untouched. */
  subCode?: string;
  sourceWarehouseId?: string;
  targetWarehouseId?: string;
  firstWeightKg: number;
  firstWeighedAt: string;
  secondWeightKg?: number;
  secondWeighedAt?: string;
  netWeightKg?: number;
  /** Manual USD rate for export customer statements. */
  manualExchangeRate?: number;
  priced: boolean;
  notes?: string;
}

export interface WeighingCreateRequest {
  type: WeighingType;
  direction: WeighingDirection;
  vehiclePlate: string;
  driverName: string;
  partyCode: string;
  itemCode: string;
  uncodedItemDescription?: string;
  subCode?: string;
  sourceWarehouseId?: string;
  targetWarehouseId?: string;
  firstWeightKg: number;
  notes?: string;
}

export interface WeighingCompleteRequest {
  ticketId: string;
  secondWeightKg: number;
}
