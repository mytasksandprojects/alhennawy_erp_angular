/**
 * Runtime environment configuration.
 *
 * `useMockApi` is the single switch between the mock backend and the real API.
 * To go live:
 *   1. Set `useMockApi` to false.
 *   2. Point `apiBaseUrl` at the real gateway.
 *   3. Delete the `src/app/mocks` folder and remove `provideMockBackend()`
 *      from `app.config.ts` (one line).
 * Nothing else in the application changes.
 */
export const environment = {
  production: false,
  useMockApi: true,
  apiBaseUrl: '/api',
} as const;
