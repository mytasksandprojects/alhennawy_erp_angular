import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { CacheService } from '../cache/cache.service';
import { AuthSession, LoginRequest } from '../models/auth.models';

const SESSION_KEY = 'ah-erp.session';

/**
 * Session management. The token lives in sessionStorage (not localStorage)
 * so it dies with the tab — a deliberate hardening choice for shared
 * factory workstations. All permission checks go through `hasPermission`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  private readonly cache = inject(CacheService);

  private readonly sessionSignal = signal<AuthSession | null>(this.restore());

  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const session = this.sessionSignal();
    if (!session) return false;
    return new Date(session.expiresAt).getTime() > Date.now();
  });

  async login(request: LoginRequest): Promise<void> {
    const session = await firstValueFrom(
      this.api.post<AuthSession>(API_ENDPOINTS.auth.login, request),
    );
    this.sessionSignal.set(session);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable — in-memory session still valid */
    }
  }

  logout(): void {
    this.sessionSignal.set(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    this.cache.clear();
    void this.router.navigateByUrl('/login');
  }

  token(): string | null {
    return this.sessionSignal()?.token ?? null;
  }

  hasPermission(permission: string | undefined): boolean {
    if (!permission) return true;
    const user = this.user();
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  applyPermissions(permissions: string[]): void {
    const session = this.sessionSignal();
    if (!session) return;
    const next = { ...session, user: { ...session.user, permissions } };
    this.sessionSignal.set(next);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  private restore(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as AuthSession;
      return new Date(session.expiresAt).getTime() > Date.now() ? session : null;
    } catch {
      return null;
    }
  }
}
