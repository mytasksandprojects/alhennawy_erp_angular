import {
  AttendanceRecord,
  Employee,
  LeaveRequest,
  PerformanceReview,
  ZkSyncLog,
} from '../../core/models/hr.models';

/** MOCK LAYER — HR data incl. ZKTeco device sync logs. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const today = new Date().toISOString().slice(0, 10);

/** Placeholder scans — the real API returns uploaded attachment URLs. */
const IMG = 'assets/branding/alhennawy-logo.png';
const FILES = `${IMG}#شهادة خبرة.pdf|${IMG}#شهادة تدريب.pdf`;

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e-1', code: 'EMP-0001', name: 'محمد نبيل', name_en: 'Mohamed Nabil', departmentKey: 'departments.it', jobTitleKey: 'jobs.systemAdmin', hireDate: '2020-03-15', status: 'active', leaveBalanceDays: 18, salary: 28500, photoUrl: IMG, drugTestImageUrl: IMG, fileUrls: FILES, roleId: 'admin', workStart: '08:00', workEnd: '16:00' },
  { id: 'e-2', code: 'EMP-0042', name: 'أحمد الحناوي', name_en: 'Ahmed El Hennawy', departmentKey: 'departments.production', jobTitleKey: 'jobs.machineOperator', hireDate: '2021-07-01', status: 'active', leaveBalanceDays: 11, salary: 14200, photoUrl: IMG, drugTestImageUrl: IMG, fileUrls: `${IMG}#شهادة تشغيل ماكينات.pdf`, roleId: 'operator', workStart: '07:00', workEnd: '19:00' },
  { id: 'e-3', code: 'EMP-0078', name: 'سارة محمود', name_en: 'Sara Mahmoud', departmentKey: 'departments.finance', jobTitleKey: 'jobs.accountant', hireDate: '2023-01-10', status: 'on-leave', leaveBalanceDays: 4, salary: 16800, photoUrl: IMG, drugTestImageUrl: IMG, fileUrls: FILES, roleId: 'finance', workStart: '09:00', workEnd: '17:00' },
  { id: 'e-4', code: 'EMP-0101', name: 'خالد عبد العزيز', name_en: 'Khaled Abdelaziz', departmentKey: 'departments.warehouse', jobTitleKey: 'jobs.storekeeper', hireDate: '2024-05-20', status: 'probation', leaveBalanceDays: 0, contractEndDate: daysAgo(-20), salary: 9800, photoUrl: IMG, drugTestImageUrl: IMG, roleId: 'store', workStart: '08:00', workEnd: '16:00' },
  { id: 'e-5', code: 'EMP-0034', name: 'مصطفى رمضان', name_en: 'Mostafa Ramadan', departmentKey: 'departments.quality', jobTitleKey: 'jobs.qualityInspector', hireDate: '2019-11-02', status: 'active', leaveBalanceDays: 22, salary: 18400, photoUrl: IMG, drugTestImageUrl: IMG, fileUrls: `${IMG}#شهادة ISO 9001.pdf`, roleId: 'operator', workStart: '08:00', workEnd: '16:00' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a-1', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: today, checkIn: '08:02', checkOut: '16:10', lateMinutes: 2, overtimeMinutes: 10, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-1b', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(1).slice(0, 10), checkIn: '07:58', checkOut: '16:05', lateMinutes: 0, overtimeMinutes: 5, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-1c', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(2).slice(0, 10), checkIn: '08:11', checkOut: '16:02', lateMinutes: 11, overtimeMinutes: 2, deviceId: 'APP', statusKey: 'hr.attendance.late' },
  { id: 'a-1d', employeeCode: 'EMP-0001', employeeName: 'محمد نبيل', date: daysAgo(3).slice(0, 10), checkIn: '08:00', checkOut: '16:00', lateMinutes: 0, overtimeMinutes: 0, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.present' },
  { id: 'a-2', employeeCode: 'EMP-0042', employeeName: 'أحمد الحناوي', date: today, checkIn: '07:55', checkOut: '18:30', lateMinutes: 0, overtimeMinutes: 150, deviceId: 'ZK-PLANT-2', statusKey: 'hr.attendance.present' },
  { id: 'a-3', employeeCode: 'EMP-0078', employeeName: 'سارة محمود', date: today, lateMinutes: 0, overtimeMinutes: 0, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.onLeave' },
  { id: 'a-4', employeeCode: 'EMP-0101', employeeName: 'خالد عبد العزيز', date: today, checkIn: '08:41', lateMinutes: 41, overtimeMinutes: 0, deviceId: 'ZK-GATE-1', statusKey: 'hr.attendance.late' },
];

export const MOCK_ZK_LOGS: ZkSyncLog[] = [
  { id: 'zk-1', deviceId: 'ZK-GATE-1', deviceLocationKey: 'hr.devices.mainGate', syncedAt: daysAgo(0), recordsImported: 214, status: 'success' },
  { id: 'zk-2', deviceId: 'ZK-PLANT-2', deviceLocationKey: 'hr.devices.plantFloor', syncedAt: daysAgo(0), recordsImported: 188, status: 'success' },
  { id: 'zk-3', deviceId: 'ZK-WH-3', deviceLocationKey: 'hr.devices.warehouseGate', syncedAt: daysAgo(1), recordsImported: 0, status: 'failed', errorMessage: 'device unreachable' },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'l-1', employeeCode: 'EMP-0078', employeeName: 'سارة محمود', typeKey: 'hr.leaveTypes.annual', from: daysAgo(2).slice(0, 10), to: daysAgo(-3).slice(0, 10), days: 5, status: 'approved' },
  { id: 'l-2', employeeCode: 'EMP-0042', employeeName: 'أحمد الحناوي', typeKey: 'hr.leaveTypes.casual', from: daysAgo(-7).slice(0, 10), to: daysAgo(-7).slice(0, 10), days: 1, status: 'pending' },
];

/** تقييم المديرين للموظفين */
export const MOCK_EMPLOYEE_REVIEWS: PerformanceReview[] = [
  { id: 'pr-1', subjectCode: 'EMP-0042', subjectName: 'أحمد الحناوي', reviewerName: 'م. حسن عبد الرحمن', period: '2026-Q2', score: 4.7, rating: 'excellent', comment: 'التزام عالٍ وإنتاجية ممتازة على ماكينة القطع', date: daysAgo(12) },
  { id: 'pr-2', subjectCode: 'EMP-0078', subjectName: 'سارة محمود', reviewerName: 'أ. وائل السيد', period: '2026-Q2', score: 4.1, rating: 'good', comment: 'دقة عالية في التسويات البنكية', date: daysAgo(10) },
  { id: 'pr-3', subjectCode: 'EMP-0101', subjectName: 'خالد عبد العزيز', reviewerName: 'أ. محمود فتحي', period: '2026-Q2', score: 2.9, rating: 'average', comment: 'يحتاج تدريب إضافي على نظام الجرد', date: daysAgo(8) },
  { id: 'pr-4', subjectCode: 'EMP-0034', subjectName: 'مصطفى رمضان', reviewerName: 'د. هالة يوسف', period: '2026-Q2', score: 4.9, rating: 'excellent', comment: 'أفضل معدل اكتشاف عيوب في المعمل', date: daysAgo(6) },
];

/** تقييم الموظفين لمديريهم */
export const MOCK_MANAGER_REVIEWS: PerformanceReview[] = [
  { id: 'mr-1', subjectName: 'م. حسن عبد الرحمن', reviewerName: 'أحمد الحناوي', period: '2026-Q2', score: 4.5, rating: 'excellent', comment: 'يوزع الورديات بعدالة ويدعم الفريق', date: daysAgo(5) },
  { id: 'mr-2', subjectName: 'أ. محمود فتحي', reviewerName: 'خالد عبد العزيز', period: '2026-Q2', score: 3.2, rating: 'average', comment: 'التواصل يحتاج تحسين عند ضغط التسليمات', date: daysAgo(4) },
  { id: 'mr-3', subjectName: 'أ. وائل السيد', reviewerName: 'سارة محمود', period: '2026-Q2', score: 4.0, rating: 'good', comment: 'مرن في مواعيد الإجازات ويشرح المهام بوضوح', date: daysAgo(3) },
];
