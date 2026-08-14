import {
  AdminContract,
  CompanyDocument,
  CustodyItem,
  FleetVehicle,
  VisitorPermit,
} from '../../core/models/administration.models';

/** MOCK LAYER — administration (fleet, custody, contracts, permits, docs). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

/** Placeholder scan — the real API returns uploaded attachment URLs. */
const IMG = 'assets/branding/alhennawy-logo.png';

export const MOCK_FLEET: FleetVehicle[] = [
  { id: 'v-1', plate: 'س ن ع 4821', modelName: 'Mercedes Actros 2018', status: 'active', fuelConsumptionLiters: 1240, licenseExpiry: daysAhead(90), insuranceExpiry: daysAhead(200), assignedToName: 'محمد عبدالله', driverName: 'محمد عبدالله', licenseImageUrl: IMG, driverImageUrl: IMG, driverLicenseImageUrl: IMG, drugTestImageUrl: IMG },
  { id: 'v-2', plate: 'ق ل م 7710', modelName: 'Volvo FH16 2020', status: 'active', fuelConsumptionLiters: 1010, licenseExpiry: daysAhead(15), insuranceExpiry: daysAhead(320), assignedToName: 'أحمد سعيد', driverName: 'أحمد سعيد', licenseImageUrl: IMG, driverImageUrl: IMG, drugTestImageUrl: IMG },
  { id: 'v-3', plate: 'م ص ر 1188', modelName: 'MAN TGS 2016', status: 'maintenance', fuelConsumptionLiters: 460, licenseExpiry: daysAhead(150), insuranceExpiry: daysAgo(4), licenseImageUrl: IMG },
  { id: 'v-4', plate: 'أ ب ج 3355', modelName: 'Toyota Hilux 2022', status: 'idle', fuelConsumptionLiters: 180, licenseExpiry: daysAhead(400), insuranceExpiry: daysAhead(380) },
];

/** مستندات المصنع — البطاقة الضريبية والسجل التجاري وغيرها. */
export const MOCK_COMPANY_DOCUMENTS: CompanyDocument[] = [
  { id: 'doc-1', typeKey: 'administration.docTypes.taxCard', number: '204-891-337', issuer: 'مصلحة الضرائب المصرية', issueDate: daysAgo(700), expiryDate: daysAhead(400), status: 'valid', imageUrl: IMG },
  // Front + back scans — image fields accept multiple files/links.
  { id: 'doc-2', typeKey: 'administration.docTypes.commercialRegister', number: '88412 المنوفية', issuer: 'الهيئة العامة للاستثمار', issueDate: daysAgo(2200), expiryDate: daysAhead(120), status: 'valid', imageUrl: `${IMG}|${IMG}` },
  { id: 'doc-3', typeKey: 'administration.docTypes.industrialRegister', number: 'IND-2031-55', issuer: 'هيئة التنمية الصناعية', issueDate: daysAgo(1500), expiryDate: daysAhead(30), status: 'expiring', imageUrl: IMG },
  { id: 'doc-4', typeKey: 'administration.docTypes.operatingLicense', number: 'OPR-0117', issuer: 'محافظة المنوفية', issueDate: daysAgo(1100), expiryDate: daysAgo(15), status: 'expired', imageUrl: IMG },
];

export const MOCK_CUSTODY: CustodyItem[] = [
  { id: 'c-1', number: 'CST-2026-014', descriptionKey: 'administration.custody.laptop', holderName: 'محمد نبيل', issuedAt: daysAgo(120), value: 32000, returned: false },
  { id: 'c-2', number: 'CST-2026-015', descriptionKey: 'administration.custody.cashAdvance', holderName: 'خالد عبد العزيز', issuedAt: daysAgo(9), value: 15000, returned: false },
  { id: 'c-3', number: 'CST-2025-098', descriptionKey: 'administration.custody.mobile', holderName: 'سارة محمود', issuedAt: daysAgo(300), value: 18000, returned: true },
];

export const MOCK_CONTRACTS: AdminContract[] = [
  { id: 'ct-1', number: 'CTR-2025-08', titleKey: 'administration.contracts.security', vendorName: 'شركة الحراسة الآمنة', startDate: daysAgo(320), endDate: daysAhead(45), monthlyValue: 68000, status: 'expiring' },
  { id: 'ct-2', number: 'CTR-2025-11', titleKey: 'administration.contracts.cleaning', vendorName: 'النظافة المثالية', startDate: daysAgo(200), endDate: daysAhead(160), monthlyValue: 41000, status: 'active' },
  { id: 'ct-3', number: 'CTR-2024-19', titleKey: 'administration.contracts.maintenance', vendorName: 'المهندس للصيانة', startDate: daysAgo(500), endDate: daysAgo(10), monthlyValue: 25500, status: 'expired' },
];

export const MOCK_PERMITS: VisitorPermit[] = [
  { id: 'p-1', number: 'VIS-2026-0210', visitorName: 'مهندس معايرة الموازين', companyName: 'B-Force', purposeKey: 'administration.purposes.calibration', date: daysAgo(0), status: 'issued' },
  { id: 'p-2', number: 'VIS-2026-0209', visitorName: 'مندوب شركة الشحن', companyName: 'MSC Egypt', purposeKey: 'administration.purposes.shipping', date: daysAgo(1), status: 'used' },
];
