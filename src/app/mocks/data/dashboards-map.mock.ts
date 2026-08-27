import { DashboardData } from '../../core/models/common.models';
import { CHEMICALS_DASHBOARD } from './chemicals.mock';
import {
  ADMINISTRATION_DASHBOARD,
  FINANCE_DASHBOARD,
  HR_DASHBOARD,
  LOGISTICS_DASHBOARD,
} from './dashboards-biz.mock';
import { HOME_DASHBOARD } from './dashboards-home.mock';
import {
  PRODUCTION_DASHBOARD,
  QUALITY_DASHBOARD,
  WAREHOUSE_DASHBOARD,
  WEIGHBRIDGE_DASHBOARD,
} from './dashboards-ops.mock';
import { REPORTS_DASHBOARD } from './dashboards-reports.mock';
import { maintenanceDashboard } from './maintenance.mock';
import { purchasingDashboard } from './purchasing-workflow';
import { CLINIC_DASHBOARD, SAFETY_DASHBOARD } from './safety.mock';
import { salesDashboard } from './sales-workflow';

/** Live dashboards — sales/purchasing/maintenance recompute on each read. */
export const DASHBOARDS: Record<string, DashboardData> = {
  home: HOME_DASHBOARD,
  finance: FINANCE_DASHBOARD,
  get sales() { return salesDashboard(); },
  get purchasing() { return purchasingDashboard(); },
  get maintenance() { return maintenanceDashboard(); },
  logistics: LOGISTICS_DASHBOARD,
  hr: HR_DASHBOARD,
  administration: ADMINISTRATION_DASHBOARD,
  safety: SAFETY_DASHBOARD,
  clinic: CLINIC_DASHBOARD,
  chemicals: CHEMICALS_DASHBOARD,
  weighbridge: WEIGHBRIDGE_DASHBOARD,
  warehouse: WAREHOUSE_DASHBOARD,
  quality: QUALITY_DASHBOARD,
  production: PRODUCTION_DASHBOARD,
  reports: REPORTS_DASHBOARD,
};
