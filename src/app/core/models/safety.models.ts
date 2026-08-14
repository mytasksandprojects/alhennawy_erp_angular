/** السلامة والصحة المهنية والعيادة — Safety, OSH and factory clinic. */
import { Localized } from './common.models';


/** شهادات السلامة — fire system, civil defense, ISO 45001… */
export interface SafetyCertificate {
  id: string;
  typeKey: string;
  number: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  imageUrl?: string;
}

/** جزاءات الموظفين المتعلقة بالسلامة */
export interface EmployeePenalty {
  id: string;
  employeeName: string;
  date: string;
  reasonKey: string;
  kind: 'warning' | 'deduction' | 'suspension';
  amount?: number;
  notes?: string;
}

/** وثائق التأمين — على الموظفين وعلى المعدات */
export interface InsurancePolicy {
  id: string;
  kind: 'employee' | 'equipment';
  insuredName: string;
  policyNumber: string;
  provider: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'valid' | 'expiring' | 'expired';
}

/** عيادات المصنع */
export interface Clinic extends Localized {
  id: string;
  name: string;
  location: string;
  phone?: string;
  status: 'active' | 'inactive';
}

/** أطباء العيادات — مع شهاداتهم */
export interface Doctor extends Localized {
  id: string;
  name: string;
  clinicName: string;
  specialty: string;
  phone?: string;
  photoUrl?: string;
  /** شهادات الطبيب — `|`-joined file list, names in `#fragment`. */
  certificateFiles?: string;
}

/** أدوية العيادة — مخزون */
export interface ClinicMedicine extends Localized {
  id: string;
  name: string;
  unit: string;
  /** سعر الوحدة بالجنيه */
  price: number;
  stockQty: number;
  minQty: number;
  expiryDate?: string;
}

/** صرف دواء لموظف */
export interface MedicineDispense {
  id: string;
  date: string;
  medicineName: string;
  employeeName: string;
  /** Prefilled from the medicine's price; editable per dispense. */
  unitPrice?: number;
  quantity: number;
  doctorName?: string;
  notes?: string;
}

/** زيارات عيادة المصنع */
export interface ClinicVisit {
  id: string;
  date: string;
  employeeName: string;
  clinicName?: string;
  doctorName?: string;
  complaint: string;
  treatment: string;
  medicineCost: number;
  outcome: 'returned-to-work' | 'sent-home' | 'hospital-referral';
}
