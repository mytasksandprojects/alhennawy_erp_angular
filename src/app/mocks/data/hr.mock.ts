import {
  AttendanceRecord,
  Employee,
  LeaveRequest,
  PerformanceReview,
  ZkSyncLog,
} from '../../core/models/hr.models';
import { MockApiError } from '../mock-backend.interceptor';
import { nextGenerated } from '../../shared/crud/serial';
import { SEED_EMPLOYEES } from './seed/employees.seed';

/** MOCK LAYER — HR data incl. ZKTeco device sync logs. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const today = new Date().toISOString().slice(0, 10);

/** Placeholder scans — the real API returns uploaded attachment URLs. */
const IMG = 'assets/branding/alhennawy-logo.png';
const FILES = `${IMG}#شهادة خبرة.pdf|${IMG}#شهادة تدريب.pdf`;

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e-1', code: 'EMP-0001', name: 'محمد نبيل', name_en: 'Mohamed Nabil', email: 'mohamed.nabil@alhennawy.net', password: 'admin123', departmentKey: 'administrations.it', jobTitleKey: 'jobs.systemAdmin', hireDate: '2020-03-15', status: 'active', leaveBalanceDays: 18, salary: 28500, photoUrl: IMG, drugTestImageUrl: IMG, fileUrls: FILES, roleId: 'admin', workStart: '08:00', workEnd: '16:00' },
  ...SEED_EMPLOYEES,
];

function withoutPassword(row: Employee): Employee {
  const { password: _password, ...publicRow } = row;
  return publicRow;
}

export function listEmployees(): Employee[] {
  return MOCK_EMPLOYEES.map(withoutPassword);
}

export function findEmployeeLogin(login: string, password: string): Employee | undefined {
  const email = login.trim().toLowerCase();
  return MOCK_EMPLOYEES.find(
    (row) =>
      row.email?.toLowerCase() === email &&
      row.password === password &&
      row.status !== 'terminated',
  );
}

export function upsertEmployee(body: unknown): Employee {
  const incoming = body as Employee;
  const email = String(incoming.email ?? '').trim().toLowerCase();
  if (!email.includes('@')) throw new MockApiError(400, 'invalid-credentials');
  const taken = MOCK_EMPLOYEES.some(
    (row) => row.email?.toLowerCase() === email && row.id !== incoming.id,
  );
  if (taken) throw new MockApiError(400, 'invalid-credentials');
  const index = MOCK_EMPLOYEES.findIndex((row) => row.id === incoming.id);
  if (index >= 0) {
    const prev = MOCK_EMPLOYEES[index];
    const password = String(incoming.password ?? '') || prev.password || '';
    MOCK_EMPLOYEES[index] = { ...prev, ...incoming, email, password, id: prev.id };
    return withoutPassword(MOCK_EMPLOYEES[index]);
  }
  const password = String(incoming.password ?? '');
  if (!password) throw new MockApiError(400, 'invalid-credentials');
  const row: Employee = {
    ...incoming,
    id: incoming.id || `e-${Date.now()}`,
    code: incoming.code || nextGenerated(MOCK_EMPLOYEES, 'code', 'EMP'),
    email,
    password,
  };
  MOCK_EMPLOYEES.unshift(row);
  return withoutPassword(row);
}

export function deleteEmployee(id: string): Employee {
  const index = MOCK_EMPLOYEES.findIndex((row) => row.id === id);
  if (index < 0) throw new MockApiError(404, 'not-found');
  return MOCK_EMPLOYEES.splice(index, 1)[0];
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a-1', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: today, checkIn: '08:02', checkOut: '16:10', lateMinutes: 2, overtimeMinutes: 10, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-1b', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(1).slice(0, 10), checkIn: '07:58', checkOut: '16:05', lateMinutes: 0, overtimeMinutes: 5, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-1c', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(2).slice(0, 10), checkIn: '08:11', checkOut: '16:02', lateMinutes: 11, overtimeMinutes: 2, deviceId: 'APP', statusKey: 'hr.attendance.late' },
  { id: 'a-1d', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(3).slice(0, 10), checkIn: '08:00', checkOut: '16:00', lateMinutes: 0, overtimeMinutes: 0, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-2', employeeCode: 'hen62', employeeName: 'محمد نبيل كامل سالم', date: today, checkIn: '07:55', checkOut: '16:20', lateMinutes: 0, overtimeMinutes: 20, deviceId: 'ZK-PLANT-2', statusKey: 'hr.attendance.present' },
  { id: 'a-3', employeeCode: 'hen15', employeeName: 'هشام إبراهيم محمد احمد', date: today, checkIn: '08:04', checkOut: '16:08', lateMinutes: 4, overtimeMinutes: 8, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-4', employeeCode: 'hen75', employeeName: 'أحمد حمدي شعبان حمزة', date: today, checkIn: '08:11', lateMinutes: 11, overtimeMinutes: 0, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.late' },
];

export const MOCK_ZK_LOGS: ZkSyncLog[] = [
  { id: 'zk-1', deviceId: 'ZK-GATE-1', deviceLocationKey: 'hr.devices.mainGate', syncedAt: daysAgo(0), recordsImported: 214, status: 'success' },
  { id: 'zk-2', deviceId: 'ZK-PLANT-2', deviceLocationKey: 'hr.devices.plantFloor', syncedAt: daysAgo(0), recordsImported: 188, status: 'success' },
  { id: 'zk-3', deviceId: 'ZK-WH-3', deviceLocationKey: 'hr.devices.warehouseGate', syncedAt: daysAgo(1), recordsImported: 0, status: 'failed', errorMessage: 'device unreachable' },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'l-1', employeeCode: 'hen171', employeeName: 'على سيد على اسماعيل', typeKey: 'hr.leaveTypes.annual', from: daysAgo(2).slice(0, 10), to: daysAgo(-3).slice(0, 10), days: 5, status: 'approved' },
  { id: 'l-2', employeeCode: 'hen6', employeeName: 'احمد ماهر محمد علي عبد الله', typeKey: 'hr.leaveTypes.casual', from: daysAgo(-7).slice(0, 10), to: daysAgo(-7).slice(0, 10), days: 1, status: 'pending' },
];

/** تقييم المديرين للموظفين */
export const MOCK_EMPLOYEE_REVIEWS: PerformanceReview[] = [
  { id: 'pr-1', subjectCode: 'hen50', subjectName: 'محمد عبد الغفار محمد ابو ادريس', reviewerName: 'أحمد حمدي شعبان حمزة', period: '2026-Q2', score: 4.7, rating: 'excellent', comment: 'التزام عالٍ على وردية الماكينة', date: daysAgo(12) },
  { id: 'pr-2', subjectCode: 'hen171', subjectName: 'على سيد على اسماعيل', reviewerName: 'هشام إبراهيم محمد احمد', period: '2026-Q2', score: 4.1, rating: 'good', comment: 'دقة في القيود اليومية', date: daysAgo(10) },
  { id: 'pr-3', subjectCode: 'hen158', subjectName: 'محمد رزق على عمر', reviewerName: 'محمد نبيل كامل سالم', period: '2026-Q2', score: 2.9, rating: 'average', comment: 'يحتاج تدريب إضافي على الجرد', date: daysAgo(8) },
  { id: 'pr-4', subjectCode: 'hen75', subjectName: 'أحمد حمدي شعبان حمزة', reviewerName: 'محمد نبيل', period: '2026-Q2', score: 4.9, rating: 'excellent', comment: 'أفضل معدل اكتشاف عيوب في المعمل', date: daysAgo(6) },
];

/** تقييم الموظفين لمديريهم */
export const MOCK_MANAGER_REVIEWS: PerformanceReview[] = [
  { id: 'mr-1', subjectName: 'أحمد حمدي شعبان حمزة', reviewerName: 'محمد عبد الغفار محمد ابو ادريس', period: '2026-Q2', score: 4.5, rating: 'excellent', comment: 'يوزع الورديات بعدالة ويدعم الفريق', date: daysAgo(5) },
  { id: 'mr-2', subjectName: 'محمد نبيل كامل سالم', reviewerName: 'محمد رزق على عمر', period: '2026-Q2', score: 3.2, rating: 'average', comment: 'التواصل يحتاج تحسين عند ضغط التسليمات', date: daysAgo(4) },
  { id: 'mr-3', subjectName: 'هشام إبراهيم محمد احمد', reviewerName: 'على سيد على اسماعيل', period: '2026-Q2', score: 4.0, rating: 'good', comment: 'مرن في مواعيد الإجازات ويشرح المهام بوضوح', date: daysAgo(3) },
];
