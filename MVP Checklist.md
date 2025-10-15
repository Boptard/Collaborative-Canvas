# CollabCanvas — MVP Phased Checklist

> Scope note: This checklist is strictly **MVP-only** (core canvas, rectangles/circles, move/resize, realtime sync, cursors/presence, Google OAuth, persistence, deployment, and performance targets). It **excludes** post-MVP features and **all AI scope**.

## Phase 0 — Project Setup
- [x] Initialize repo (monorepo or single app) with React front end and Firebase client SDK
- [x] Configure Firestore project & security rules (read/write only for authenticated users)
- [x] Add Google OAuth sign-in/out flow (client + server config)
- [x] Establish type-safe canvas state model (TypeScript interfaces) for a **single Firestore document** canvas
- [x] Add feature flags / env configs (DEV/PROD Firestore, public test URL placeholder)
- [x] Set up basic error/reporting hooks (console + lightweight telemetry)

## Phase 1 — Canvas Core (Pan/Zoom + Render Loop)
- [x] Implement performant canvas surface with pan/zoom (wheel, trackpad, pinch)
- [x] Add world↔screen coordinate utilities (for accurate hit-testing and object placement)
- [x] Maintain stable 60 FPS target during pan/zoom (requestAnimationFrame loop)
- [x] Add viewport state (center, zoom) and debounced persistence (local in memory; no sync yet)
- [x] Smoke test: pan/zoom remains smooth with empty scene

## Phase 2 — Object Basics (Rectangles & Circles)
- [x] Add creation tools for **Rectangle** and **Circle**
- [x] Ensure **default object state**: fixed size and **spawn at the center of current viewport**
- [x] Implement selection outline/handles (single object)
- [x] Implement **move** (drag) and **resize** interactions with visual feedback
- [x] Keyboard/mouse accessibility basics (e.g., escape to cancel, cursor styles)
- [ ] Unit tests for geometry & bounds

## Phase 3 — Realtime Collaboration Foundation
**Data model & updates**
- [x] Represent entire canvas as **one Firestore JSON document** (objects, viewport meta)
- [x] Implement **continuous state updates** while interacting (e.g., streaming at interaction cadence)
- [x] Batch/merge small updates to respect write limits (coalescing/throttling)

**Conflict resolution**
- [x] Implement **first-user lock** on move/resize: acquire on mousedown, release on mouseup
- [x] Enforce "last write wins" for non-locked fields

**Presence & cursors**
- [x] Add **multiplayer cursors** (client publishes cursor pos; others render)
- [x] Add **presence awareness**: who's online with **color-coded username tag** attached to their cursor
- [x] Clean up presence on disconnect (onDisconnect / visibilitychange handlers)

**Performance & scale guards**
- [x] Target **60 FPS** during object manipulation
- [x] Keep sync latency for **object updates** and **cursor positions** in the low-ms range (instrument metrics)
- [ ] Validate responsiveness with **500+ simple objects** and **5+ concurrent users** (manual scenario first)

## Phase 4 — Persistence & Resilience
- [x] Persist full canvas state so users can refresh mid-edit and resume
- [x] On reconnect, rehydrate from Firestore and resolve any stale locks
- [x] Add optimistic UI for local interactions while remote updates stream in
- [ ] Add basic "connection status" indicator (online/offline/syncing)

## Phase 5 — Authentication (Google OAuth)
- [x] Require sign-in before joining a canvas
- [x] Display signed-in user name & generated color for presence tags
- [ ] Verify auth stability (high success rate) and error paths (denied scopes, popup blocked)

## Phase 6 — Deployment
- [x] CI build (typecheck, lint, minimal tests) and preview environment
- [ ] Production deploy to a public URL
- [x] Gate test canvases behind auth; create one shared test canvas doc
- [ ] Smoke test with at least two browsers/accounts over the public URL

## Phase 7 — Metrics & Success Criteria (MVP)
- [x] Instrument FPS during pan/zoom/manipulation (display in a small dev HUD)
- [x] Log interaction and sync **latency** (object updates & cursor positions)
- [ ] Track Google OAuth success/error rates
- [ ] Add lightweight session logs for diagnosing lock conflicts

## Phase 8 — MVP Test Scenarios (Runbook)
1) **Concurrent Interaction**
- [ ] Two users edit different objects simultaneously
- [ ] Confirm 60 FPS maintained locally and low-ms cross-user propagation

2) **Conflict Resolution**
- [ ] User A drags Object X; User B tries to drag X at same time
- [ ] Verify A holds lock; B is blocked until A releases; no jitter/flip-flop

3) **State Persistence**
- [ ] While editing, User A refreshes
- [ ] On reload, canvas state matches last completed action; session rejoins presence correctly

4) **Load Test**
- [ ] Create hundreds of objects (≥500) and rapidly move a subset
- [ ] Confirm FPS stability and acceptable sync latency with ≥5 concurrent users
