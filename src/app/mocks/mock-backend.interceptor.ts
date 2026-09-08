import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { delay, mergeMap, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { pageEnvelope } from './data/page.util';
import { matchRoute } from './mock-registry';
import { MOCK_ROUTES } from './routes';

const SIMULATED_LATENCY_MS = 250;

/**
 * MOCK LAYER — intercepts every request to the API base url and serves
 * data from `mocks/data`. Requests never leave the browser.
 * Removing `provideMockBackend()` from app.config.ts disables it entirely.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockApi || !req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const [pathWithQuery] = [req.urlWithParams.slice(environment.apiBaseUrl.length)];
  const [path, queryString] = pathWithQuery.split('?');
  const match = matchRoute(MOCK_ROUTES, req.method, path);

  if (!match) {
    return of(null).pipe(
      delay(SIMULATED_LATENCY_MS),
      mergeMap(() =>
        throwError(
          () =>
            new HttpErrorResponse({ status: 404, url: req.url, error: { path } }),
        ),
      ),
    );
  }

  try {
    const query = new URLSearchParams(queryString ?? '');
    const data = match.route.handler({
      path,
      method: req.method,
      body: req.body,
      query,
    });
    return of(new HttpResponse({ status: 200, body: envelope(data, query) })).pipe(
      delay(SIMULATED_LATENCY_MS),
    );
  } catch (error) {
    const status = error instanceof MockApiError ? error.status : 500;
    return of(null).pipe(
      delay(SIMULATED_LATENCY_MS),
      mergeMap(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status,
              url: req.url,
              error: { message: (error as Error).message },
            }),
        ),
      ),
    );
  }
};

/** List GETs with page/pageSize return a slice + meta; everything else stays `{ data }`. */
function envelope(data: unknown, query: URLSearchParams): { data: unknown; meta?: object } {
  if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
    return data as { data: unknown; meta: object };
  }
  if (Array.isArray(data) && (query.has('page') || query.has('pageSize'))) {
    return pageEnvelope(data, query);
  }
  return { data };
}

/** Throw inside a handler to simulate a specific HTTP failure. */
export class MockApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
