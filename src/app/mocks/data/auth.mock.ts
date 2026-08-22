import { AuthSession, LoginRequest } from '../../core/models/auth.models';
import { MockApiError } from '../mock-backend.interceptor';
import { findEmployeeLogin } from './hr.mock';
import { MOCK_ROLES } from './roles.mock';

/**
 * MOCK LAYER — demo users.
 *   admin / admin123      → everything
 *   finance / finance123  → finance + prices visibility
 *   store1 / store123     → warehouse + weighbridge + cutter (no prices)
 */
interface MockUser {
  password: string;
  session: Omit<AuthSession, 'token' | 'expiresAt'>;
}

const USERS: Record<string, MockUser> = {
  admin: {
    password: 'admin123',
    session: {
      user: {
        id: 'u-1',
        username: 'admin',
        displayName: 'MOHAMED NABIL',
        roleKey: 'roles.admin',
        roleId: 'admin',
        permissions: ['*'],
      },
    },
  },
  finance: {
    password: 'finance123',
    session: {
      user: {
        id: 'u-2',
        username: 'finance',
        displayName: 'FINANCE USER',
        roleKey: 'roles.finance',
        roleId: 'finance',
        permissions: [
          'finance.view',
          'finance.viewPrices',
          'sales.view',
          'purchasing.view',
          'weighbridge.view',
        ],
      },
    },
  },
  store1: {
    password: 'store123',
    session: {
      user: {
        id: 'u-3',
        username: 'store1',
        displayName: 'STORE1',
        roleKey: 'roles.store',
        roleId: 'store',
        permissions: [
          'warehouse.view',
          'weighbridge.view',
          'weighbridge.create',
          'cutter.view',
          'cutter.create',
        ],
      },
    },
  },
};

export function mockLogin(body: unknown): AuthSession {
  const request = body as LoginRequest;
  const login = request.username?.trim().toLowerCase() ?? '';
  const builtin = USERS[login];
  if (builtin && builtin.password === request.password) {
    return issueSession(builtin.session, login);
  }
  const employee = findEmployeeLogin(login, request.password ?? '');
  if (!employee) throw new MockApiError(400, 'invalid-credentials');
  const role = MOCK_ROLES.find((item) => item.id === employee.roleId);
  return issueSession(
    {
      user: {
        id: employee.id,
        username: employee.email ?? login,
        displayName: employee['name_en'] || employee.name,
        roleKey: role?.nameKey ?? 'hr.fields.employee',
        roleId: employee.roleId,
        permissions: role?.permissions ?? ['checkin.view'],
      },
    },
    login,
  );
}

function issueSession(
  session: Omit<AuthSession, 'token' | 'expiresAt'>,
  login: string,
): AuthSession {
  const role = MOCK_ROLES.find((item) => item.id === session.user.roleId);
  return {
    ...session,
    user: {
      ...session.user,
      permissions: role?.permissions ?? session.user.permissions,
    },
    token: `mock-token-${login}-${Date.now()}`,
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
  };
}
