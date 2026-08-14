import {
  WeighingCompleteRequest,
  WeighingCreateRequest,
  WeighingTicket,
} from '../../core/models/weighbridge.models';
import { MockApiError } from '../mock-backend.interceptor';

/**
 * MOCK LAYER — stateful weighbridge simulation.
 * Serials are strictly sequential (accounting rule: no serial may be
 * skipped without a priced value).
 */
let serialCounter = 3021;

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();

export const MOCK_TICKETS: WeighingTicket[] = [
  {
    id: 'w-3018',
    serial: 3018,
    type: 'purchase',
    direction: 'inbound',
    status: 'completed',
    date: hoursAgo(30),
    vehiclePlate: 'س ن ع 4821',
    driverName: 'محمد عبدالله',
    partyCode: 'SUP-001',
    partyName: 'مورد دشت المنوفية',
    itemCode: 'DSH-001',
    itemName: 'ورق دشت درجة أولى',
    firstWeightKg: 24500,
    firstWeighedAt: hoursAgo(30),
    secondWeightKg: 9200,
    secondWeighedAt: hoursAgo(28),
    netWeightKg: 15300,
    priced: true,
  },
  {
    id: 'w-3019',
    serial: 3019,
    type: 'sales',
    direction: 'outbound',
    status: 'completed',
    date: hoursAgo(9),
    vehiclePlate: 'ق ل م 7710',
    driverName: 'أحمد سعيد',
    partyCode: 'CUS-014',
    partyName: 'شركة النيل للتغليف',
    itemCode: 'FIN-SMP-22',
    itemName: 'سوبر مكس مطبخ ط ٢ ج ٢٢',
    firstWeightKg: 8900,
    firstWeighedAt: hoursAgo(9),
    secondWeightKg: 23400,
    secondWeighedAt: hoursAgo(8),
    netWeightKg: 14500,
    priced: false,
  },
  {
    id: 'w-3020',
    serial: 3020,
    type: 'purchase',
    direction: 'inbound',
    status: 'first-done',
    date: hoursAgo(2),
    vehiclePlate: 'م ص ر 1188',
    driverName: 'سيد فتحي',
    partyCode: 'SUP-003',
    partyName: 'مورد خامات السادات',
    itemCode: 'DSH-002',
    itemName: 'ورق دشت درجة ثانية',
    firstWeightKg: 21750,
    firstWeighedAt: hoursAgo(2),
    priced: false,
  },
];

export function listWeighings(query: URLSearchParams): WeighingTicket[] {
  const type = query.get('type');
  const status = query.get('status');
  return MOCK_TICKETS
    .filter((t) => !type || t.type === type)
    .filter((t) => !status || t.status === status)
    .sort((a, b) => b.serial - a.serial);
}

export function getWeighing(id: string): WeighingTicket {
  const ticket = MOCK_TICKETS.find((t) => t.id === id);
  if (!ticket) throw new MockApiError(404, 'not-found');
  return ticket;
}

export function createWeighing(body: unknown): WeighingTicket {
  const req = body as WeighingCreateRequest;
  if (!req.vehiclePlate || !req.partyCode || req.firstWeightKg <= 0) {
    throw new MockApiError(400, 'invalid-weighing');
  }
  const ticket: WeighingTicket = {
    id: `w-${serialCounter}`,
    serial: serialCounter++,
    type: req.type,
    direction: req.direction,
    status: 'first-done',
    date: new Date().toISOString(),
    vehiclePlate: req.vehiclePlate,
    driverName: req.driverName,
    partyCode: req.partyCode,
    partyName: req.partyCode,
    itemCode: req.itemCode,
    itemName: req.itemCode,
    uncodedItemDescription: req.uncodedItemDescription,
    subCode: req.subCode,
    sourceWarehouseId: req.sourceWarehouseId,
    targetWarehouseId: req.targetWarehouseId,
    firstWeightKg: req.firstWeightKg,
    firstWeighedAt: new Date().toISOString(),
    priced: false,
    notes: req.notes,
  };
  MOCK_TICKETS.unshift(ticket);
  return ticket;
}

export function completeWeighing(body: unknown): WeighingTicket {
  const req = body as WeighingCompleteRequest;
  const ticket = MOCK_TICKETS.find((t) => t.id === req.ticketId);
  if (!ticket) throw new MockApiError(404, 'not-found');
  if (ticket.status !== 'first-done') throw new MockApiError(400, 'already-completed');
  if (req.secondWeightKg <= 0) throw new MockApiError(400, 'invalid-weight');

  ticket.secondWeightKg = req.secondWeightKg;
  ticket.secondWeighedAt = new Date().toISOString();
  // inbound: loaded first, empty second / outbound: empty first, loaded second
  ticket.netWeightKg =
    ticket.direction === 'inbound'
      ? ticket.firstWeightKg - req.secondWeightKg
      : req.secondWeightKg - ticket.firstWeightKg;
  if (ticket.netWeightKg <= 0) throw new MockApiError(400, 'invalid-net-weight');
  ticket.status = 'completed';
  return ticket;
}
