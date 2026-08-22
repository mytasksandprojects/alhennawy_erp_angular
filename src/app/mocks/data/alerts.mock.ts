import { AlertItem } from '../../core/models/common.models';
import { CHEMICALS_DASHBOARD } from './chemicals.mock';
import {
  ADMINISTRATION_DASHBOARD,
  FINANCE_DASHBOARD,
  HR_DASHBOARD,
  LOGISTICS_DASHBOARD,
  PURCHASING_DASHBOARD,
  SALES_DASHBOARD,
} from './dashboards-biz.mock';
import {
  PRODUCTION_DASHBOARD,
  QUALITY_DASHBOARD,
  WAREHOUSE_DASHBOARD,
  WEIGHBRIDGE_DASHBOARD,
} from './dashboards-ops.mock';
import { CLINIC_DASHBOARD, SAFETY_DASHBOARD } from './safety.mock';

/** Tag a module's own alerts so the inbox can group and filter them. */
const tag = (moduleKey: string, alerts: AlertItem[]): AlertItem[] =>
  alerts.map((alert) => ({ ...alert, moduleKey }));

/**
 * MOCK LAYER — one factory-wide inbox. Each row already knows which
 * screen to open (route / query / fragment from the source dashboard).
 */
export const SYSTEM_ALERTS: AlertItem[] = [
  ...tag('menu.weighbridge', WEIGHBRIDGE_DASHBOARD.alerts),
  ...tag('menu.warehouse', WAREHOUSE_DASHBOARD.alerts),
  ...tag('menu.quality', QUALITY_DASHBOARD.alerts),
  ...tag('menu.production', PRODUCTION_DASHBOARD.alerts),
  ...tag('menu.chemicals', CHEMICALS_DASHBOARD.alerts),
  ...tag('menu.finance', FINANCE_DASHBOARD.alerts),
  ...tag('menu.sales', SALES_DASHBOARD.alerts),
  ...tag('menu.purchasing', PURCHASING_DASHBOARD.alerts),
  ...tag('menu.logistics', LOGISTICS_DASHBOARD.alerts),
  ...tag('menu.hr', HR_DASHBOARD.alerts),
  ...tag('menu.administration', ADMINISTRATION_DASHBOARD.alerts),
  ...tag('menu.safety', SAFETY_DASHBOARD.alerts),
  ...tag('menu.clinic', CLINIC_DASHBOARD.alerts),
].sort((a, b) => (a.date < b.date ? 1 : -1));
