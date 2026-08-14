# Al Hennawy ERP — Angular Frontend

ERP frontend for **Al Hennawy Paper & Chemical Industry**, covering the full
BRD: Finance, Purchasing, Administration, HR (ZKTeco), Logistics
(import/export), Warehouses, Quality, Production, Sales (local + export +
e-invoice), the **Weighbridge (الميزان)** and the **Cutter (المقص)** with a
printable barcode roll label.

## Golden rules baked into the architecture

1. **Everything visual comes from the API.** Texts, colors, borders, radii,
   spacing, fonts, layout numbers — all delivered by `/config/bundle` and
   `/config/translations/{lang}` and applied as CSS variables + a translation
   map. Stylesheets reference `var(--token)` only, with **no fallbacks**.
   If the API returns nothing the app intentionally shows a **white screen**.
2. **Max 300 lines per file** — enforced by `node tools/verify.mjs`, which
   also verifies every translation key exists in **both** Arabic and English
   and that no stylesheet contains a hardcoded color.
3. **Arabic (RTL) and English (LTR)** switch at runtime; direction, document
   title and locale number/date formatting all follow the API config.

## Switching from mocks to the real API

Everything fake lives in **one folder**: `src/app/mocks`.

1. `src/environments/environment.ts` → set `useMockApi: false`, point
   `apiBaseUrl` at the gateway.
2. `src/app/app.config.ts` → remove the `mockBackendInterceptor` line
   (marked with `MOCK LAYER` comments).
3. Delete `src/app/mocks/`. Done — no other file changes.

The mock backend implements the exact contracts in
`src/app/core/api/api-endpoints.ts`, so the real backend only has to honour
the same shapes (`{ data: ... }` envelope).

## Security

- Bearer token attached **only** to API-origin requests; sessions live in
  `sessionStorage` (die with the tab — shared factory workstations).
- `authGuard` on the shell, `permissionGuard` per module route
  (`data.permission`), menu filtered by permission.
- Price fields render **only** for holders of `finance.viewPrices` (BRD rule).
- Central error interceptor: 401 → logout, 403/5xx/network → translated toasts.
- 401-safe cache: logout clears every cached response.

## Caching

- `CacheService`: two-level (memory + sessionStorage) with TTL.
- `httpCacheInterceptor`: caches GETs with the TTL provided **by the API
  config** (`cache.httpTtlSeconds`); any POST/PUT/DELETE auto-invalidates the
  module's cached GETs.

## Key screens

- **الميزان** — five weighing types with strict serial numbers; inbound flow
  (loaded → empty, e.g. دشت purchases) and outbound flow (empty → loaded,
  e.g. finished product sales); net auto-calculated; overdue/abnormal alerts.
- **المقص** — roll registration (weight, GSM, width, diameter, grade) and a
  printable label matching the physical card, with a dependency-free Code 39
  SVG barcode. Printing registers the deduction via the API.

## Demo users (mock)

| User | Password | Access |
|------|----------|--------|
| `admin` | `admin123` | everything |
| `finance` | `finance123` | finance + prices |
| `store1` | `store123` | warehouse, weighbridge, cutter (no prices) |

## Commands

```bash
npm start          # dev server on http://localhost:4200
npm run build      # production build
node tools/verify.mjs  # guardrails: 300 lines, i18n keys, no hardcoded colors
```
