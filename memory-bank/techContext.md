# Tech Context

## Stack

- **React** 18.2 (StrictMode, function components + hooks)
- **TypeScript** 5.8, `strict: true`, `isolatedModules: true`,
  `moduleResolution: "Bundler"`, `noEmit` (Vite handles the build)
- **Vite** 6 (`@vitejs/plugin-react`) — dev server, proxy, and build
- **Vitest** 3 + Testing Library (`jsdom` environment)
- **SDK:** `@unissey-web/sdk-react@6.0.0` (wraps `@unissey-web/web-components`)
- Also present: `@tanstack/react-query`, `lit` (dependencies of / alongside the
  SDK; not central to the demo logic)
- **`react-json-formatter`** — renders the IAD `/analyze` response inside the
  result modal (`JsonFormatter({ json })`)

## Entry points

- `index.html` → `src/index.tsx` → mounts `<App />`.
- `src/index.tsx` imports the two global stylesheets: `index.css` (base) and
  `styles/theme.css` (SDK `--uni-*` tokens).

## Dev server extras (`vite.config.ts`)

1. **`saveRecordsPlugin`** — dev-only middleware:
   - `POST /api/save-record` → writes to `unissey_records/video_records/`
   - Payload `media` is a data URL; a consumer rebuilds the Blob with
     `await (await fetch(record.media)).blob()`.
   - (IAD `/analyze` results are shown in a downloadable modal, not written to
     disk.)
2. **Proxy** — `/unissey-api/*` → `https://unissey-api-analyze.idcheck-dev02-0.axt`
   (`changeOrigin`, `secure: false`). VPN-only, self-signed TLS. This is how the
   browser reaches Unissey `/api/v3/iad/prepare`, `/api/v3/analyze`, `/logs/...`
   without CORS/TLS pain. `services/iad.ts` uses base `"/unissey-api"`.

## Testing config

- Vitest `alias` maps `@unissey-web/sdk-react` → `src/test/sdkReactMock.tsx`, so
  tests run without a camera or the real (large) SDK bundle.
- `src/setupTests.ts` loads `@testing-library/jest-dom`.
- Type declarations for CSS Module imports come from `vite/client`
  (`src/vite-env.d.ts`).

## Outputs & ignored paths

- Build output: `dist/` (gitignored).
- Dev capture output: `unissey_records/` (present locally; gitignored).

## Gotchas

- The SDK bundle is ~4.8 MB; `vite build` warns about chunk size and an internal
  `eval`. Both come from the SDK, not app code.
- Camera capture requires a secure context (`localhost` or HTTPS).
