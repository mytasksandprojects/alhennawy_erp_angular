/**
 * إعدادات منظومة الفاتورة الإلكترونية — Egyptian Tax Authority (ETA)
 * e-invoice API connection settings. Credentials come from the
 * company's ETA portal registration; the API integration itself is
 * wired when the real backend lands.
 */
export interface TaxApiSettings {
  id: string;
  /** Automatic submission of tax invoices to the ETA portal. */
  enabled: boolean;
  /** preprod = test portal, production = live invoicing. */
  environment: 'preprod' | 'production';
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  /** الرقم الضريبي — company tax registration number. */
  registrationNumber: string;
  /** كود الفرع — branch code registered on the ETA portal. */
  branchCode: string;
  /** كود النشاط — company activity code. */
  activityCode: string;
  /** الرقم التسلسلي لجهاز الإصدار — POS/issuer serial number. */
  posSerial: string;
  /** نوع المُصدِر — business (B) or natural person (P). */
  issuerType: 'business' | 'person';
  /** ETA document version, e.g. "1.0". */
  documentVersion: string;
  lastTestOk?: boolean;
  lastTestAt?: string;
}
