import { MOCK_PRODUCTION_ORDERS } from './quality.mock';
import {
  MOCK_EXPORT_ORDERS,
  MOCK_WORK_ORDERS,
  parseSalesLines,
  salesLinesTotal,
} from './sales.mock';
import {
  applyStockPlan,
  deductPlannedStock,
  planStock,
  spawnSalesOrder,
  statusFromPlan,
  syncQcParent,
} from './stock-alloc';
import { MOCK_TAX_API_SETTINGS } from './tax-api.mock';

/**
 * Production-order writes: when production approves an order, its schedule
 * date flows back to the sales order; approving a reschedule request moves
 * the export order's loading date.
 */
export function prepareProductionOrder(row: Record<string, unknown>): Record<string, unknown> {
  const id = String(row['id'] || '');
  const previous = MOCK_PRODUCTION_ORDERS.find((item) => item.id === id);
  const next = { ...row };
  const linked = MOCK_EXPORT_ORDERS.find(
    (item) => item.productionOrderId === id || item.number === row['workOrderNumber'],
  );
  if (next['approvalStatus'] === 'approved' && previous?.approvalStatus !== 'approved') {
    if (!next['scheduledDate']) {
      next['scheduledDate'] = new Date().toISOString().slice(0, 10);
    }
    if (linked) linked.productionDate = String(next['scheduledDate']);
    const work = MOCK_WORK_ORDERS.find((item) => item.number === row['workOrderNumber']);
    if (work && !['invoiced', 'closed'].includes(work.status)) work.status = 'in-production';
  }
  if (next['approvalStatus'] === 'rejected' && previous?.approvalStatus !== 'rejected') {
    const work = MOCK_WORK_ORDERS.find((item) => item.number === row['workOrderNumber']);
    if (work && !['invoiced', 'closed'].includes(work.status)) work.status = 'new';
  }
  if (next['rescheduleStatus'] === 'approved' && previous?.rescheduleStatus === 'pending') {
    if (linked && linked.loadingRequestStatus === 'pending') {
      linked.loadingDate = String(next['rescheduleDate'] || linked.requestedLoadingDate || linked.loadingDate);
      linked.loadingRequestStatus = 'approved';
    }
  }
  if (next['rescheduleStatus'] === 'rejected' && previous?.rescheduleStatus === 'pending') {
    if (linked) linked.loadingRequestStatus = 'rejected';
  }
  return syncQcParent(next);
}

/** Local work order — محلي فقط، ويُرسل إلى أوامر الإنتاج للاعتماد. */
export function prepareWorkOrder(row: Record<string, unknown>): Record<string, unknown> {
  const next = applyStockPlan({ ...row, channel: 'local', currency: 'EGP', exchangeRate: 1 }, false);
  const lines = parseSalesLines(next['linesJson']);
  if (lines.length) next['totalPrice'] = salesLinesTotal(lines);
  if (!next['productName']) next['productName'] = lines[0]?.itemName || next['itemName'] || '';
  if (!next['id']) {
    next['id'] = `wo-${Date.now()}`;
    next['status'] = statusFromPlan(Number(next['availableFromStockKg']), Number(next['toProduceKg']));
    const parts = planStock(next).parts;
    spawnSalesOrder(
      String(next['number'] || ''),
      String(next['id']),
      'work-order',
      parts,
      next,
    );
    // المخازن تخصم الكمية المتاحة وتسجّل إذن صرف — الباقي يُصنَّع.
    deductPlannedStock(String(next['number'] || ''), parts, 'local');
    next['stockDeducted'] = true;
  }
  if (!next['date']) next['date'] = new Date().toISOString();
  return syncQcParent(next);
}

/** إرسال الفاتورة للمنظومة الضريبية — placeholder until the ETA API lands. */
export function prepareTaxInvoice(row: Record<string, unknown>): Record<string, unknown> {
  const next = { ...row };
  if (next['status'] === 'sent' && !next['sentAt']) {
    next['sentAt'] = new Date().toISOString();
    if (!next['eInvoiceUid']) {
      const issuer = MOCK_TAX_API_SETTINGS.posSerial || 'POS';
      next['eInvoiceUid'] = `EG-ETA-${issuer}-${String(Math.floor(10000 + Math.random() * 89999))}`;
    }
  }
  if (next['status'] === 'ready') {
    delete next['sentAt'];
  }
  return next;
}
