/** الموارد البشرية — HR domain incl. ZKTeco integration. */
import { Localized } from './common.models';


export interface Employee extends Localized {
  id: string;
  code: string;
  name: string;
  departmentKey: string;
  jobTitleKey: string;
  hireDate: string;
  status: 'active' | 'on-leave' | 'terminated' | 'probation';
  leaveBalanceDays: number;
  contractEndDate?: string;
  salary?: number;
  /** الصورة الشخصية */
  photoUrl?: string;
  /** صورة تحليل المخدرات */
  drugTestImageUrl?: string;
  /** ملفات الشهادات والخبرات — `|`-joined list, names in `#fragment`. */
  fileUrls?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  lateMinutes: number;
  overtimeMinutes: number;
  deviceId: string;
  statusKey: string;
}

export interface ZkSyncLog {
  id: string;
  deviceId: string;
  deviceLocationKey: string;
  syncedAt: string;
  recordsImported: number;
  status: 'success' | 'failed';
  errorMessage?: string;
}

/**
 * تقييم الأداء — one review row. Used in both directions:
 * managers reviewing employees, and employees rating their managers.
 */
export interface PerformanceReview {
  id: string;
  /** الشخص الذي يتم تقييمه */
  subjectName: string;
  subjectCode?: string;
  /** القائم بالتقييم */
  reviewerName: string;
  period: string;
  score: number;
  rating: 'excellent' | 'good' | 'average' | 'poor';
  comment?: string;
  date: string;
}

export interface LeaveRequest {
  id: string;
  employeeCode: string;
  employeeName: string;
  typeKey: string;
  from: string;
  to: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}
