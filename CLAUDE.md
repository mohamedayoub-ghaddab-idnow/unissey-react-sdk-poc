# CLAUDE.md — sdk-react-demo

Guidance for AI assistants (and humans) working in this repo. Read the
[`memory-bank/`](./memory-bank/) files for deeper context on the "why".

## What this is

A **proof-of-concept** React app that showcases the flows of the Unissey React
SDK (`@unissey-web/sdk-react@6.0.0`). It is a demo/reference — **not** a product.
Each nav page demonstrates one SDK capture component, plus an IAD
(injection-attack-detection) flow that calls Unissey's `/prepare` + `/analyze`.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # tsc --noEmit && vite build
npm test         # vitest run
npx tsc --noEmit # type-check only
```

## Architecture

`App.tsx` is a **thin shell**: nav state + a page switch. Everything else is
decomposed by responsibility. Dependencies flow strictly **downward**
(`App → pages → { hooks, components, services, utils, config }`,
`hooks → services → utils`) — there are no cycles.

```
src/
  config/pages.ts       Page type + nav list
  utils/                pure leaf helpers (blob.ts, events.ts) — no deps
  services/             framework-agnostic I/O
    iad.ts              Unissey API client (prepare/analyze/logs) via /unissey-api proxy
    records.ts          POST captures to the dev record-writer endpoint
  hooks/                React state
    useIadFlow.ts       shared "With IAD" flow for capture pages (+ IadFlow type)
    useIadPrepare.ts    standalone IAD page's prepare/manual state machine
  components/           reusable visual pieces (Nav, PageHeader, IadControls,
                        CaptureLayout, ResultModal, Help, ErrorMessage) — each
                        with a *.module.css
  utils/download.ts     downloadJson(filename, data) — client-side JSON download
  pages/                one file per nav page; each owns its own hook call
  styles/theme.css      GLOBAL --uni-* SDK theme tokens (must stay global)
  App.tsx               shell
```

## Dev-only backend (see `vite.config.ts`)

There is **no real backend**. The Vite dev server provides two things:

- **Record writer plugin** — `POST /api/save-record` writes capture JSON files
  into `unissey_records/video_records/`. `media` is stored as a data URL that
  reconstructs the original Blob. (IAD `/analyze` results are no longer written
  to disk — they are shown in a downloadable modal in the app instead.)
- **Proxy** — requests to `/unissey-api/*` are forwarded to the Unissey dev host
  (VPN-only, self-signed TLS) to dodge browser CORS. Only reachable on the VPN.

## Conventions (keep these when editing)

- **CSS Modules** per component/page (`X.module.css`, `import styles from …`,
  camelCase class names). The only global stylesheet for app styling is
  `styles/theme.css` (SDK `--uni-*` tokens) — those must stay global because the
  SDK web-components read them.
- **`import type`** for all type-only imports (`isolatedModules` is on) so they
  are erased and never demand a runtime export (matters for the test mock).
- **Named exports** for pages/components; **`App` stays a default export**
  (the test imports it as default).
- **Never co-locate a hook with a component** in one file, and don't mix
  component + non-component exports — it breaks React Fast Refresh.
- **No barrel `index.ts` files** — import directly to avoid reintroducing cycles.
- Each capture page owns its own `useIadFlow()`; navigating away unmounts it, so
  IAD state intentionally resets on page change.

## Tests

`src/App.test.tsx` renders `App` with the SDK **mocked** via a Vitest alias to
`src/test/sdkReactMock.tsx`. That mock must export every SDK **runtime value** a
page reads (currently `AcquisitionPreset`, `OverlayDisplayMode`, and the stub
capture components). Type-only SDK imports (e.g. `SessionConfig`) are erased and
must NOT be added to the mock. When a page starts using a new SDK runtime value,
add it to the mock or the render will crash with `undefined.X`.

## Known issues / TODO

- `services/iad.ts` `getLogs()` is dead code (its only call site is commented out
  in `useIadFlow`) and has a copy-pasted error message — wire it up or delete it.
- The SDK bundle is large (~4.8 MB) and triggers Vite chunk-size + eval warnings;
  both originate in the SDK, not app code.
