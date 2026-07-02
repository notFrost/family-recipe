# Mobile strategy — one app, one DB, three rungs

Written 2026-07-02 (overnight run). Decision doc for Frost; nothing here is built yet
except the PWA rung's groundwork. The core fact: **the web app IS the backend** — any
mobile shell talks to the same deployed Next.js + Turso through the same session auth,
so "all connected to the same db" is true by construction on every rung.

## The ladder (climb only when the rung below stops paying)

### Rung 1 — PWA (days, ~free) ← do now
Web manifest + icons + service worker → the site becomes installable from the browser
("Add to Home Screen"), full-screen, with an app icon on Android AND iOS.
- **Pros:** near-zero cost; instant updates (it's just the site); no store review, no fees.
- **Cons:** no store listing (discovery), iOS install flow is buried in the share sheet,
  no share-TARGET on iOS (can't "share a TikTok to the app"), push is possible but
  iOS-finicky.
- **Verdict:** the correct first rung. Ship it, link "install the app" from /settings.

### Rung 2 — Capacitor wrapper (weeks, $124 first year) ← when store presence matters
Native iOS/Android shells around the deployed web app (remote-URL wrapper; the app
router's SSR + server actions keep running on Vercel — the shell is a browser with
native superpowers).
- **The killer feature for us:** a native **share extension / share target** — from
  TikTok's share sheet straight into `/recipes/import?url=…`. That's the video-import
  feature meeting users where they scroll. PWAs can do this on Android; ONLY a native
  shell does it on iOS.
- Also unlocks: real push notifications, store discovery ("family recipe app" searches),
  home-screen credibility with older family members (the target demo installs from
  stores, not share sheets).
- **Risks:** Apple guideline 4.2 (minimum functionality) dislikes bare wrappers —
  mitigated by shipping the share extension + push + a native splash; Better Auth
  cookie sessions work in the wrapped webview (same origin), social OAuth needs a
  redirect-URI pass.
- **Costs (ask-first: spending + external accounts):** Apple Developer $99/yr,
  Google Play $25 once.

### Rung 3 — React Native / Expo (months) ← only at proven scale
Real native UI, shared backend. A rewrite of the entire UI layer for polish the wrapper
can't reach (native gestures, offline-first cooking mode). Not before recurring revenue
— it doubles the surface area to maintain.

## Recommendation
PWA now → Capacitor the moment the video-import feature is premium-live (the share
extension is its natural distribution) → RN never, unless the app becomes the job.

## Decisions waiting on Frost
- Greenlight rung 1 (feat/pwa — no cost, no accounts).
- Rung 2 timing + the two store accounts (spending — his card, his call).
