# Product Context

## The problem it solves

Developers integrating the Unissey React SDK need to see each capture flow
working in isolation, understand the events each component fires, and learn how
to attach an IAD (injection-attack-detection) session. Reading the SDK docs
alone leaves gaps; this app is the runnable companion.

## Who uses it

- Unissey integrators evaluating or wiring up the SDK.
- Internal engineers validating SDK behavior against a known-good sample.

## The pages (one per capture flow)

| Nav label            | SDK component      | Notes                                                        |
| -------------------- | ------------------ | ------------------------------------------------------------ |
| Video recorder       | `VideoRecorder`    | Default page. Oval overlay. "With IAD" toggle available.     |
| Selfie capture       | `SelfieCapture`    | "With IAD" toggle available.                                 |
| Reference capture    | `ReferenceCapture` | Document/ID photo. **No IAD** — its API has no session config. |
| Full capture         | `FullCapture`      | Selfie + reference in one flow. "With IAD" toggle available. |
| IAD video recorder   | `VideoRecorder`    | Standalone IAD page: prepare via backend URL, or paste a token. |

## Three ways to observe results

1. **Console logs** — every SDK event payload (`recordCompleted`, `selfie`,
   `reference`, `data`, `recorderReady`, …) is logged to the browser console.
2. **Result modal** — when a "With IAD" capture's `/analyze` returns 200, the
   full JSON response pops up in a modal with a **Download JSON** button
   (`<session_id>.json`). Failures surface as an inline error instead.
3. **Local JSON files** (dev only) — completed captures are written to
   `unissey_records/video_records/`.

## The "With IAD" flow (capture pages)

Toggling **With IAD** on a capture page: calls `/prepare` → receives a session
token → starts the recorder with that IAD config → on capture completion calls
`/analyze` with the media + metadata → shows the analyze result JSON in a
downloadable modal (200), or an inline error otherwise.

## Camera note

Camera access needs a secure context; `localhost` works for dev, deployed demos
must use HTTPS.
