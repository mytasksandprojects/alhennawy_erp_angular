/** Authentication and authorization contracts. */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  roleKey: string;
  /**
   * Fine-grained permissions, e.g. `finance.viewPrices` controls the
   * price fields that must stay hidden from everyone except Finance.
   */
  permissions: string[];
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: AuthUser;
}
