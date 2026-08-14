import { DashboardData } from '../../core/models/common.models';
import {
  ChemicalsOutput,
  ChemicalsPurchase,
  ChemicalsStaff,
} from '../../core/models/chemicals.models';

/** MOCK LAYER — مصنع الكيماويات: output, staff and purchases. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

/** Placeholder scan — the real API returns uploaded attachment URLs. */
const IMG = 'assets/branding/alhennawy-logo.png';

export const MOCK_CHEM_OUTPUT: ChemicalsOutput[] = [
  { id: 'co-1', date: daysAgo(0), product: 'صودا كاوية 50%', product_en: 'Caustic Soda 50%', quantityKg: 4200, batchNumber: 'CHB-2026-081', notes: 'تشغيلة صباحية' },
  { id: 'co-2', date: daysAgo(1), product: 'هيبوكلوريت الصوديوم', product_en: 'Sodium Hypochlorite', quantityKg: 2650, batchNumber: 'CHB-2026-080' },
  { id: 'co-3', date: daysAgo(2), product: 'شبة (كبريتات الألومنيوم)', product_en: 'Alum (Aluminium Sulphate)', quantityKg: 3900, batchNumber: 'CHB-2026-079' },
  { id: 'co-4', date: daysAgo(3), product: 'صودا كاوية 50%', product_en: 'Caustic Soda 50%', quantityKg: 4050, batchNumber: 'CHB-2026-078', notes: 'جودة مطابقة' },
];

export const MOCK_CHEM_STAFF: ChemicalsStaff[] = [
  { id: 'cs-1', code: 'CHM-001', name: 'إبراهيم السيد', name_en: 'Ibrahim El Sayed', role: 'مدير المصنع', role_en: 'Factory Manager', phone: '0101-777-2001', salary: 24000, status: 'active', photoUrl: IMG },
  { id: 'cs-2', code: 'CHM-014', name: 'وليد جمعة', name_en: 'Walid Gomaa', role: 'مهندس إنتاج', role_en: 'Production Engineer', phone: '0101-777-2014', salary: 17500, status: 'active', photoUrl: IMG },
  { id: 'cs-3', code: 'CHM-022', name: 'حسن عبد الرحمن', name_en: 'Hassan Abdelrahman', role: 'فني خلط', role_en: 'Mixing Technician', phone: '0101-777-2022', salary: 11200, status: 'active', photoUrl: IMG },
  { id: 'cs-4', code: 'CHM-031', name: 'ياسر فتحي', name_en: 'Yasser Fathy', role: 'أمين مخزن كيماويات', role_en: 'Chemicals Storekeeper', phone: '0101-777-2031', salary: 10400, status: 'on-leave', photoUrl: IMG },
];

export const MOCK_CHEM_RAW_PURCHASES: ChemicalsPurchase[] = [
  { id: 'crp-1', date: daysAgo(2), item: 'ملح صناعي (كلوريد صوديوم)', supplier: 'شركة النصر للأملاح', quantity: 25000, unit: 'كجم', total: 187500, currency: 'EGP', exchangeRate: 1, status: 'received' },
  { id: 'crp-2', date: daysAgo(6), item: 'حمض كبريتيك 98%', supplier: 'كيما أسوان', quantity: 8000, unit: 'كجم', total: 168000, currency: 'EGP', exchangeRate: 1, status: 'paid' },
  { id: 'crp-3', date: daysAgo(9), item: 'ألومنيوم هيدروكسيد', supplier: 'Egypt Alum Co.', quantity: 12000, unit: 'كجم', total: 402000, currency: 'EGP', exchangeRate: 1, status: 'ordered' },
];

export const MOCK_CHEM_OP_PURCHASES: ChemicalsPurchase[] = [
  { id: 'cop-1', date: daysAgo(1), item: 'قطع غيار مضخة جرعات', supplier: 'الهندسية للمعدات', total: 34500, currency: 'EGP', exchangeRate: 1, status: 'received' },
  { id: 'cop-2', date: daysAgo(5), item: 'مهمات وقاية (أقنعة + قفازات)', supplier: 'السلامة الحديثة', quantity: 120, unit: 'طقم', total: 21600, currency: 'EGP', exchangeRate: 1, status: 'paid' },
  { id: 'cop-3', date: daysAgo(12), item: 'صيانة غلاية البخار', supplier: 'بويلر تك مصر', total: 58000, currency: 'EGP', exchangeRate: 1, status: 'ordered' },
];

export const CHEMICALS_DASHBOARD: DashboardData = {
  stats: [
    { id: 'output', labelKey: 'chemicals.stats.monthOutput', value: 96400, icon: 'production', unitKey: 'units.kg', trendPercent: 6 },
    { id: 'staff', labelKey: 'chemicals.stats.staffCount', value: 38, icon: 'hr' },
    { id: 'raw', labelKey: 'chemicals.stats.rawSpend', value: 757500, icon: 'purchasing', unitKey: 'units.egp' },
    { id: 'op', labelKey: 'chemicals.stats.opSpend', value: 114100, icon: 'wrench', unitKey: 'units.egp' },
  ],
  charts: [
    {
      id: 'monthly-output',
      titleKey: 'chemicals.charts.monthlyOutput',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 82100 },
        { labelKey: 'months.apr', value: 88500 },
        { labelKey: 'months.may', value: 91200 },
        { labelKey: 'months.jun', value: 87400 },
        { labelKey: 'months.jul', value: 94800 },
        { labelKey: 'months.aug', value: 96400 },
      ],
    },
    {
      id: 'output-by-product',
      titleKey: 'chemicals.charts.outputByProduct',
      kind: 'donut',
      points: [
        { label: 'صودا كاوية 50%', value: 46200 },
        { label: 'هيبوكلوريت الصوديوم', value: 28300 },
        { label: 'شبة (كبريتات الألومنيوم)', value: 21900 },
      ],
    },
  ],
  alerts: [
    { id: 'cha-1', messageKey: 'chemicals.alerts.rawLow', params: ['ملح صناعي'], severity: 'warning', date: daysAgo(0) },
  ],
};
