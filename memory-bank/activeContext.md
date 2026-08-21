# Active Context

_Last updated: 2026-08-21_

## Current focus

Just added the **IAD result modal**: on a `/analyze` 200, the full JSON response
opens in a modal (`ResultModal` + `react-json-formatter`) with a **Download JSON**
button (`<session_id>.json`); failures keep surfacing as the inline error. The
old file-saving path (`saveResult` + `POST /api/save-result` →
`unissey_records/iad_results/`) was **removed entirely**.

Before that, completed a **structural refactor** of `App.tsx`. It was a single
~613-line file holding helpers, services, an API client, hooks, a component, and
a 5-page root component. It is now decomposed into `config/`, `utils/`,
`services/`, `hooks/`, `components/`, and `pages/`, with per-component
**CSS Modules**. See [systemPatterns.md](./systemPatterns.md) for the layout.

## Recent decisions

- **Result modal over file save**: IAD `/analyze` results are shown in a
  downloadable modal instead of written to disk. `react-json-formatter` renders
  the JSON; `utils/download.ts` handles the client-side `<session_id>.json`
  download; the save-result plumbing was fully removed.
- **CSS Modules** chosen over a single shared stylesheet (per component/page),
  except the global `styles/theme.css` for the SDK `--uni-*` tokens.
- **IAD state resets on navigation** accepted as an intentional trade-off: each
  page owns its own `useIadFlow()`/`useIadPrepare()` and unmounts on nav. Was
  previously preserved because all state lived in the always-mounted `App`.
- **Fixed a pre-existing failing test**: `src/test/sdkReactMock.tsx` now exports
  `OverlayDisplayMode` (the video page reads `OverlayDisplayMode.OVAL` at render).
  Added a nav-walk test to guard mock completeness across pages.
- Extracted reusable `Help`, `ErrorMessage`, and `CaptureLayout` components.

## Verification status

- `npx tsc --noEmit` — clean.
- `npm test` — 4 tests pass (added `ResultModal.test.tsx`).
- `npm run build` — succeeds.
- Manual `npm run dev` click-through of all pages / live IAD calls: **still to be
  done by a human** (needs a camera + VPN).

## Next steps / open threads

- Decide the fate of `services/iad.ts` `getLogs()` (dead code, wrong error text).
- Optional: consider whether IAD state should persist across nav (currently no).
