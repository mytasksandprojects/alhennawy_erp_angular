import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route-level authorization. Attach `data: { permission: 'module.action' }`
 * to any route; users lacking the permission are pushed back home.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const permission = route.data['permission'] as string | undefined;
  if (auth.hasPermission(permission)) return true;
  return router.createUrlTree(['/']);
};
