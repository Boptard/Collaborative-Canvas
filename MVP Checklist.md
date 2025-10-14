# CollabCanvas — MVP Phased Checklist

> Scope note: This checklist is strictly **MVP-only** (core canvas, rectangles/circles, move/resize, realtime sync, cursors/presence, Google OAuth, persistence, deployment, and performance targets). It **excludes** post-MVP features and **all AI scope**.

## Phase 0 — Project Setup
- [ ] Initialize repo (monorepo or single app) with React front end and Firebase client SDK
- [ ] Configure Firestore project & security rules (read/write only for authenticated users)
- [ ] Add Google OAuth sign-in/out flow (client + server config)
- [ ] Establish type-safe canvas state model (TypeScript interfaces) for a **single Firestore document** canvas
- [ ] Add feature flags / env configs (DEV/PROD Firestore, public test URL placeholder)
- [ ] Set up basic error/reporting hooks (console + lightweight telemetry)

## Phase 1 — Canvas Core (Pan/Zoom + Render Loop)
- [ ] Implement performant canvas surface with pan/zoom (wheel, trackpad, pinch)
- [ ] Add world↔screen coordinate utilities (for accurate hit-testing and object placement)
- [ ] Maintain stable 60 FPS target during pan/zoom (requestAnimationFrame loop)
- [ ] Add viewport state (center, zoom) and debounced persistence (local in memory; no sync yet)
- [ ] Smoke test: pan/zoom remains smooth with empty scene

## Phase 2 — Object Basics (Rectangles & Circles)
- [ ] Add creation tools for **Rectangle** and **Circle**
- [ ] Ensure **default object state**: fixed size and **spawn at the center of current viewport**
- [ ] Implement selection outline/handles (single object)
- [ ] Implement **move** (drag) and **resize** interactions with visual feedback
- [ ] Keyboard/mouse accessibility basics (e.g., escape to cancel, cursor styles)
- [ ] Unit tests for geometry & bounds

## Phase 3 — Realtime Collaboration Foundation
**Data model & updates**
- [ ] Represent entire canvas as **one Firestore JSON document** (objects, viewport meta)
- [ ] Implement **continuous state updates** while interacting (e.g., streaming at interaction cadence)
- [ ] Batch/merge small updates to respect write limits (coalescing/throttling)

**Conflict resolution**
- [ ] Implement **first-user lock** on move/resize: acquire on mousedown, release on mouseup
- [ ] Enforce “last write wins” for non-locked fields

**Presence & cursors**
- [ ] Add **multiplayer cursors** (client publishes cursor pos; others render)
- [ ] Add **presence awareness**: who’s online with **color-coded username tag** attached to their cursor
- [ ] Clean up presence on disconnect (onDisconnect / visibilitychange handlers)

**Performance & scale guards**
- [ ] Target **60 FPS** during object manipulation
- [ ] Keep sync latency for **object updates** and **cursor positions** in the low-ms range (instrument metrics)
- [ ] Validate responsiveness with **500+ simple objects** and **5+ concurrent users** (manual scenario first)

## Phase 4 — Persistence & Resilience
- [ ] Persist full canvas state so users can refresh mid-edit and resume
- [ ] On reconnect, rehydrate from Firestore and resolve any stale locks
- [ ] Add optimistic UI for local interactions while remote updates stream in
- [ ] Add basic “connection status” indicator (online/offline/syncing)

## Phase 5 — Authentication (Google OAuth)
- [ ] Require sign-in before joining a canvas
- [ ] Display signed-in user name & generated color for presence tags
- [ ] Verify auth stability (high success rate) and error paths (denied scopes, popup blocked)

## Phase 6 — Deployment
- [ ] CI build (typecheck, lint, minimal tests) and preview environment
- [ ] Production deploy to a public URL
- [ ] Gate test canvases behind auth; create one shared test canvas doc
- [ ] Smoke test with at least two browsers/accounts over the public URL

## Phase 7 — Metrics & Success Criteria (MVP)
- [ ] Instrument FPS during pan/zoom/manipulation (display in a small dev HUD)
- [ ] Log interaction and sync **latency** (object updates & cursor positions)
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
