import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { AppConfigService } from './core/config/app-config.service';
import { httpCacheInterceptor } from './core/cache/http-cache.interceptor';
import { authTokenInterceptor } from './core/security/auth-token.interceptor';
import { errorInterceptor } from './core/security/error.interceptor';
// MOCK LAYER — remove this import together with the `src/app/mocks` folder.
import { mockBackendInterceptor } from './mocks';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,
        errorInterceptor,
        httpCacheInterceptor,
        // MOCK LAYER — must stay LAST; delete this line to go live.
        mockBackendInterceptor,
      ]),
    ),
    provideAppInitializer(() => inject(AppConfigService).load()),
  ],
};
