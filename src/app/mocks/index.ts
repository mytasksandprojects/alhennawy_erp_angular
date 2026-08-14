/**
 * MOCK LAYER entry point.
 * `app.config.ts` appends `mockBackendInterceptor` to the HTTP
 * interceptor chain (it must be LAST so it terminates requests).
 * To remove mocks completely: delete `src/app/mocks` and drop that
 * single interceptor reference — the rest of the app is untouched.
 */
export { mockBackendInterceptor } from './mock-backend.interceptor';
