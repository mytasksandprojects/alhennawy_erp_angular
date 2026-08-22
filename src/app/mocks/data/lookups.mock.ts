import { LookupValue } from '../../core/models/system.models';
import { MOCK_EMPLOYEES } from './hr.mock';
import { MOCK_STOCK_ITEMS } from './warehouse.mock';
import { MOCK_ROLES } from './roles.mock';
import {
  MOCK_CLINIC_MEDICINES,
  MOCK_CLINICS,
  MOCK_DOCTORS,
} from './safety.mock';

/**
 * MOCK LAYER — admin-managed dropdown lists (System & Audit → Dropdown
 * Lists). Seeded values reuse i18n keys so existing records render
 * translated; admin-added rows carry their own Arabic/English labels.
 */
const lk = (
  id: string,
  group: string,
  value: string,
  labelAr: string,
  labelEn: string,
  rate?: number,
): LookupValue => ({ id, group, value, labelAr, labelEn, rate });

export const MOCK_LOOKUP_VALUES: LookupValue[] = [
  lk('lv-1', 'leaveTypes', 'hr.leaveTypes.annual', 'اعتيادية', 'Annual'),
  lk('lv-2', 'leaveTypes', 'hr.leaveTypes.casual', 'عارضة', 'Casual'),
  lk('lv-3', 'leaveTypes', 'hr.leaveTypes.sick', 'مرضية', 'Sick'),
  lk('lv-4', 'leaveTypes', 'hr.leaveTypes.unpaid', 'بدون أجر', 'Unpaid'),

  lk('lv-10', 'expenseCategories', 'finance.expenseCategories.rawMaterials', 'خامات', 'Raw Materials'),
  lk('lv-11', 'expenseCategories', 'finance.expenseCategories.salaries', 'أجور ومرتبات', 'Salaries & Wages'),
  lk('lv-12', 'expenseCategories', 'finance.expenseCategories.energy', 'طاقة ومرافق', 'Energy & Utilities'),
  lk('lv-13', 'expenseCategories', 'finance.expenseCategories.maintenance', 'صيانة', 'Maintenance'),
  lk('lv-14', 'expenseCategories', 'finance.expenseCategories.logistics', 'شحن وجمارك', 'Logistics & Customs'),
  lk('lv-15', 'expenseCategories', 'finance.expenseCategories.other', 'أخرى', 'Other'),

  lk('lv-20', 'journalSources', 'finance.sources.weighbridge', 'الميزان', 'Weighbridge'),
  lk('lv-21', 'journalSources', 'finance.sources.export', 'التصدير', 'Export'),
  lk('lv-22', 'journalSources', 'finance.sources.customs', 'التخليص الجمركي', 'Customs Clearance'),

  lk('lv-30', 'bankNames', 'finance.banks.nbeEgp', 'البنك الأهلي المصري — جنيه', 'National Bank of Egypt — EGP'),
  lk('lv-31', 'bankNames', 'finance.banks.nbeUsd', 'البنك الأهلي المصري — دولار', 'National Bank of Egypt — USD'),
  lk('lv-32', 'bankNames', 'finance.banks.cibEgp', 'البنك التجاري الدولي — جنيه', 'CIB — EGP'),

  lk('lv-40', 'warehouseKinds', 'warehouse.kinds.spare-parts', 'قطع غيار', 'Spare Parts'),
  lk('lv-41', 'warehouseKinds', 'warehouse.kinds.chemicals', 'كيماويات', 'Chemicals'),
  lk('lv-42', 'warehouseKinds', 'warehouse.kinds.lab-virtual', 'معمل افتراضي (Tank)', 'Lab Virtual (Tank)'),
  lk('lv-43', 'warehouseKinds', 'warehouse.kinds.grease-oils', 'زيوت وشحوم', 'Oils & Grease'),
  lk('lv-44', 'warehouseKinds', 'warehouse.kinds.dasht-raw', 'دشت (خامات)', 'Dasht (Raw Material)'),
  lk('lv-45', 'warehouseKinds', 'warehouse.kinds.finished-first', 'منتج تام درجة أولى', 'Finished — First Grade'),
  lk('lv-46', 'warehouseKinds', 'warehouse.kinds.finished-second', 'منتج تام درجة ثانية', 'Finished — Second Grade'),

  lk('lv-70', 'companyDocTypes', 'administration.docTypes.taxCard', 'البطاقة الضريبية', 'Tax Card'),
  lk('lv-71', 'companyDocTypes', 'administration.docTypes.commercialRegister', 'السجل التجاري', 'Commercial Register'),
  lk('lv-72', 'companyDocTypes', 'administration.docTypes.industrialRegister', 'السجل الصناعي', 'Industrial Register'),
  lk('lv-73', 'companyDocTypes', 'administration.docTypes.operatingLicense', 'رخصة التشغيل', 'Operating License'),

  lk('lv-80', 'safetyCertTypes', 'safety.certTypes.fireSystem', 'شهادة نظام الحريق', 'Fire System Certificate'),
  lk('lv-81', 'safetyCertTypes', 'safety.certTypes.civilDefense', 'شهادة الحماية المدنية', 'Civil Defense Certificate'),
  lk('lv-82', 'safetyCertTypes', 'safety.certTypes.iso45001', 'ISO 45001', 'ISO 45001'),
  lk('lv-83', 'safetyCertTypes', 'safety.certTypes.boilerInspection', 'فحص الغلايات', 'Boiler Inspection'),

  lk('lv-90', 'penaltyReasons', 'safety.penaltyReasons.noPpe', 'عدم ارتداء مهمات الوقاية', 'No PPE Worn'),
  lk('lv-91', 'penaltyReasons', 'safety.penaltyReasons.smoking', 'التدخين في مناطق محظورة', 'Smoking in Restricted Area'),
  lk('lv-92', 'penaltyReasons', 'safety.penaltyReasons.unsafeAct', 'تصرف غير آمن', 'Unsafe Act'),

  // العملات — value is the ISO code; rate is the default rate to EGP.
  lk('lv-60', 'currencies', 'EGP', 'جنيه مصري (EGP)', 'Egyptian Pound (EGP)', 1),
  lk('lv-61', 'currencies', 'USD', 'دولار أمريكي (USD)', 'US Dollar (USD)', 48.5),
  lk('lv-62', 'currencies', 'EUR', 'يورو (EUR)', 'Euro (EUR)', 52.8),

  lk('lv-50', 'departments', 'departments.production', 'الإنتاج', 'Production'),
  // NOTE: 'clinics' and 'doctors' groups are built live from the clinic
  // module's own records — see liveLookups() below.
  lk('lv-51', 'departments', 'departments.warehouse', 'المخازن', 'Warehouses'),
  lk('lv-52', 'departments', 'departments.administration', 'الشؤون الإدارية', 'Administration'),
  lk('lv-53', 'departments', 'departments.quality', 'الجودة', 'Quality'),
  lk('lv-54', 'departments', 'departments.finance', 'المالية', 'Finance'),
  lk('lv-55', 'departments', 'departments.sales', 'المبيعات', 'Sales'),
  lk('lv-56', 'departments', 'departments.logistics', 'الشحن والتخليص', 'Logistics'),
];

/**
 * Currencies live in the shared lookup store but get their own admin
 * screen (Finance → Currencies). All handlers write to the same array,
 * so new currencies appear in every order/purchase form instantly.
 */
export function listCurrencies(): LookupValue[] {
  return MOCK_LOOKUP_VALUES.filter((row) => row.group === 'currencies');
}

/** EGP is the base currency: its rate is always 1, others need a rate. */
function normalizeRate(code: string, rate: unknown): number {
  if (code.toUpperCase() === 'EGP') return 1;
  const parsed = Number(rate);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function addCurrency(body: unknown): LookupValue {
  const draft = body as Partial<LookupValue>;
  const code = draft.value ?? '';
  // Spread first so extra language labels (label_<code>) are preserved.
  const row: LookupValue = {
    ...(draft as object),
    ...lk(
      `lv-cur-${Date.now()}`,
      'currencies',
      code,
      draft.labelAr ?? '',
      draft.labelEn ?? '',
      normalizeRate(code, draft.rate),
    ),
  };
  MOCK_LOOKUP_VALUES.unshift(row);
  return row;
}

export function updateCurrency(id: string, body: unknown): LookupValue | null {
  const index = MOCK_LOOKUP_VALUES.findIndex((row) => row.id === id);
  if (index < 0) return null;
  const draft = body as Partial<LookupValue>;
  const merged = { ...MOCK_LOOKUP_VALUES[index], ...draft, id, group: 'currencies' };
  merged.rate = normalizeRate(merged.value, merged.rate);
  MOCK_LOOKUP_VALUES[index] = merged;
  return MOCK_LOOKUP_VALUES[index];
}

export function deleteCurrency(id: string): { deleted: boolean } {
  const index = MOCK_LOOKUP_VALUES.findIndex((row) => row.id === id);
  if (index >= 0) MOCK_LOOKUP_VALUES.splice(index, 1);
  return { deleted: index >= 0 };
}

/**
 * Live lookup entry from a record with a multilang `name`: the stored
 * value stays the base name; labels use name_<code> when present.
 */
function liveLk(id: string, group: string, rec: object, rate?: number): LookupValue {
  const source = rec as Record<string, unknown>;
  const name = String(source['name'] ?? '');
  const nameEn = source['name_en'];
  const row = lk(
    id,
    group,
    name,
    name,
    typeof nameEn === 'string' && nameEn ? nameEn : name,
    rate,
  );
  const extras = row as unknown as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    if (key.startsWith('name_') && key !== 'name_en' && source[key]) {
      extras[`label_${key.slice('name_'.length)}`] = source[key];
    }
  }
  return row;
}

/**
 * Lookup groups derived from live records, so newly added clinics and
 * doctors appear in the visit form immediately.
 */
export function liveLookups(): LookupValue[] {
  return [
    ...MOCK_CLINICS.filter((c) => c.status === 'active').map((c) =>
      liveLk(`live-clinic-${c.id}`, 'clinics', c),
    ),
    ...MOCK_DOCTORS.map((d) => liveLk(`live-doctor-${d.id}`, 'doctors', d)),
    ...MOCK_EMPLOYEES.map((e) => liveLk(`live-emp-${e.id}`, 'employees', e)),
    ...MOCK_STOCK_ITEMS.map((item) => liveLk(`live-item-${item.code}`, 'stockItems', item)),
    ...MOCK_ROLES.map((role) =>
      lk(
        `live-role-${role.id}`,
        'roles',
        role.id,
        role.name ?? { admin: 'مدير النظام', finance: 'الإدارة المالية', store: 'أمين مخزن', operator: 'مشغل' }[role.id] ?? role.id,
        role.name_en ?? { admin: 'System Administrator', finance: 'Finance', store: 'Storekeeper', operator: 'Operator' }[role.id] ?? role.id,
      ),
    ),
    // rate carries the unit price so dispense forms prefill it.
    ...MOCK_CLINIC_MEDICINES.map((m) =>
      liveLk(`live-med-${m.id}`, 'clinicMedicines', m, m.price),
    ),
  ];
}
