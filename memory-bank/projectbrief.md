# Project Brief

## What

`sdk-react-demo` is a **proof-of-concept** React application that demonstrates
the capture flows of the Unissey React SDK (`@unissey-web/sdk-react@6.0.0`). It
exists to show, page by page, how each SDK component is wired up and what event
payloads it emits — a living reference for developers integrating the SDK.

## Why

Unissey ships a web SDK for identity capture and liveness / injection-attack
detection (IAD). Integrators need a minimal, readable example of how to mount
each recorder, feed it an IAD session config, handle its completion events, and
call the `/prepare` + `/analyze` endpoints. This app is that example.

## Scope

- **In scope:** one demo page per SDK capture component; a shared "With IAD"
  flow; a standalone IAD page that obtains a session two ways (backend prepare
  or a pasted token); dev-only persistence of captured payloads and analyze
  results to local JSON files.
- **Out of scope:** a real backend, authentication, production hosting,
  persistence beyond local dev files. This is a demo, not a product.

## Non-negotiables

- Stays readable and idiomatic — it is teaching material.
- No secrets committed; the live IAD host is VPN-only and reached via a dev proxy.
