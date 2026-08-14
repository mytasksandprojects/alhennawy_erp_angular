import { DashboardData } from '../../core/models/common.models';
import {
  Clinic,
  ClinicMedicine,
  ClinicVisit,
  Doctor,
  EmployeePenalty,
  InsurancePolicy,
  MedicineDispense,
  SafetyCertificate,
} from '../../core/models/safety.models';

/** MOCK LAYER — safety & OSH (certificates, penalties, insurance) + clinic. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

/** Placeholder scan — the real API returns uploaded attachment URLs. */
const IMG = 'assets/branding/alhennawy-logo.png';

export const MOCK_SAFETY_CERTIFICATES: SafetyCertificate[] = [
  { id: 'sc-1', typeKey: 'safety.certTypes.fireSystem', number: 'FS-2026-114', issuer: 'الحماية المدنية — المنوفية', issueDate: daysAgo(200), expiryDate: daysAhead(165), status: 'valid', imageUrl: IMG },
  { id: 'sc-2', typeKey: 'safety.certTypes.civilDefense', number: 'CD-2025-882', issuer: 'الحماية المدنية — المنوفية', issueDate: daysAgo(340), expiryDate: daysAhead(25), status: 'expiring', imageUrl: IMG },
  { id: 'sc-3', typeKey: 'safety.certTypes.iso45001', number: '45001:2018-EG-77', issuer: 'TÜV Rheinland', issueDate: daysAgo(400), expiryDate: daysAhead(330), status: 'valid', imageUrl: IMG },
  { id: 'sc-4', typeKey: 'safety.certTypes.boilerInspection', number: 'BLR-0093', issuer: 'هيئة التفتيش الهندسي', issueDate: daysAgo(380), expiryDate: daysAgo(10), status: 'expired', imageUrl: IMG },
];

export const MOCK_PENALTIES: EmployeePenalty[] = [
  { id: 'pn-1', employeeName: 'خالد عبد العزيز', date: daysAgo(6), reasonKey: 'safety.penaltyReasons.noPpe', kind: 'warning', notes: 'عدم ارتداء خوذة داخل الصالة' },
  { id: 'pn-2', employeeName: 'أحمد الحناوي', date: daysAgo(14), reasonKey: 'safety.penaltyReasons.smoking', kind: 'deduction', amount: 500, notes: 'التدخين بجوار مخزن الكيماويات' },
  { id: 'pn-3', employeeName: 'مصطفى رمضان', date: daysAgo(40), reasonKey: 'safety.penaltyReasons.unsafeAct', kind: 'suspension', amount: 0, notes: 'تشغيل معدة بدون تصريح — إيقاف يومين' },
];

export const MOCK_INSURANCE: InsurancePolicy[] = [
  { id: 'ins-1', kind: 'employee', insuredName: 'جميع عمال الإنتاج (118)', policyNumber: 'GRP-2026-011', provider: 'مصر للتأمين', startDate: daysAgo(200), endDate: daysAhead(165), premium: 236000, status: 'valid' },
  { id: 'ins-2', kind: 'employee', insuredName: 'الإداريون والمعمل (54)', policyNumber: 'GRP-2026-012', provider: 'مصر للتأمين', startDate: daysAgo(200), endDate: daysAhead(165), premium: 97000, status: 'valid' },
  { id: 'ins-3', kind: 'equipment', insuredName: 'ماكينة الورق MP-1', policyNumber: 'EQP-2025-303', provider: 'gig مصر', startDate: daysAgo(330), endDate: daysAhead(35), premium: 410000, status: 'expiring' },
  { id: 'ins-4', kind: 'equipment', insuredName: 'الميزان + معدات المخازن', policyNumber: 'EQP-2025-304', provider: 'gig مصر', startDate: daysAgo(330), endDate: daysAgo(5), premium: 88000, status: 'expired' },
];

export const MOCK_CLINICS: Clinic[] = [
  { id: 'cl-1', name: 'عيادة المصنع الرئيسية', name_en: 'Main Factory Clinic', location: 'مبنى الإدارة — الدور الأرضي', location_en: 'Admin Building — Ground Floor', phone: '048-2233441', status: 'active' },
  { id: 'cl-2', name: 'نقطة إسعاف الصالة', name_en: 'Hall First-Aid Point', location: 'صالة الإنتاج — بجوار MP-1', location_en: 'Production Hall — next to MP-1', phone: '048-2233442', status: 'active' },
];

const DOCTOR_CERTS = `${IMG}#شهادة بكالوريوس الطب.pdf|${IMG}#ترخيص مزاولة المهنة.pdf`;

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'dr-1', name: 'د. هشام عادل', name_en: 'Dr. Hesham Adel', clinicName: 'عيادة المصنع الرئيسية', specialty: 'طب عام', specialty_en: 'General Medicine', phone: '0100-555-0111', photoUrl: IMG, certificateFiles: DOCTOR_CERTS },
  { id: 'dr-2', name: 'د. منى الشاذلي', name_en: 'Dr. Mona El Shazly', clinicName: 'عيادة المصنع الرئيسية', specialty: 'طب مهني', specialty_en: 'Occupational Medicine', phone: '0100-555-0112', photoUrl: IMG, certificateFiles: `${IMG}#شهادة طب مهني.pdf` },
  { id: 'dr-3', name: 'د. كريم فوزي', name_en: 'Dr. Karim Fawzy', clinicName: 'نقطة إسعاف الصالة', specialty: 'إسعافات أولية', specialty_en: 'First Aid', phone: '0100-555-0113', photoUrl: IMG, certificateFiles: DOCTOR_CERTS },
];

export const MOCK_CLINIC_MEDICINES: ClinicMedicine[] = [
  { id: 'cm-1', name: 'باراسيتامول 500 مجم', name_en: 'Paracetamol 500 mg', unit: 'شريط', price: 18, stockQty: 84, minQty: 30, expiryDate: daysAhead(400) },
  { id: 'cm-2', name: 'مطهر بيتادين', name_en: 'Betadine Antiseptic', unit: 'زجاجة', price: 65, stockQty: 12, minQty: 10, expiryDate: daysAhead(700) },
  { id: 'cm-3', name: 'شاش وضمادات معقمة', name_en: 'Sterile Gauze & Bandages', unit: 'علبة', price: 42, stockQty: 45, minQty: 20 },
  { id: 'cm-4', name: 'مضاد حيوي موضعي', name_en: 'Topical Antibiotic', unit: 'أنبوبة', price: 95, stockQty: 6, minQty: 8, expiryDate: daysAhead(200) },
  { id: 'cm-5', name: 'محلول غسيل عين', name_en: 'Eye Wash Solution', unit: 'زجاجة', price: 55, stockQty: 9, minQty: 5, expiryDate: daysAhead(150) },
];

export const MOCK_MEDICINE_DISPENSES: MedicineDispense[] = [
  { id: 'md-1', date: daysAgo(0), medicineName: 'مطهر بيتادين', employeeName: 'أحمد الحناوي', unitPrice: 65, quantity: 1, doctorName: 'د. هشام عادل', notes: 'بعد إصابة اليد' },
  { id: 'md-2', date: daysAgo(0), medicineName: 'شاش وضمادات معقمة', employeeName: 'أحمد الحناوي', unitPrice: 42, quantity: 2, doctorName: 'د. هشام عادل' },
  { id: 'md-3', date: daysAgo(1), medicineName: 'باراسيتامول 500 مجم', employeeName: 'سارة محمود', unitPrice: 18, quantity: 1, doctorName: 'د. منى الشاذلي' },
  { id: 'md-4', date: daysAgo(3), medicineName: 'مضاد حيوي موضعي', employeeName: 'خالد عبد العزيز', unitPrice: 95, quantity: 1, doctorName: 'د. كريم فوزي', notes: 'مع تحويل للمستشفى' },
];

export const MOCK_CLINIC_VISITS: ClinicVisit[] = [
  { id: 'cv-1', date: daysAgo(0), employeeName: 'أحمد الحناوي', clinicName: 'عيادة المصنع الرئيسية', doctorName: 'د. هشام عادل', complaint: 'قطع سطحي في اليد أثناء المناولة', treatment: 'تطهير وضماد', medicineCost: 120, outcome: 'returned-to-work' },
  { id: 'cv-2', date: daysAgo(1), employeeName: 'سارة محمود', clinicName: 'عيادة المصنع الرئيسية', doctorName: 'د. منى الشاذلي', complaint: 'صداع وارتفاع حرارة', treatment: 'خافض حرارة وراحة', medicineCost: 85, outcome: 'sent-home' },
  { id: 'cv-3', date: daysAgo(3), employeeName: 'خالد عبد العزيز', clinicName: 'نقطة إسعاف الصالة', doctorName: 'د. كريم فوزي', complaint: 'التواء في الكاحل بالمخزن', treatment: 'تثبيت وتحويل للمستشفى للأشعة', medicineCost: 240, outcome: 'hospital-referral' },
];

export const SAFETY_DASHBOARD: DashboardData = {
  stats: [
    { id: 'certs', labelKey: 'safety.stats.validCertificates', value: 2, icon: 'certificate', toneToken: 'success' },
    { id: 'expiring', labelKey: 'safety.stats.expiringCertificates', value: 1, icon: 'clock', toneToken: 'warning' },
    { id: 'expired', labelKey: 'safety.stats.expiredCertificates', value: 1, icon: 'alert', toneToken: 'danger' },
    { id: 'policies', labelKey: 'safety.stats.activePolicies', value: 4, icon: 'shield' },
    { id: 'daysNoAccident', labelKey: 'safety.stats.daysWithoutAccident', value: 3, icon: 'check', unitKey: 'units.day' },
  ],
  charts: [
    {
      id: 'insurance-by-kind',
      titleKey: 'safety.charts.insuranceByKind',
      kind: 'donut',
      points: [
        { labelKey: 'safety.insuranceKinds.employee', value: 2 },
        { labelKey: 'safety.insuranceKinds.equipment', value: 2 },
      ],
    },
  ],
  alerts: [
    { id: 'sfa-1', messageKey: 'safety.alerts.certificateExpiring', params: ['CD-2025-882', 25], severity: 'warning', date: daysAgo(0) },
    { id: 'sfa-2', messageKey: 'safety.alerts.insuranceExpired', params: ['EQP-2025-304'], severity: 'danger', date: daysAgo(0) },
  ],
};

export const CLINIC_DASHBOARD: DashboardData = {
  stats: [
    { id: 'today', labelKey: 'clinic.stats.todayVisits', value: 1, icon: 'plus' },
    { id: 'month', labelKey: 'clinic.stats.monthVisits', value: 14, icon: 'calendar' },
    { id: 'referrals', labelKey: 'clinic.stats.hospitalReferrals', value: 1, icon: 'alert', toneToken: 'warning' },
    { id: 'medicine', labelKey: 'clinic.stats.medicineCost', value: 3850, icon: 'money', unitKey: 'units.egp' },
    { id: 'dispenses', labelKey: 'clinic.stats.monthDispenses', value: 23, icon: 'clinic' },
    { id: 'lowStock', labelKey: 'clinic.stats.lowStockMedicines', value: 1, icon: 'alert', toneToken: 'danger' },
  ],
  charts: [
    {
      id: 'visits-outcomes',
      titleKey: 'clinic.charts.outcomes',
      kind: 'donut',
      points: [
        { labelKey: 'clinic.outcomes.returned-to-work', value: 10 },
        { labelKey: 'clinic.outcomes.sent-home', value: 3 },
        { labelKey: 'clinic.outcomes.hospital-referral', value: 1 },
      ],
    },
    {
      id: 'monthly-visits',
      titleKey: 'clinic.charts.monthlyVisits',
      kind: 'columns',
      points: [
        { labelKey: 'months.mar', value: 18 },
        { labelKey: 'months.apr', value: 11 },
        { labelKey: 'months.may', value: 16 },
        { labelKey: 'months.jun', value: 9 },
        { labelKey: 'months.jul', value: 13 },
        { labelKey: 'months.aug', value: 14 },
      ],
    },
    {
      id: 'top-medicines',
      titleKey: 'clinic.charts.topMedicines',
      kind: 'bars',
      points: [
        { label: 'باراسيتامول 500 مجم', value: 9 },
        { label: 'شاش وضمادات معقمة', value: 6 },
        { label: 'مطهر بيتادين', value: 5 },
        { label: 'مضاد حيوي موضعي', value: 3 },
      ],
    },
  ],
  alerts: [
    { id: 'cla-1', messageKey: 'clinic.alerts.medicineLow', params: ['مضاد حيوي موضعي'], severity: 'warning', date: daysAgo(0) },
  ],
};
