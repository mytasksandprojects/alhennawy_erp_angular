import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const FLEET_COLUMNS: TableColumn[] = [
  { key: 'plate', labelKey: 'administration.fields.plate' },
  { key: 'modelName', labelKey: 'administration.fields.model', multilang: true },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'administration.vehicleStatus.',
    badgeToneMap: { active: 'success', maintenance: 'warning', idle: 'neutral' },
  },
  { key: 'fuelConsumptionLiters', labelKey: 'administration.fields.fuel', type: 'number' },
  { key: 'licenseExpiry', labelKey: 'administration.fields.licenseExpiry', type: 'date' },
  { key: 'insuranceExpiry', labelKey: 'administration.fields.insuranceExpiry', type: 'date' },
  { key: 'driverName', labelKey: 'administration.fields.driver', multilang: true },
  { key: 'driverImageUrl', labelKey: 'administration.fields.driverImage', type: 'image' },
  { key: 'licenseImageUrl', labelKey: 'administration.fields.licenseImage', type: 'image' },
  { key: 'driverLicenseImageUrl', labelKey: 'administration.fields.driverLicenseImage', type: 'image' },
  { key: 'drugTestImageUrl', labelKey: 'administration.fields.drugTest', type: 'image' },
];

/** مستندات المصنع — البطاقة الضريبية، السجل التجاري… */
export const DOCUMENT_COLUMNS: TableColumn[] = [
  { key: 'typeKey', labelKey: 'common.type', type: 'key' },
  { key: 'number', labelKey: 'common.number' },
  { key: 'issuer', labelKey: 'administration.fields.issuer', multilang: true },
  { key: 'issueDate', labelKey: 'administration.fields.issueDate', type: 'date' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'administration.docStatus.',
    badgeToneMap: { valid: 'success', expiring: 'warning', expired: 'danger' },
  },
  { key: 'imageUrl', labelKey: 'common.image', type: 'image' },
];

export const DOCUMENT_FIELDS: FormField[] = [
  { key: 'typeKey', labelKey: 'common.type', type: 'select', lookup: 'companyDocTypes', required: true },
  { key: 'number', labelKey: 'common.number', required: true },
  { key: 'issuer', labelKey: 'administration.fields.issuer', multilang: true },
  { key: 'issueDate', labelKey: 'administration.fields.issueDate', type: 'date' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('administration.docStatus.', ['valid', 'expiring', 'expired']) },
  { key: 'imageUrl', labelKey: 'common.image', type: 'images' },
];

export const CUSTODY_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'descriptionKey', labelKey: 'quality.fields.description', type: 'key' },
  { key: 'holderName', labelKey: 'administration.fields.holder', multilang: true },
  { key: 'issuedAt', labelKey: 'administration.fields.issuedAt', type: 'date' },
  { key: 'value', labelKey: 'common.value', type: 'currency' },
  {
    key: 'returned',
    labelKey: 'administration.fields.returned',
    type: 'badge',
    keyPrefix: 'common.bool.',
    badgeToneMap: { true: 'success', false: 'warning' },
  },
];

export const CONTRACT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'titleKey', labelKey: 'common.name', type: 'key' },
  { key: 'vendorName', labelKey: 'administration.fields.vendor', multilang: true },
  { key: 'startDate', labelKey: 'administration.fields.startDate', type: 'date' },
  { key: 'endDate', labelKey: 'administration.fields.endDate', type: 'date' },
  { key: 'monthlyValue', labelKey: 'administration.fields.monthlyValue', type: 'currency' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'administration.contractStatus.',
    badgeToneMap: { active: 'success', expiring: 'warning', expired: 'danger' },
  },
];

export const PERMIT_COLUMNS: TableColumn[] = [
  { key: 'number', labelKey: 'common.number' },
  { key: 'visitorName', labelKey: 'administration.fields.visitor', multilang: true },
  { key: 'companyName', labelKey: 'administration.fields.company', multilang: true },
  { key: 'purposeKey', labelKey: 'administration.fields.purpose', type: 'key' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'administration.permitStatus.',
    badgeToneMap: { issued: 'info', used: 'success', cancelled: 'danger' },
  },
];

export const FLEET_FIELDS: FormField[] = [
  { key: 'plate', labelKey: 'administration.fields.plate', required: true },
  { key: 'modelName', labelKey: 'administration.fields.model', multilang: true },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('administration.vehicleStatus.', ['active', 'maintenance', 'idle']) },
  { key: 'fuelConsumptionLiters', labelKey: 'administration.fields.fuel', type: 'number' },
  { key: 'licenseExpiry', labelKey: 'administration.fields.licenseExpiry', type: 'date' },
  { key: 'insuranceExpiry', labelKey: 'administration.fields.insuranceExpiry', type: 'date' },
  { key: 'assignedToName', labelKey: 'administration.fields.assignedTo', multilang: true },
  { key: 'driverName', labelKey: 'administration.fields.driver', multilang: true },
  { key: 'driverImageUrl', labelKey: 'administration.fields.driverImage', type: 'images' },
  { key: 'licenseImageUrl', labelKey: 'administration.fields.licenseImage', type: 'images' },
  { key: 'driverLicenseImageUrl', labelKey: 'administration.fields.driverLicenseImage', type: 'images' },
  { key: 'drugTestImageUrl', labelKey: 'administration.fields.drugTest', type: 'images' },
];

export const CUSTODY_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'CST' },
  { key: 'descriptionKey', labelKey: 'quality.fields.description' },
  { key: 'holderName', labelKey: 'administration.fields.holder', multilang: true },
  { key: 'issuedAt', labelKey: 'administration.fields.issuedAt', type: 'date' },
  { key: 'value', labelKey: 'common.value', type: 'number' },
];

export const CONTRACT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'CNT' },
  { key: 'titleKey', labelKey: 'common.name' },
  { key: 'vendorName', labelKey: 'administration.fields.vendor', multilang: true },
  { key: 'startDate', labelKey: 'administration.fields.startDate', type: 'date' },
  { key: 'endDate', labelKey: 'administration.fields.endDate', type: 'date' },
  { key: 'monthlyValue', labelKey: 'administration.fields.monthlyValue', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('administration.contractStatus.', ['active', 'expiring', 'expired']) },
];

export const PERMIT_FIELDS: FormField[] = [
  { key: 'number', labelKey: 'common.number', generated: true, generatedPrefix: 'PMT' },
  { key: 'visitorName', labelKey: 'administration.fields.visitor', multilang: true },
  { key: 'companyName', labelKey: 'administration.fields.company', multilang: true },
  { key: 'purposeKey', labelKey: 'administration.fields.purpose' },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('administration.permitStatus.', ['issued', 'used', 'cancelled']) },
];
