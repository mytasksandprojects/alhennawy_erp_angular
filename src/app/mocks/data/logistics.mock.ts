import {
  ExportShipment,
  ImportShipment,
} from '../../core/models/logistics.models';

/** MOCK LAYER — import/export shipments with full BRD lifecycle. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_IMPORTS: ImportShipment[] = [
  {
    id: 'imp-1', number: 'IMP-2026-0012', supplierCode: 'SUP-005', supplierName: 'Shandong Pulp Co.',
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
    id: 'imp-2', number: 'IMP-2026-0013', supplierCode: 'SUP-004', supplierName: 'Voith Paper GmbH',
    stage: 'cargox', acidNo: 'ACID-7852201', originPort: 'Hamburg', arrivalPort: 'Damietta',
    etaDate: daysAhead(12), isLate: false, costs: [],
  },
  {
    id: 'imp-3', number: 'IMP-2026-0011', supplierCode: 'SUP-005', supplierName: 'Shandong Pulp Co.',
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
  { id: 'exs-1', number: 'SHP-2026-0044', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', stage: 'loading', containersCount: 2, vessel: 'MSC AURORA', portKey: 'logistics.ports.alexandria', loadingDate: daysAhead(7), telexReleased: false, isLate: false },
  { id: 'exs-2', number: 'SHP-2026-0043', customerCode: 'CUS-EXP-07', customerName: 'Amman Hygiene Co.', stage: 'documents', containersCount: 1, vessel: 'CMA CGM NILE', portKey: 'logistics.ports.damietta', loadingDate: daysAgo(6), shippingLineInvoicesTotal: 3850, telexReleased: true, isLate: false },
  { id: 'exs-3', number: 'SHP-2026-0042', customerCode: 'CUS-EXP-03', customerName: 'Napoli Tissue S.r.l.', stage: 'delivered', containersCount: 2, vessel: 'MAERSK VALENCIA', portKey: 'logistics.ports.alexandria', loadingDate: daysAgo(24), shippingLineInvoicesTotal: 7400, telexReleased: true, isLate: true },
];
