import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import { AttendanceConfig } from './attendance-config';
import {
  ATTENDANCE_COLUMNS,
  ATTENDANCE_FIELDS,
  EMPLOYEE_COLUMNS,
  EMPLOYEE_FIELDS,
  LEAVE_COLUMNS,
  LEAVE_FIELDS,
  PENALTY_COLUMNS,
  PENALTY_FIELDS,
  reviewColumns,
  reviewFields,
  ZK_SYNC_COLUMNS,
  ZK_SYNC_FIELDS,
} from './hr.columns';

/** الموارد البشرية — employees, ZKTeco attendance, leaves, sync logs. */
@Component({
  selector: 'app-hr-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView, AttendanceConfig],
  template: `
    <module-tabbed-view
      moduleId="hr"
      titleKey="hr.title"
      subtitleKey="hr.subtitle"
      [listTabs]="tabs"
    >
      <app-attendance-config />
    </module-tabbed-view>
  `,
})
export class HrPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'employees',
      labelKey: 'hr.tabs.employees',
      endpoint: API_ENDPOINTS.hr.employees,
      columns: EMPLOYEE_COLUMNS,
      fields: EMPLOYEE_FIELDS,
    },
    {
      id: 'attendance',
      labelKey: 'hr.tabs.attendance',
      endpoint: API_ENDPOINTS.hr.attendance,
      columns: ATTENDANCE_COLUMNS,
      fields: ATTENDANCE_FIELDS,
    },
    {
      id: 'attendanceConfig',
      labelKey: 'hr.tabs.attendanceConfig',
      custom: true,
    },
    {
      id: 'leaves',
      labelKey: 'hr.tabs.leaves',
      endpoint: API_ENDPOINTS.hr.leaves,
      columns: LEAVE_COLUMNS,
      fields: LEAVE_FIELDS,
    },
    {
      // جزاءات الموظفين
      id: 'penalties',
      labelKey: 'hr.tabs.penalties',
      endpoint: API_ENDPOINTS.hr.penalties,
      columns: PENALTY_COLUMNS,
      fields: PENALTY_FIELDS,
    },
    {
      // تقييم المديرين للموظفين
      id: 'performance',
      labelKey: 'hr.tabs.performance',
      endpoint: API_ENDPOINTS.hr.employeeReviews,
      columns: reviewColumns('hr.fields.employee', 'hr.fields.manager'),
      fields: reviewFields('hr.fields.employee', 'hr.fields.manager'),
    },
    {
      // تقييم الموظفين لمديريهم
      id: 'managerReviews',
      labelKey: 'hr.tabs.managerReviews',
      endpoint: API_ENDPOINTS.hr.managerReviews,
      columns: reviewColumns('hr.fields.manager', 'hr.fields.employee'),
      fields: reviewFields('hr.fields.manager', 'hr.fields.employee'),
    },
    {
      id: 'zk',
      labelKey: 'hr.tabs.zkSync',
      endpoint: API_ENDPOINTS.hr.zkSyncLogs,
      columns: ZK_SYNC_COLUMNS,
      fields: ZK_SYNC_FIELDS,
    },
  ];
}
