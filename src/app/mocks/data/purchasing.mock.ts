import {
  PurchaseOrder,
  PurchaseRequest,
  Supplier,
  SupplierQuotation,
} from '../../core/models/purchasing.models';
import { nextGenerated } from '../../shared/crud/serial';
import { MockApiError } from '../mock-backend.interceptor';

/** MOCK LAYER — purchasing cycle data (PR → quotations → PO). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const MOCK_SUPPLIERS: Supplier[] = [
  { code: 'SUP-001', name: 'مورد دشت المنوفية', name_en: 'Menoufia Recovered Paper Supplier', currency: 'EGP', balance: 425000, onTimeDeliveryPercent: 92 },
  { code: 'SUP-002', name: 'شركة الكيماويات المتحدة', name_en: 'United Chemicals Co.', currency: 'EGP', balance: 180500, onTimeDeliveryPercent: 88 },
  { code: 'SUP-003', name: 'مورد خامات السادات', name_en: 'Sadat Raw Materials Supplier', currency: 'EGP', balance: 96200, onTimeDeliveryPercent: 76 },
  { code: 'SUP-004', name: 'Voith Paper GmbH', currency: 'EUR', balance: 42800, onTimeDeliveryPercent: 97 },
  { code: 'SUP-005', name: 'Shandong Pulp Co.', currency: 'USD', balance: 118000, onTimeDeliveryPercent: 84 },
];

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [
  { id: 'pr-1', number: 'PR-2026-0301', date: daysAgo(1), requestingDepartmentKey: 'departments.production', status: 'pending', lines: [
    { itemCode: 'SPR-318', itemName: 'سير ناقل حركة B-52', quantity: 6, unitKey: 'units.piece' },
    { itemCode: 'SPR-201', itemName: 'رولمان بلي 6204', quantity: 20, unitKey: 'units.piece' },
  ]},
  { id: 'pr-2', number: 'PR-2026-0300', date: daysAgo(3), requestingDepartmentKey: 'departments.quality', status: 'approved', lines: [
    { itemCode: 'CHM-011', itemName: 'كيماوي نشا كاتيوني', quantity: 3000, unitKey: 'units.kg', specification: 'كثافة 1.06 - 1.09' },
  ]},
  { id: 'pr-3', number: 'PR-2026-0298', date: daysAgo(6), requestingDepartmentKey: 'departments.warehouse', status: 'ordered', lines: [
    { itemCode: 'STR-005', itemName: 'استرتش تغليف 50 سم', quantity: 800, unitKey: 'units.kg' },
  ]},
];

export const MOCK_QUOTATIONS: SupplierQuotation[] = [
  { id: 'q-1', requestId: 'pr-2', supplierCode: 'SUP-002', supplierName: 'شركة الكيماويات المتحدة', totalValue: 126000, currency: 'EGP', exchangeRate: 1, deliveryDays: 7, technicalScore: 95, selected: true },
  { id: 'q-2', requestId: 'pr-2', supplierCode: 'SUP-005', supplierName: 'Shandong Pulp Co.', totalValue: 2480, currency: 'USD', exchangeRate: 48.5, deliveryDays: 45, technicalScore: 90, selected: false },
  { id: 'q-3', requestId: 'pr-1', supplierCode: 'SUP-004', supplierName: 'Voith Paper GmbH', totalValue: 3150, currency: 'EUR', exchangeRate: 52.8, deliveryDays: 21, technicalScore: 98, selected: false },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'po-1', number: 'PO-2026-0077', date: daysAgo(5), supplierCode: 'SUP-001', supplierName: 'مورد دشت المنوفية', status: 'received', currency: 'EGP', exchangeRate: 1, totalValue: 1453500, expectedDelivery: daysAgo(1), leadTimeDays: 4, requestId: 'pr-3' },
  { id: 'po-2', number: 'PO-2026-0078', date: daysAgo(4), supplierCode: 'SUP-002', supplierName: 'شركة الكيماويات المتحدة', status: 'open', currency: 'EGP', exchangeRate: 1, totalValue: 126000, expectedDelivery: daysAhead(3), requestId: 'pr-2' },
  { id: 'po-3', number: 'PO-2026-0079', date: daysAgo(12), supplierCode: 'SUP-005', supplierName: 'Shandong Pulp Co.', status: 'late', currency: 'USD', exchangeRate: 48.5, totalValue: 86000, expectedDelivery: daysAgo(2) },
  { id: 'po-4', number: 'PO-2026-0080', date: daysAgo(2), supplierCode: 'SUP-004', supplierName: 'Voith Paper GmbH', status: 'partially-received', currency: 'EUR', exchangeRate: 52.8, totalValue: 3150, expectedDelivery: daysAhead(10) },
];

function flattenRequest(row: PurchaseRequest): PurchaseRequest {
  const line = row.lines?.[0];
  return {
    ...row,
    itemName: row.itemName || line?.itemName || '',
    quantity: row.quantity ?? line?.quantity ?? 0,
  };
}

export function listPurchaseRequests(): PurchaseRequest[] {
  return MOCK_PURCHASE_REQUESTS.map(flattenRequest);
}

export function listDeptRequests(departmentKey: string): PurchaseRequest[] {
  return listPurchaseRequests().filter((row) => row.requestingDepartmentKey === departmentKey);
}

export function upsertDeptRequest(departmentKey: string, body: unknown): PurchaseRequest {
  const incoming = body as PurchaseRequest;
  const itemName = String(incoming.itemName ?? incoming.lines?.[0]?.itemName ?? '');
  const quantity = Number(incoming.quantity ?? incoming.lines?.[0]?.quantity ?? 0);
  const row: PurchaseRequest = {
    ...incoming,
    id: incoming.id || `pr-${Date.now()}`,
    number: incoming.number || nextGenerated(MOCK_PURCHASE_REQUESTS, 'number', 'PR'),
    date: incoming.date || new Date().toISOString(),
    requestingDepartmentKey: incoming.requestingDepartmentKey || departmentKey,
    status: incoming.status || 'pending',
    itemName,
    quantity,
    lines: incoming.lines?.length
      ? incoming.lines
      : itemName
        ? [{ itemCode: '', itemName, quantity, unitKey: 'units.piece' }]
        : [],
  };
  const index = MOCK_PURCHASE_REQUESTS.findIndex((item) => item.id === row.id);
  if (index >= 0) MOCK_PURCHASE_REQUESTS[index] = row;
  else MOCK_PURCHASE_REQUESTS.unshift(row);
  return flattenRequest(row);
}

export function deletePurchaseRequest(id: string): PurchaseRequest {
  const index = MOCK_PURCHASE_REQUESTS.findIndex((row) => row.id === id);
  if (index < 0) throw new MockApiError(404, 'not-found');
  return MOCK_PURCHASE_REQUESTS.splice(index, 1)[0];
}
