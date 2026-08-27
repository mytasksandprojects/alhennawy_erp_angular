import { MockRoute } from './mock-registry';
import { crudRoutes } from './data/crud.util';
import {
  getAttendancePolicy,
  MOCK_LOCATIONS,
  saveAttendancePolicy,
} from './data/attendance-config.mock';
import { deleteEmployee, upsertEmployee } from './data/hr.mock';
import {
  deletePurchaseRequest,
  listDeptRequests,
  upsertDeptRequest,
  upsertPurchaseRequest,
} from './data/purchasing.mock';
import {
  approvePurchaseRequest,
  issuePurchaseOrder,
  selectQuotation,
} from './data/purchasing-workflow';
import { advanceExportOrder, createExportQuotation } from './data/sales-workflow';
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
  { method: 'GET', pattern: '/warehouse/purchase-requests', handler: () => listDeptRequests('departments.warehouse') },
  { method: 'POST', pattern: '/warehouse/purchase-requests', handler: ({ body }) => upsertDeptRequest('departments.warehouse', body) },
  {
    method: 'PUT',
    pattern: '/warehouse/purchase-requests/:id',
    handler: ({ path, body }) =>
      upsertDeptRequest('departments.warehouse', {
        ...(body as object),
        id: decodeURIComponent(path.split('/').pop() ?? ''),
      }),
  },
  {
    method: 'DELETE',
    pattern: '/warehouse/purchase-requests/:id',
    handler: ({ path }) => deletePurchaseRequest(decodeURIComponent(path.split('/').pop() ?? '')),
  },
  { method: 'GET', pattern: '/production/purchase-requests', handler: () => listDeptRequests('departments.production') },
  { method: 'POST', pattern: '/production/purchase-requests', handler: ({ body }) => upsertDeptRequest('departments.production', body) },
  {
    method: 'PUT',
    pattern: '/production/purchase-requests/:id',
    handler: ({ path, body }) =>
      upsertDeptRequest('departments.production', {
        ...(body as object),
        id: decodeURIComponent(path.split('/').pop() ?? ''),
      }),
  },
  {
    method: 'DELETE',
    pattern: '/production/purchase-requests/:id',
    handler: ({ path }) => deletePurchaseRequest(decodeURIComponent(path.split('/').pop() ?? '')),
  },
  { method: 'POST', pattern: '/purchasing/requests', handler: ({ body }) => upsertPurchaseRequest(body) },
  {
    method: 'PUT',
    pattern: '/purchasing/requests/:id',
    handler: ({ path, body }) =>
      upsertPurchaseRequest({ ...(body as object), id: decodeURIComponent(path.split('/').pop() ?? '') }),
  },
  {
    method: 'DELETE',
    pattern: '/purchasing/requests/:id',
    handler: ({ path }) => deletePurchaseRequest(decodeURIComponent(path.split('/').pop() ?? '')),
  },
  {
    method: 'POST',
    pattern: '/purchasing/requests/:id/approve',
    handler: ({ path }) => approvePurchaseRequest(path.split('/').filter(Boolean)[2] ?? ''),
  },
  {
    method: 'POST',
    pattern: '/purchasing/requests/:id/order',
    handler: ({ path }) => issuePurchaseOrder(path.split('/').filter(Boolean)[2] ?? ''),
  },
  {
    method: 'POST',
    pattern: '/purchasing/quotations/:id/select',
    handler: ({ path }) => selectQuotation(path.split('/').filter(Boolean)[2] ?? ''),
  },
  { method: 'POST', pattern: '/sales/export-orders', handler: ({ body }) => createExportQuotation(body) },
  {
    method: 'POST',
    pattern: '/sales/export-orders/:id/advance',
    handler: ({ path, body }) => advanceExportOrder(path.split('/').filter(Boolean)[2] ?? '', body),
  },
];
