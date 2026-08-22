import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Role-matrix checks. `*` sees everything. If a role has no tab/column/action
 * grants for a module, `module.view` still opens the full screen (legacy).
 * Once the matrix saves explicit grants, only those items appear.
 */
@Injectable({ providedIn: 'root' })
export class AccessService {
  private readonly auth = inject(AuthService);

  canModule(moduleId: string): boolean {
    return this.auth.hasPermission(`${moduleId}.view`);
  }

  canTab(moduleId: string, tabId: string): boolean {
    if (!moduleId) return true;
    if (!this.canModule(moduleId) && !this.star()) return false;
    if (this.star()) return true;
    if (!this.hasPrefix(`${moduleId}.tab.`)) return true;
    return this.auth.hasPermission(`${moduleId}.tab.${tabId}`);
  }

  canColumn(moduleId: string, tabId: string, key: string): boolean {
    if (!moduleId || !tabId) return true;
    if (this.star()) return true;
    if (!this.hasPrefix(`${moduleId}.col.${tabId}.`)) return true;
    return this.auth.hasPermission(`${moduleId}.col.${tabId}.${key}`);
  }

  canAction(moduleId: string, tabId: string, action: string): boolean {
    if (!moduleId || !tabId) return true;
    if (this.star()) return true;
    if (!this.hasPrefix(`${moduleId}.act.${tabId}.`)) return true;
    return this.auth.hasPermission(`${moduleId}.act.${tabId}.${action}`);
  }

  private star(): boolean {
    return this.auth.hasPermission('*');
  }

  private hasPrefix(prefix: string): boolean {
    const perms = this.auth.user()?.permissions ?? [];
    return perms.some((perm) => perm.startsWith(prefix));
  }
}
