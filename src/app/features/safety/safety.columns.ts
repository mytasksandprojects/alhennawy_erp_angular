import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

const CERT_STATUS = {
  key: 'status',
  labelKey: 'common.status',
  type: 'badge',
  keyPrefix: 'safety.certStatus.',
  badgeToneMap: { valid: 'success', expiring: 'warning', expired: 'danger' },
} as const;

/** شهادات السلامة (بما فيها شهادات أنظمة الحريق). */
export const CERTIFICATE_COLUMNS: TableColumn[] = [
  { key: 'typeKey', labelKey: 'common.type', type: 'key' },
  { key: 'number', labelKey: 'common.number' },
  { key: 'issuer', labelKey: 'administration.fields.issuer', multilang: true },
  { key: 'issueDate', labelKey: 'administration.fields.issueDate', type: 'date' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
  { ...CERT_STATUS },
  { key: 'imageUrl', labelKey: 'common.image', type: 'image' },
];

export const CERTIFICATE_FIELDS: FormField[] = [
  { key: 'typeKey', labelKey: 'common.type', type: 'select', lookup: 'safetyCertTypes', required: true },
  { key: 'number', labelKey: 'common.number', required: true },
  { key: 'issuer', labelKey: 'administration.fields.issuer', multilang: true },
  { key: 'issueDate', labelKey: 'administration.fields.issueDate', type: 'date' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('safety.certStatus.', ['valid', 'expiring', 'expired']) },
  { key: 'imageUrl', labelKey: 'common.image', type: 'images' },
];

/** التأمين — على الموظفين وعلى المعدات. */
export const INSURANCE_COLUMNS: TableColumn[] = [
  {
    key: 'kind',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'safety.insuranceKinds.',
    badgeToneMap: { employee: 'info', equipment: 'neutral' },
  },
  { key: 'insuredName', labelKey: 'safety.fields.insured', multilang: true },
  { key: 'policyNumber', labelKey: 'safety.fields.policyNo' },
  { key: 'provider', labelKey: 'safety.fields.provider', multilang: true },
  { key: 'startDate', labelKey: 'administration.fields.startDate', type: 'date' },
  { key: 'endDate', labelKey: 'administration.fields.endDate', type: 'date' },
  { key: 'premium', labelKey: 'safety.fields.premium', type: 'currency' },
  { ...CERT_STATUS },
];

export const INSURANCE_FIELDS: FormField[] = [
  { key: 'kind', labelKey: 'common.type', type: 'select', options: keysToOptions('safety.insuranceKinds.', ['employee', 'equipment']), required: true },
  { key: 'insuredName', labelKey: 'safety.fields.insured', required: true, multilang: true },
  { key: 'policyNumber', labelKey: 'safety.fields.policyNo', required: true },
  { key: 'provider', labelKey: 'safety.fields.provider', multilang: true },
  { key: 'startDate', labelKey: 'administration.fields.startDate', type: 'date' },
  { key: 'endDate', labelKey: 'administration.fields.endDate', type: 'date' },
  { key: 'premium', labelKey: 'safety.fields.premium', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('safety.certStatus.', ['valid', 'expiring', 'expired']) },
];
