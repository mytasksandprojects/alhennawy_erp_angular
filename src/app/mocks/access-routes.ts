import { MockRoute } from './mock-registry';
import { crudRoutes } from './data/crud.util';
import {
  getAttendancePolicy,
  MOCK_LOCATIONS,
  saveAttendancePolicy,
} from './data/attendance-config.mock';
import { deleteEmployee, upsertEmployee } from './data/hr.mock';
import { listRoles, upsertRole } from './data/roles.mock';

export const ACCESS_ROUTES: MockRoute[] = [
  { method: 'GET', pattern: '/roles', handler: () => listRoles() },
  { method: 'POST', pattern: '/roles', handler: ({ body }) => upsertRole(body) },
  { method: 'PUT', pattern: '/roles/:id', handler: ({ body }) => upsertRole(body) },
  { method: 'GET', pattern: '/hr/attendance-policy', handler: () => getAttendancePolicy() },
  { method: 'PUT', pattern: '/hr/attendance-policy', handler: ({ body }) => saveAttendancePolicy(body) },
  { method: 'GET', pattern: '/hr/attendance-locations', handler: () => MOCK_LOCATIONS },
  ...crudRoutes('/hr/attendance-locations', MOCK_LOCATIONS),
  { method: 'POST', pattern: '/hr/employees', handler: ({ body }) => upsertEmployee(body) },
  {
    method: 'PUT',
    pattern: '/hr/employees/:id',
    handler: ({ path, body }) =>
      upsertEmployee({ ...(body as object), id: decodeURIComponent(path.split('/').pop() ?? '') }),
  },
  {
    method: 'DELETE',
    pattern: '/hr/employees/:id',
    handler: ({ path }) => deleteEmployee(decodeURIComponent(path.split('/').pop() ?? '')),
  },
];
