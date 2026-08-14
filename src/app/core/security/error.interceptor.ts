import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Central error handling: 401 terminates the session, everything else is
 * surfaced through the notification bus with a translation key (the actual
 * text is resolved by the API-driven translation map, never hardcoded).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          auth.logout();
        } else if (error.status === 403) {
          notifications.error('errors.forbidden');
        } else if (error.status >= 500) {
          notifications.error('errors.server');
        } else if (error.status === 0) {
          notifications.error('errors.network');
        }
      }
      return throwError(() => error);
    }),
  );
};
