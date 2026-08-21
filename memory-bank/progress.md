# Progress

_Last updated: 2026-08-21_

## What works

- All five demo pages render and are navigable: Video, Selfie, Reference, Full,
  IAD video recorder.
- "With IAD" flow on Video / Selfie / Full: `/prepare` → recorder → `/analyze`
  → result modal with a **Download JSON** button (requires VPN to reach the dev
  host).
- Standalone IAD page: prepare via backend URL, or paste a token directly.
- Dev-only persistence of captures to `unissey_records/video_records/`.
- SDK event payloads logged to the console.
- Type-check, unit tests, and production build all pass.

## Recently done

- **IAD result modal**: `/analyze` 200 → `ResultModal` shows the full JSON
  (`react-json-formatter`) with a **Download JSON** (`<session_id>.json`) button;
  failures stay as the inline error. Removed the old `saveResult` +
  `POST /api/save-result` → `unissey_records/iad_results/` path entirely. Added
  `utils/download.ts` and `ResultModal.test.tsx`.
- Refactored the monolithic `App.tsx` into layered modules + CSS Modules
  (see [activeContext.md](./activeContext.md)).
- Fixed the previously-failing unit test (missing `OverlayDisplayMode` mock
  export) and added navigation coverage.

## Known issues

- `services/iad.ts` `getLogs()` is **dead code** — its only call site is
  commented out inside `useIadFlow`, and its error message is a copy-paste from
  `analyzeIad`. Wire it up or remove it.
- SDK bundle is ~4.8 MB → Vite chunk-size + `eval` warnings on build (SDK-side,
  not app code).
- IAD state does not persist across page navigation (intentional; revisit if a
  demo scenario needs it).

## Not yet verified

- End-to-end manual run (`npm run dev`) with a real camera and VPN access —
  needs a human. Automated tests use a mocked SDK and cannot exercise capture.

## Possible next work

- More SDK feature pages as the POC grows.
- Decide on `getLogs` (delete vs. surface logs in the UI).
