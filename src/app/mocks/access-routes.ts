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
import {
  MOCK_CHEM_ACCOUNTS,
  MOCK_CHEM_CUSTOMERS,
  MOCK_CHEM_JOURNAL,
  MOCK_CHEM_MOVEMENTS,
  MOCK_CHEM_WAREHOUSE,
} from './data/chemicals.mock';
import { MOCK_LEDGER, MOCK_TRIAL_BALANCE } from './data/finance-reports.mock';
import { listMaintenance, prepareMaintenance } from './data/maintenance.mock';
import { MOCK_MAINTENANCE, MOCK_TECH_SHEETS } from './data/quality.mock';

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
  { method: 'GET', pattern: '/maintenance/jobs', handler: () => listMaintenance() },
  ...crudRoutes('/maintenance/jobs', MOCK_MAINTENANCE, 'id', true, prepareMaintenance('quality')),
  { method: 'GET', pattern: '/production/maintenance', handler: () => listMaintenance('production') },
  ...crudRoutes('/production/maintenance', MOCK_MAINTENANCE, 'id', true, prepareMaintenance('production')),
  { method: 'GET', pattern: '/quality/tech-sheets', handler: () => MOCK_TECH_SHEETS },
  ...crudRoutes('/quality/tech-sheets', MOCK_TECH_SHEETS),
  { method: 'GET', pattern: '/finance/ledger', handler: () => MOCK_LEDGER },
  { method: 'GET', pattern: '/finance/trial-balance', handler: () => MOCK_TRIAL_BALANCE },
  { method: 'GET', pattern: '/chemicals/raw-warehouse', handler: () => MOCK_CHEM_WAREHOUSE },
  ...crudRoutes('/chemicals/raw-warehouse', MOCK_CHEM_WAREHOUSE, 'code'),
  { method: 'GET', pattern: '/chemicals/customers', handler: () => MOCK_CHEM_CUSTOMERS },
  ...crudRoutes('/chemicals/customers', MOCK_CHEM_CUSTOMERS, 'code'),
  { method: 'GET', pattern: '/chemicals/movements', handler: () => MOCK_CHEM_MOVEMENTS },
  ...crudRoutes('/chemicals/movements', MOCK_CHEM_MOVEMENTS),
  { method: 'GET', pattern: '/chemicals/accounts', handler: () => MOCK_CHEM_ACCOUNTS },
  ...crudRoutes('/chemicals/accounts', MOCK_CHEM_ACCOUNTS, 'code'),
  { method: 'GET', pattern: '/chemicals/journal', handler: () => MOCK_CHEM_JOURNAL },
  ...crudRoutes('/chemicals/journal', MOCK_CHEM_JOURNAL),
];
