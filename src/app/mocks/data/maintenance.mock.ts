import { AlertItem, DashboardData } from '../../core/models/common.models';
import { MockApiError } from '../mock-backend.interceptor';
import { MOCK_MAINTENANCE } from './quality.mock';

type Row = Record<string, unknown>;

/** Live inbox rows created when quality or production files a job. */
export const MAINTENANCE_ALERTS: AlertItem[] = [
  {
    id: 'mna-seed',
    messageKey: 'maintenance.alerts.newRequest',
    params: ['اهتزاز غير طبيعي في القسم الرطب'],
    severity: 'warning',
    date: new Date().toISOString(),
    route: '/maintenance',
    query: { tab: 'jobs', status: 'pending' },
    moduleKey: 'menu.maintenance',
  },
];

export function listMaintenance(source?: string) {
  return MOCK_MAINTENANCE.filter((row) => !source || (row.source || 'quality') === source);
}

function notify(row: Row): void {
  const machine = String(row['machineNameKey'] ?? '');
  MAINTENANCE_ALERTS.unshift({
    id: `mna-${Date.now()}`,
    messageKey: 'maintenance.alerts.newRequest',
    params: [String(row['description'] || machine)],
    severity: 'warning',
    date: new Date().toISOString(),
    route: '/maintenance',
    query: { tab: 'jobs' },
    moduleKey: 'menu.maintenance',
  });
}

export function prepareMaintenance(source: string) {
  return (row: Row): Row => {
    const isNew = !row['id'];
    const next: Row = {
      ...row,
      source: row['source'] || source,
      status: row['status'] || 'pending',
      date: row['date'] || new Date().toISOString(),
    };
    if (next['status'] === 'scheduled' && !next['scheduledAt']) throw new MockApiError(400, 'invalid-request');
    if (next['scheduledAt'] && next['status'] === 'pending') next['status'] = 'scheduled';
    if (isNew) notify(next);
    return next;
  };
}

export function maintenanceDashboard(): DashboardData {
  const pending = MOCK_MAINTENANCE.filter((row) => row.status === 'pending').length;
  const scheduled = MOCK_MAINTENANCE.filter((row) => row.status === 'scheduled').length;
  return {
    stats: [
      { id: 'pending', labelKey: 'maintenance.stats.pending', value: pending, icon: 'alert', toneToken: 'warning', route: '/maintenance', query: { tab: 'jobs', status: 'pending' } },
      { id: 'scheduled', labelKey: 'maintenance.stats.scheduled', value: scheduled, icon: 'wrench', route: '/maintenance', query: { tab: 'jobs', status: 'scheduled' } },
    ],
    charts: [
      {
        id: 'by-status',
        titleKey: 'maintenance.tabs.jobs',
        kind: 'donut',
        points: [
          { labelKey: 'quality.maintenanceStatus.pending', value: pending },
          { labelKey: 'quality.maintenanceStatus.scheduled', value: scheduled },
        ],
      },
    ],
    alerts: MAINTENANCE_ALERTS,
  };
}
