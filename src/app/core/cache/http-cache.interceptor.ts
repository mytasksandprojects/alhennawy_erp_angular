import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import { RuntimeConfigStore } from '../config/runtime-config.store';

const CACHE_PREFIX = 'http:';
const NO_CACHE_HEADER = 'x-no-cache';

/**
 * Caches GET responses with the TTL delivered by the API config.
 * Any mutation (POST/PUT/DELETE) automatically invalidates cached GETs
 * that share the same module segment, keeping lists fresh after writes.
 */
export const httpCacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const cache = inject(CacheService);
  const store = inject(RuntimeConfigStore);

  if (req.method !== 'GET') {
    cache.invalidateByPrefix(CACHE_PREFIX + moduleSegment(req.url));
    return next(req);
  }

  if (req.headers.has(NO_CACHE_HEADER)) {
    return next(req.clone({ headers: req.headers.delete(NO_CACHE_HEADER) }));
  }

  const ttl = store.settings()?.cache.httpTtlSeconds ?? 0;
  if (ttl <= 0) return next(req);

  const key = CACHE_PREFIX + req.urlWithParams;
  const cached = cache.get<HttpResponse<unknown>>(key);
  if (cached) {
    return of(new HttpResponse({ body: cached.body, status: 200, url: req.url }));
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        cache.set(key, { body: event.body }, ttl);
      }
    }),
  );
};

/** `/api/weighbridge/tickets/complete` → `/api/weighbridge`. */
function moduleSegment(url: string): string {
  const parts = url.split('?')[0].split('/');
  return parts.slice(0, 3).join('/');
}
