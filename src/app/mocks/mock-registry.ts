/**
 * MOCK LAYER — delete this whole folder when the real API is connected.
 * Route table matching the exact contracts in `core/api/api-endpoints.ts`.
 */

export interface MockContext {
  /** Path after the api base url, without query string. */
  path: string;
  method: string;
  body: unknown;
  query: URLSearchParams;
}

export type MockHandler = (ctx: MockContext) => unknown;

export interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Exact path or pattern with `:param` segments. */
  pattern: string;
  handler: MockHandler;
}

export function matchRoute(
  routes: MockRoute[],
  method: string,
  path: string,
): { route: MockRoute; params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.method !== method) continue;
    const params = matchPattern(route.pattern, path);
    if (params) return { route, params };
  }
  return null;
}

function matchPattern(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
