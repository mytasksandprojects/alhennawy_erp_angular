import { SalesSettings } from '../../core/models/sales.models';

/**
 * MOCK LAYER — sales preferences edited from المبيعات → إعدادات المبيعات.
 * `warehouseIds` limits which stock items appear in order item dropdowns;
 * the text blocks are printed on proforma documents.
 */
export const MOCK_SALES_SETTINGS: SalesSettings = {
  id: 'sales-settings',
  warehouseIds: 'wh-fin1,wh-fin2',
  termsConditions:
    'الأسعار بالدولار الأمريكي وتشمل التعبئة دون الشحن.\n' +
    'يسري عرض السعر لمدة الصلاحية الموضحة.\n' +
    'تُسلم البضاعة حسب جدول الإنتاج المعتمد.',
  bankInfo: 'National Bank of Egypt — USD Account 000123456789 — SWIFT NBEGEGCX',
  paymentOptions: '30% دفعة مقدمة — 70% عند الشحن (TT) أو اعتماد مستندي',
  proformaExpiryDays: 15,
};

export function getSalesSettings(): SalesSettings {
  return MOCK_SALES_SETTINGS;
}

export function saveSalesSettings(body: unknown): SalesSettings {
  const draft = body as Partial<SalesSettings>;
  Object.assign(MOCK_SALES_SETTINGS, draft, { id: MOCK_SALES_SETTINGS.id });
  MOCK_SALES_SETTINGS.proformaExpiryDays =
    Number(MOCK_SALES_SETTINGS.proformaExpiryDays) || 0;
  return MOCK_SALES_SETTINGS;
}

/** Selected warehouses, or every warehouse when none were picked. */
export function salesWarehouseIds(): string[] {
  return MOCK_SALES_SETTINGS.warehouseIds
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}
