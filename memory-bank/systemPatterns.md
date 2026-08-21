# System Patterns

## Layered decomposition

`App.tsx` is a thin shell. Responsibilities are split into layers, and imports
flow **strictly downward** — no cycles:

```
App.tsx
  ├─ config/pages.ts            (leaf: Page type + nav list)
  ├─ components/Nav.tsx         → config/pages
  ├─ components/PageHeader.tsx  → components/Help
  └─ pages/*.tsx
        ├─ @unissey-web/sdk-react            (the SDK)
        ├─ utils/events.ts                   (leaf: logEvent)
        ├─ services/records.ts               → utils/blob, utils/events
        ├─ components/CaptureLayout.tsx       → components/IadControls, ResultModal
        ├─ components/IadControls.tsx         → import type { IadFlow }, Help, ErrorMessage
        ├─ components/ResultModal.tsx         → utils/download, react-json-formatter
        ├─ hooks/useIadFlow.ts                → services/iad
        └─ hooks/useIadPrepare.ts             → services/iad
```

Leaves (no local deps): `config/pages.ts`, `utils/blob.ts`, `utils/events.ts`,
`utils/download.ts`, `styles/theme.css`.

## Key patterns

- **Services are framework-agnostic.** `services/iad.ts` (Unissey API client)
  and `services/records.ts` (dev persistence) contain no React. Hooks call them.
- **Hooks own state.** `useIadFlow` (shared capture IAD flow, returns the
  `IadFlow` type) and `useIadPrepare` (standalone IAD page state machine).
- **Pages own their hook call.** Each capture page calls `useIadFlow()` itself
  and wraps content in `<CaptureLayout>`. Consequence: navigating away unmounts
  the page, so IAD toggle/config/form state **resets on navigation** — an
  intentional trade-off for a cleaner structure in a POC.
- **Reusable presentational primitives.** `Help` and `ErrorMessage` wrap the
  cross-cutting `.help`/`.error` paragraphs so those styles aren't duplicated.
  `CaptureLayout` holds the shared `.capturePage` grid + the IAD controls.
- **The type-only cross-edge.** `IadControls`/`CaptureLayout` import
  `IadFlow` from the hook with `import type`, so it's erased at build and can
  never form a runtime cycle. Hooks never import components/pages.

## Styling

- **CSS Modules** everywhere (`X.module.css`, camelCase classes via `styles.*`).
- **One global stylesheet for app styling:** `styles/theme.css` holds the
  `--uni-*` custom properties — the SDK web-components read them, so they must be
  global. Imported once in `index.tsx`. `index.css` holds base body/font rules.
- Composite selectors kept faithful when split (e.g. `.capturePage > button`,
  `.iadToggle` retains its `!important` overrides over `.capturePage label`).

## React Fast Refresh rules (enforced by the split)

- Each file is single-purpose: pages/components export only components; hooks
  export only a hook (+ an erased type); services/utils/config export no
  components. Never co-locate a hook with a component.
- Type exports use `export type`; type imports use `import type`
  (`isolatedModules` is on).

## Testing

- `App.test.tsx` renders `App` with the SDK aliased (Vitest) to
  `src/test/sdkReactMock.tsx`. A second test navigates to every page to guarantee
  the mock exposes each SDK **runtime** value a page reads.
- Rule: add new SDK runtime values to the mock; never add type-only ones.

## Anti-patterns to avoid

- No barrel `index.ts` files (reintroduce cycles).
- Don't import `styles/theme.css` per component — global, imported once.
- Don't push service/network logic into components.
