/** الشئون الإدارية — Administration domain. */

export interface FleetVehicle {
  id: string;
  plate: string;
  modelName: string;
  status: 'active' | 'maintenance' | 'idle';
  fuelConsumptionLiters: number;
  licenseExpiry: string;
  insuranceExpiry: string;
  assignedToName?: string;
  driverName?: string;
  /** صورة رخصة المركبة */
  licenseImageUrl?: string;
  /** صورة السائق */
  driverImageUrl?: string;
  /** صورة رخصة السائق */
  driverLicenseImageUrl?: string;
  /** صورة تحليل المخدرات */
  drugTestImageUrl?: string;
}

/** مستندات المصنع — tax card, commercial register, licenses… */
export interface CompanyDocument {
  id: string;
  typeKey: string;
  number: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: 'valid' | 'expiring' | 'expired';
  imageUrl?: string;
}

export interface CustodyItem {
  id: string;
  number: string;
  descriptionKey: string;
  holderName: string;
  issuedAt: string;
  value: number;
  returned: boolean;
}

export interface AdminContract {
  id: string;
  number: string;
  titleKey: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  status: 'active' | 'expiring' | 'expired';
}

export interface VisitorPermit {
  id: string;
  number: string;
  visitorName: string;
  companyName?: string;
  purposeKey: string;
  date: string;
  status: 'issued' | 'used' | 'cancelled';
}
