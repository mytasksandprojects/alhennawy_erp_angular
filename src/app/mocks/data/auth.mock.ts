import { AuthSession, LoginRequest } from '../../core/models/auth.models';
import { MockApiError } from '../mock-backend.interceptor';

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
  const user = USERS[request.username?.toLowerCase() ?? ''];
  if (!user || user.password !== request.password) {
    throw new MockApiError(400, 'invalid-credentials');
  }
  return {
    ...user.session,
    token: `mock-token-${request.username}-${Date.now()}`,
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
  };
}
