import { AppRole } from '../../core/models/access.models';

/** MOCK LAYER — editable role matrix. `*` is full access. */
export const MOCK_ROLES: AppRole[] = [
  { id: 'admin', nameKey: 'roles.admin', permissions: ['*'] },
  {
    id: 'finance',
    nameKey: 'roles.finance',
    permissions: [
      'finance.view',
      'finance.viewPrices',
      'sales.view',
      'purchasing.view',
      'weighbridge.view',
      'checkin.view',
    ],
  },
  {
    id: 'store',
    nameKey: 'roles.store',
    permissions: [
      'warehouse.view',
      'weighbridge.view',
      'cutter.view',
      'checkin.view',
    ],
  },
  {
    id: 'operator',
    nameKey: 'roles.operator',
    permissions: [
      'hr.view',
      'hr.tab.employees',
      'hr.tab.attendance',
      'hr.col.employees.code',
      'hr.col.employees.name',
      'hr.col.employees.departmentKey',
      'hr.col.employees.jobTitleKey',
      'hr.col.employees.status',
      'hr.act.employees.print',
      'hr.tab.attendance',
      'checkin.view',
      'checkin.tab.punch',
      'checkin.act.punch.create',
      'checkin.act.punch.edit',
    ],
  },
];

export function listRoles(): AppRole[] {
  return MOCK_ROLES;
}

export function upsertRole(body: unknown): AppRole {
  const next = body as AppRole;
  const index = MOCK_ROLES.findIndex((role) => role.id === next.id);
  if (index >= 0) {
    MOCK_ROLES[index] = { ...MOCK_ROLES[index], ...next };
    return MOCK_ROLES[index];
  }
  const created: AppRole = {
    id: next.id || `role-${Date.now()}`,
    name: next.name,
    name_en: next.name_en,
    nameKey: next.nameKey,
    permissions: next.permissions ?? [],
  };
  MOCK_ROLES.push(created);
  return created;
}
