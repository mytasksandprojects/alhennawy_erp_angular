import { MockRoute } from './mock-registry';
import { crudRoutes } from './data/crud.util';
import {
  getAttendancePolicy,
  MOCK_LOCATIONS,
  saveAttendancePolicy,
} from './data/attendance-config.mock';
import { listRoles, upsertRole } from './data/roles.mock';

export const ACCESS_ROUTES: MockRoute[] = [
  { method: 'GET', pattern: '/roles', handler: () => listRoles() },
  { method: 'POST', pattern: '/roles', handler: ({ body }) => upsertRole(body) },
  { method: 'PUT', pattern: '/roles/:id', handler: ({ body }) => upsertRole(body) },
  { method: 'GET', pattern: '/hr/attendance-policy', handler: () => getAttendancePolicy() },
  { method: 'PUT', pattern: '/hr/attendance-policy', handler: ({ body }) => saveAttendancePolicy(body) },
  { method: 'GET', pattern: '/hr/attendance-locations', handler: () => MOCK_LOCATIONS },
  ...crudRoutes('/hr/attendance-locations', MOCK_LOCATIONS),
];
