import { FormField, TableColumn } from '../../core/models/common.models';
import { keysToOptions } from '../../shared/crud/options';

export const EMPLOYEE_COLUMNS: TableColumn[] = [
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'image' },
  { key: 'code', labelKey: 'common.code' },
  { key: 'name', labelKey: 'common.name', multilang: true },
  { key: 'departmentKey', labelKey: 'hr.fields.department', type: 'key' },
  { key: 'jobTitleKey', labelKey: 'hr.fields.jobTitle', type: 'key' },
  { key: 'hireDate', labelKey: 'hr.fields.hireDate', type: 'date' },
  { key: 'salary', labelKey: 'hr.fields.salary', type: 'currency' },
  { key: 'leaveBalanceDays', labelKey: 'hr.fields.leaveBalance', type: 'number', align: 'center' },
  { key: 'drugTestImageUrl', labelKey: 'administration.fields.drugTest', type: 'image' },
  { key: 'fileUrls', labelKey: 'hr.fields.files', type: 'files' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'hr.status.',
    badgeToneMap: {
      'active': 'success',
      'on-leave': 'info',
      'terminated': 'danger',
      'probation': 'warning',
    },
  },
];

export const ATTENDANCE_COLUMNS: TableColumn[] = [
  { key: 'employeeCode', labelKey: 'common.code' },
  { key: 'employeeName', labelKey: 'common.name', multilang: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'checkIn', labelKey: 'hr.fields.checkIn', align: 'center' },
  { key: 'checkOut', labelKey: 'hr.fields.checkOut', align: 'center' },
  { key: 'lateMinutes', labelKey: 'hr.fields.late', type: 'number', align: 'center' },
  { key: 'overtimeMinutes', labelKey: 'hr.fields.overtime', type: 'number', align: 'center' },
  { key: 'deviceId', labelKey: 'hr.fields.device' },
  { key: 'statusKey', labelKey: 'common.status', type: 'key' },
];

export const LEAVE_COLUMNS: TableColumn[] = [
  { key: 'employeeName', labelKey: 'common.name', multilang: true },
  { key: 'typeKey', labelKey: 'hr.fields.leaveType', type: 'key' },
  { key: 'from', labelKey: 'common.from', type: 'date' },
  { key: 'to', labelKey: 'common.to', type: 'date' },
  { key: 'days', labelKey: 'hr.fields.days', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'hr.leaveStatus.',
    badgeToneMap: { pending: 'warning', approved: 'success', rejected: 'danger' },
  },
];

export const ZK_SYNC_COLUMNS: TableColumn[] = [
  { key: 'deviceId', labelKey: 'hr.fields.device' },
  { key: 'deviceLocationKey', labelKey: 'hr.fields.location', type: 'key' },
  { key: 'syncedAt', labelKey: 'hr.fields.syncedAt', type: 'datetime' },
  { key: 'recordsImported', labelKey: 'hr.fields.recordsImported', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'hr.sync.',
    badgeToneMap: { success: 'success', failed: 'danger' },
  },
  { key: 'errorMessage', labelKey: 'hr.fields.error' },
];

/**
 * تقييم الأداء columns — reused for both directions by swapping who is
 * the subject (employee or manager) and who is the reviewer.
 */
export function reviewColumns(
  subjectLabelKey: string,
  reviewerLabelKey: string,
): TableColumn[] {
  return [
    { key: 'subjectName', labelKey: subjectLabelKey, multilang: true },
    { key: 'reviewerName', labelKey: reviewerLabelKey, multilang: true },
    { key: 'period', labelKey: 'hr.fields.period', align: 'center' },
    { key: 'score', labelKey: 'hr.fields.score', type: 'number', align: 'center' },
    {
      key: 'rating',
      labelKey: 'hr.fields.rating',
      type: 'badge',
      keyPrefix: 'hr.ratings.',
      badgeToneMap: { excellent: 'success', good: 'info', average: 'warning', poor: 'danger' },
    },
    { key: 'comment', labelKey: 'hr.fields.comment', multilang: true },
    { key: 'date', labelKey: 'common.date', type: 'date' },
  ];
}

export function reviewFields(
  subjectLabelKey: string,
  reviewerLabelKey: string,
): FormField[] {
  return [
    { key: 'subjectName', labelKey: subjectLabelKey, required: true, multilang: true },
    { key: 'reviewerName', labelKey: reviewerLabelKey, required: true, multilang: true },
    { key: 'period', labelKey: 'hr.fields.period' },
    { key: 'score', labelKey: 'hr.fields.score', type: 'number' },
    { key: 'rating', labelKey: 'hr.fields.rating', type: 'select', options: keysToOptions('hr.ratings.', ['excellent', 'good', 'average', 'poor']) },
    { key: 'comment', labelKey: 'hr.fields.comment', type: 'textarea', multilang: true },
    { key: 'date', labelKey: 'common.date', type: 'date' },
  ];
}

export const EMPLOYEE_FIELDS: FormField[] = [
  { key: 'code', labelKey: 'common.code', required: true },
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
  { key: 'departmentKey', labelKey: 'hr.fields.department', type: 'select', lookup: 'departments' },
  { key: 'jobTitleKey', labelKey: 'hr.fields.jobTitle' },
  { key: 'hireDate', labelKey: 'hr.fields.hireDate', type: 'date' },
  { key: 'leaveBalanceDays', labelKey: 'hr.fields.leaveBalance', type: 'number' },
  { key: 'salary', labelKey: 'hr.fields.salary', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('hr.status.', ['active', 'on-leave', 'terminated', 'probation']) },
  { key: 'photoUrl', labelKey: 'hr.fields.photo', type: 'images' },
  { key: 'drugTestImageUrl', labelKey: 'administration.fields.drugTest', type: 'images' },
  { key: 'fileUrls', labelKey: 'hr.fields.files', type: 'files' },
];

export const ATTENDANCE_FIELDS: FormField[] = [
  { key: 'employeeCode', labelKey: 'common.code' },
  { key: 'employeeName', labelKey: 'common.name', multilang: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'checkIn', labelKey: 'hr.fields.checkIn' },
  { key: 'checkOut', labelKey: 'hr.fields.checkOut' },
  { key: 'lateMinutes', labelKey: 'hr.fields.late', type: 'number' },
  { key: 'overtimeMinutes', labelKey: 'hr.fields.overtime', type: 'number' },
  { key: 'deviceId', labelKey: 'hr.fields.device' },
];

export const LEAVE_FIELDS: FormField[] = [
  { key: 'employeeName', labelKey: 'common.name', multilang: true },
  { key: 'typeKey', labelKey: 'hr.fields.leaveType', type: 'select', lookup: 'leaveTypes' },
  { key: 'from', labelKey: 'common.from', type: 'date' },
  { key: 'to', labelKey: 'common.to', type: 'date' },
  { key: 'days', labelKey: 'hr.fields.days', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('hr.leaveStatus.', ['pending', 'approved', 'rejected']) },
];

export const ZK_SYNC_FIELDS: FormField[] = [
  { key: 'deviceId', labelKey: 'hr.fields.device', required: true },
  { key: 'deviceLocationKey', labelKey: 'hr.fields.location' },
  { key: 'recordsImported', labelKey: 'hr.fields.recordsImported', type: 'number' },
  { key: 'status', labelKey: 'common.status', type: 'select', options: keysToOptions('hr.sync.', ['success', 'failed']) },
  { key: 'errorMessage', labelKey: 'hr.fields.error' },
];

/** جزاءات الموظفين — moved under HR (labels reuse the existing keys). */
export const PENALTY_COLUMNS: TableColumn[] = [
  { key: 'employeeName', labelKey: 'hr.fields.employee', multilang: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'reasonKey', labelKey: 'safety.fields.reason', type: 'key' },
  {
    key: 'kind',
    labelKey: 'safety.fields.penalty',
    type: 'badge',
    keyPrefix: 'safety.penaltyKinds.',
    badgeToneMap: { warning: 'warning', deduction: 'danger', suspension: 'danger' },
  },
  { key: 'amount', labelKey: 'finance.fields.amount', type: 'currency' },
  { key: 'notes', labelKey: 'safety.fields.notes', multilang: true },
];

export const PENALTY_FIELDS: FormField[] = [
  { key: 'employeeName', labelKey: 'hr.fields.employee', required: true, multilang: true },
  { key: 'date', labelKey: 'common.date', type: 'date' },
  { key: 'reasonKey', labelKey: 'safety.fields.reason', type: 'select', lookup: 'penaltyReasons' },
  { key: 'kind', labelKey: 'safety.fields.penalty', type: 'select', options: keysToOptions('safety.penaltyKinds.', ['warning', 'deduction', 'suspension']) },
  { key: 'amount', labelKey: 'finance.fields.amount', type: 'number' },
  { key: 'notes', labelKey: 'safety.fields.notes', type: 'textarea', multilang: true },
];
