import {
  ExportShipment,
  ImportShipment,
  PackingList,
} from '../../core/models/logistics.models';
import { MOCK_EXPORT_ORDERS } from './sales.mock';
import { MOCK_MOVEMENTS } from './warehouse.mock';

/** MOCK LAYER — import/export shipments with full BRD lifecycle. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_IMPORTS: ImportShipment[] = [
  {
    id: 'imp-1', number: 'IMP-2026-0012', supplierCode: 'SUP-032', supplierName: 'غريت لاند لتقنية اللب والورق',
    stage: 'customs', acidNo: 'ACID-7841120', releasePermitNo: 'REL-30412', releasePermitDate: daysAgo(1),
    customsNameKey: 'logistics.customs.alexandria', originPort: 'Qingdao', arrivalPort: 'Alexandria',
    etaDate: daysAgo(3), isLate: true,
    costs: [
      { typeKey: 'logistics.costs.importDuty', amount: 68000, currency: 'EGP' },
      { typeKey: 'logistics.costs.vat', amount: 41500, currency: 'EGP' },
      { typeKey: 'logistics.costs.transport', amount: 12000, currency: 'EGP' },
      { typeKey: 'logistics.costs.brokerFees', amount: 8500, currency: 'EGP' },
    ],
  },
  {
    id: 'imp-2', number: 'IMP-2026-0013', supplierCode: 'SUP-030', supplierName: 'فويث',
    stage: 'cargox', acidNo: 'ACID-7852201', originPort: 'Hamburg', arrivalPort: 'Damietta',
    etaDate: daysAhead(12), isLate: false, costs: [],
  },
  {
    id: 'imp-3', number: 'IMP-2026-0011', supplierCode: 'SUP-032', supplierName: 'غريت لاند لتقنية اللب والورق',
    stage: 'finance-costing', acidNo: 'ACID-7830514', releasePermitNo: 'REL-30320', releasePermitDate: daysAgo(8),
    customsNameKey: 'logistics.customs.alexandria', originPort: 'Qingdao', arrivalPort: 'Alexandria',
    etaDate: daysAgo(10), isLate: false,
    costs: [
      { typeKey: 'logistics.costs.importDuty', amount: 72500, currency: 'EGP' },
      { typeKey: 'logistics.costs.vat', amount: 44800, currency: 'EGP' },
      { typeKey: 'logistics.costs.analysis', amount: 3200, currency: 'EGP' },
      { typeKey: 'logistics.costs.other', amount: 5100, currency: 'EGP' },
    ],
  },
];

export const MOCK_EXPORT_SHIPMENTS: ExportShipment[] = [
  { id: 'exs-1', number: 'SHP-2026-0044', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'loading', containersCount: 2, vessel: 'MSC AURORA', portKey: 'logistics.ports.alexandria', originPort: 'Alexandria', arrivalPort: 'Jeddah', cutoffTime: '16:00', loadingDate: daysAhead(7), etaDate: daysAhead(12), shippingAgent: 'MSC Egypt', telexReleased: false, isLate: false },
  { id: 'exs-2', number: 'SHP-2026-0043', customerCode: 'CUS-007', customerName: 'شركة المعالي للورق الصحي', stage: 'documents', containersCount: 1, vessel: 'CMA CGM NILE', portKey: 'logistics.ports.damietta', originPort: 'Damietta', arrivalPort: 'Mersin', cutoffTime: '12:00', loadingDate: daysAgo(6), etaDate: daysAhead(4), shippingAgent: 'CMA CGM Egypt', shippingLineInvoicesTotal: 3850, telexReleased: true, isLate: false },
  { id: 'exs-3', number: 'SHP-2026-0042', customerCode: 'CUS-006', customerName: 'شركة النورس الفني للتصنيع', stage: 'delivered', containersCount: 2, vessel: 'MAERSK VALENCIA', portKey: 'logistics.ports.alexandria', originPort: 'Alexandria', arrivalPort: 'Aqaba', cutoffTime: '18:00', loadingDate: daysAgo(24), etaDate: daysAgo(14), shippingAgent: 'Maersk Egypt', shippingLineInvoicesTotal: 7400, telexReleased: true, isLate: true },
];

/**
 * باكينج ليست — every issue movement destined to an export order with a
 * container number joins the list of its (order, container) group: the
 * same container on the same export order always lands in ONE list.
 */
export function packingLists(): PackingList[] {
  const groups = new Map<string, PackingList>();
  for (const mv of MOCK_MOVEMENTS) {
    if (mv.type !== 'issue' || mv.toType !== 'export' || !mv.orderNumber || !mv.containerNumber) {
      continue;
    }
    const key = `${mv.orderNumber}|${mv.containerNumber}`;
    const order = MOCK_EXPORT_ORDERS.find((row) => row.number === mv.orderNumber);
    const qty = Math.abs(Number(mv.quantity || 0));
    const existing = groups.get(key);
    if (existing) {
      existing.issueNumbers = `${existing.issueNumbers}, ${mv.number}`;
      if (mv.itemName && !existing.itemsSummary?.includes(mv.itemName)) {
        existing.itemsSummary = existing.itemsSummary
          ? `${existing.itemsSummary} · ${mv.itemName}`
          : mv.itemName;
      }
      existing.itemsCount += 1;
      existing.totalQuantity += qty;
      if (mv.date > existing.date) existing.date = mv.date;
    } else {
      groups.set(key, {
        id: `pl-${groups.size + 1}`,
        number: `PL-${mv.orderNumber}-${mv.containerNumber}`,
        orderNumber: mv.orderNumber,
        customerName: order?.customerName ?? '',
        containerNumber: mv.containerNumber,
        issueNumbers: mv.number,
        itemsSummary: mv.itemName,
        itemsCount: 1,
        totalQuantity: qty,
        unitKey: mv.unitKey,
        date: mv.date,
      });
    }
  }
  return [...groups.values()];
}
