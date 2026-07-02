# RUNBOOK — overnight autonomous run (2026-07-02, started 00:13 GMT-5)

Frost is asleep. This run follows the global `/unattended` standard. The repo is the memory.

## Mission (Frost's words, distilled)

Premium-features push + polish, all on feature branches (NO dev merges of new features
without greenlight; small fixes to already-greenlit surfaces follow standing OKs):

1. **Brand risk research** — how likely/able is the competitor "Heirloom" to cause legal
   trouble over "Kitchen Heirloom"? If manageable → adopt it "for now" on a branch.
   (Logo image-GEN not possible in this environment — no image-generation tool connected;
   SVG marks stand until Frost connects one.)
2. **Print, with love** — the print card is too plain. Keep ink-thrift, add charm
   (recipe-tin card aesthetic). On `feat/print-recipe`.
3. **Export recipe as image** — branded, shareable, still useful. Next's ImageResponse
   (`next/og`) — read vendored docs first (AGENTS.md rule). Must respect view-gating.
4. **Video import scaffold** — paste a TikTok/Short/Reel URL → recipe draft. oEmbed
   (no keys) for metadata now; AI extraction slot-in later (premium-only per hard line).
   New `feat/video-import`.
5. **Payment funnel** — pricing page + upgrade flow + processor-agnostic checkout
   abstraction, built ON `feat/mvp-sharing-families` (has `User.plan`) as
   `feat/payment-funnel`. Pricing = the DECIDED goodwill band (ledger). NO processor
   account, NO real charging (ask-first).
6. **Mobile strategy** — MOBILE.md (PWA → wrapper → native tradeoffs, recommendation)
   + PWA quick win (manifest/icons) on `feat/pwa`.

## Pacing (wall clock, GMT-5 — check `date` every iteration)

| Window          | Mode  | Notes                                              |
|-----------------|-------|----------------------------------------------------|
| 00:13 – limit   | FULL  | Research → print/export → video import             |
| limit → 02:15   | SLEEP | ScheduleWakeup chain (60m hops) to 02:15           |
| 02:15 – ~06:30  | FULL  | Resume at next unchecked item; payment funnel, PWA |
| 06:30 – 07:30   | TAPER | Small chunks only, verifier everything             |
| 07:30           | STOP  | `/handoff` + MORNING.md; end loop explicitly       |

## Hard rules (ask-first — park with recommendation, never do)

- NO Turso migrations (dev or prod). Local `file:./local.db` migrations are fine.
- NO payment-processor accounts, NO real payments, NO pricing changes (band is decided).
- NO auth changes, NO prod anything, NO dev merges of the new feature branches.
- NO external publishing. Pushing `feat/*` branches = OK (previews for Frost).
- NEVER round-trip source through PowerShell Get/Set-Content (UTF-8 corruption — use editors).

## Delegation tiers (Frost: "use sonnet where it makes sense")

- Sonnet builders for well-specified chunks with checkable specs (distinct files).
- ALL verification at session model (never verify below the builder).
- Money/auth/gating code paths: main thread.

## Session log

- 00:13 — Preflight: gate green (tsc/lint/build), runbook written, branches clean
  (dev, prod, feat/cooking-mode, feat/print-recipe, feat/mvp-sharing-families).
- 00:35 — Brand research: Heirloom field is crowded (3+ small independents), word is
  descriptive, no dominant registrant surfaced (TESS unreachable — gap). Verdict:
  manageable for a REVERSIBLE branch adoption; PUBLIC rename needs counsel. Sonnet
  agent (own worktree) built + pushed `feat/kitchen-heirloom`. Competitor intel:
  Heirloom Recipe Box already ships save-from-TikTok/IG/YouTube.
- 00:55 — `feat/print-recipe` +share-as-image (next/og card; verified visually AND
  gated: public 200 / non-public 404 anonymously; shared canViewRecipe helper) +print
  charm (tin frame, serif masthead, QR footer). Pushed.
- 01:10 — `feat/video-import` born + pushed: keyless oEmbed scaffold, SSRF-safe,
  VideoRecipeExtractor = premium AI slot (no key spent). Verified live end-to-end
  against YouTube oEmbed (fetch → preview → prefilled form).
- 01:15 — MOBILE.md written (PWA → Capacitor → RN ladder). Session-model verifier
  launched over all three chunks.
- 01:45 — Verifier verdicts: ALL THREE SHIP-TO-PREVIEW SAFE. It fuzzed the URL
  allowlist (all bypass tricks failed), proved no existence-oracle on the card
  route, byte-verified no encoding corruption in the rebrand. Findings fixed +
  pushed: card 500 on empty imageUrl (REAL BUG → warm fallback band), uncapped
  echoed URL (NIT), BrandMark color on mobile auth chips (NIT). Deferred with log:
  card-route render cost as a DoS vector (unauth for PUBLIC — note for later
  rate-limiting); app-wide next/image throw on empty src (pre-existing, parked).
- 01:55 — Docs to dev (RUNBOOK, MOBILE.md, HANDOFF refresh). Wake armed ~02:25 →
  payment funnel (on MVP branch) + PWA in the fresh window. Gotcha of the night:
  branch switches leave stale .next types → rebuild (or delete .next/dev ONLY when
  no dev server runs).
