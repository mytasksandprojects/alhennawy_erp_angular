import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';

const OUTCOME_KEYS = ['returned-to-work', 'sent-home', 'hospital-referral'];

export const CLINIC_COLUMNS: TableColumn[] = [
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'location', labelKey: 'clinic.fields.location', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'clinic.clinicStatus.',
    badgeToneMap: { active: 'success', inactive: 'neutral' },
  },
];

const CLINIC_FIELDS: FormField[] = [
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'location', labelKey: 'clinic.fields.location', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('clinic.clinicStatus.', ['active', 'inactive']) },
];

export const DOCTOR_COLUMNS: TableColumn[] = [
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'image' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'clinicName', labelKey: 'clinic.fields.clinic' },
  { key: 'specialty', labelKey: 'clinic.fields.specialty', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  { key: 'certificateFiles', labelKey: 'clinic.fields.certificates', type: 'files' },
];

const DOCTOR_FIELDS: FormField[] = [
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'clinicName', labelKey: 'clinic.fields.clinic', type: 'select', lookup: 'clinics', required: true },
  { key: 'specialty', labelKey: 'clinic.fields.specialty', multilang: true },
  { key: 'phone', labelKey: 'clinic.fields.phone' },
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'images' },
  { key: 'certificateFiles', labelKey: 'clinic.fields.certificates', type: 'files' },
];

export const MEDICINE_COLUMNS: TableColumn[] = [
  { key: 'name', labelKey: 'clinic.fields.medicine', multilang: true },
  { key: 'unit', labelKey: 'chemicals.fields.unit' },
  { key: 'price', labelKey: 'clinic.fields.price', type: 'currency' },
  { key: 'stockQty', labelKey: 'clinic.fields.stockQty', type: 'number', align: 'center' },
  { key: 'minQty', labelKey: 'clinic.fields.minQty', type: 'number', align: 'center' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
];

const MEDICINE_FIELDS: FormField[] = [
  { key: 'name', labelKey: 'clinic.fields.medicine', required: true, multilang: true },
  { key: 'unit', labelKey: 'chemicals.fields.unit' },
  { key: 'price', labelKey: 'clinic.fields.price', type: 'number', required: true },
  { key: 'stockQty', labelKey: 'clinic.fields.stockQty', type: 'number', required: true },
  { key: 'minQty', labelKey: 'clinic.fields.minQty', type: 'number' },
  { key: 'expiryDate', labelKey: 'administration.fields.expiryDate', type: 'date' },
];

export const DISPENSE_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'medicineName', labelKey: 'clinic.fields.medicine' },
  { key: 'employeeName', labelKey: 'hr.fields.employee' },
  { key: 'unitPrice', labelKey: 'clinic.fields.price', type: 'currency' },
  { key: 'quantity', labelKey: 'chemicals.fields.quantity', type: 'number', align: 'center' },
  { key: 'doctorName', labelKey: 'clinic.fields.doctor' },
  { key: 'notes', labelKey: 'common.notes', multilang: true },
];

const DISPENSE_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date', required: true },
  { key: 'medicineName', labelKey: 'clinic.fields.medicine', type: 'select', lookup: 'clinicMedicines', rateKey: 'unitPrice', required: true },
  { key: 'employeeName', labelKey: 'hr.fields.employee', type: 'select', lookup: 'employees', required: true },
  { key: 'unitPrice', labelKey: 'clinic.fields.price', type: 'number' },
  { key: 'quantity', labelKey: 'chemicals.fields.quantity', type: 'number', required: true },
  { key: 'doctorName', labelKey: 'clinic.fields.doctor', type: 'select', lookup: 'doctors' },
  { key: 'notes', labelKey: 'common.notes', type: 'textarea', multilang: true },
];

export const VISIT_COLUMNS: TableColumn[] = [
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'employeeName', labelKey: 'hr.fields.employee' },
  { key: 'clinicName', labelKey: 'clinic.fields.clinic' },
  { key: 'doctorName', labelKey: 'clinic.fields.doctor' },
  { key: 'complaint', labelKey: 'clinic.fields.complaint', multilang: true },
  { key: 'treatment', labelKey: 'clinic.fields.treatment', multilang: true },
  { key: 'medicineCost', labelKey: 'clinic.fields.medicineCost', type: 'currency' },
  {
    key: 'outcome',
    labelKey: 'clinic.fields.outcome',
    type: 'badge',
    keyPrefix: 'clinic.outcomes.',
    badgeToneMap: {
      'returned-to-work': 'success',
      'sent-home': 'warning',
      'hospital-referral': 'danger',
    },
  },
];

const VISIT_FIELDS: FormField[] = [
  { key: 'date', labelKey: 'common.date', type: 'date', required: true },
  { key: 'employeeName', labelKey: 'hr.fields.employee', type: 'select', lookup: 'employees', required: true },
  { key: 'clinicName', labelKey: 'clinic.fields.clinic', type: 'select', lookup: 'clinics', required: true },
  { key: 'doctorName', labelKey: 'clinic.fields.doctor', type: 'select', lookup: 'doctors', required: true },
  { key: 'complaint', labelKey: 'clinic.fields.complaint', type: 'textarea', multilang: true },
  { key: 'treatment', labelKey: 'clinic.fields.treatment', type: 'textarea', multilang: true },
  { key: 'medicineCost', labelKey: 'clinic.fields.medicineCost', type: 'number' },
  { key: 'outcome', labelKey: 'clinic.fields.outcome', type: 'select', options: keysToOptions('clinic.outcomes.', OUTCOME_KEYS) },
];

/** عيادة المصنع — visit log, treatments and outcomes. */
@Component({
  selector: 'app-clinic-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="clinic"
      titleKey="clinic.title"
      subtitleKey="clinic.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class ClinicPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'visits',
      labelKey: 'clinic.tabs.visits',
      endpoint: API_ENDPOINTS.clinic.visits,
      columns: VISIT_COLUMNS,
      fields: VISIT_FIELDS,
    },
    {
      id: 'clinics',
      labelKey: 'clinic.tabs.clinics',
      endpoint: API_ENDPOINTS.clinic.clinics,
      columns: CLINIC_COLUMNS,
      fields: CLINIC_FIELDS,
    },
    {
      id: 'doctors',
      labelKey: 'clinic.tabs.doctors',
      endpoint: API_ENDPOINTS.clinic.doctors,
      columns: DOCTOR_COLUMNS,
      fields: DOCTOR_FIELDS,
    },
    {
      id: 'medicines',
      labelKey: 'clinic.tabs.medicines',
      endpoint: API_ENDPOINTS.clinic.medicines,
      columns: MEDICINE_COLUMNS,
      fields: MEDICINE_FIELDS,
    },
    {
      id: 'dispenses',
      labelKey: 'clinic.tabs.dispenses',
      endpoint: API_ENDPOINTS.clinic.dispenses,
      columns: DISPENSE_COLUMNS,
      fields: DISPENSE_FIELDS,
    },
  ];
}
