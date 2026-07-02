# Morning brief — overnight run 2026-07-02 (00:13–02:15 GMT-5)

Good morning. **The one decision that unblocks the most:** say *"fix the familyId leak"* —
it's the verifier-confirmed pre-existing bug (forged form data plants a PUBLIC/PRIVATE
recipe inside a family's private grid), the fix is two small guards, and it's only waiting
because server actions are on your ask-first list.

## What shipped — six branches, all verifier-attacked, fixed, green, pushed. Zero merges.

| Branch | What it is | Verifier result |
|---|---|---|
| `feat/cooking-mode` | Step-at-a-time cook view, wake-lock, keyboard | SAFE; 5 findings fixed |
| `feat/print-recipe` | Print charm (tin frame, masthead, QR loop) + **share-as-image** card | SAFE; empty-image 500 fixed |
| `feat/video-import` | Paste TikTok/Short/Reel → recipe draft (keyless oEmbed) | SAFE; URL allowlist survived fuzzing |
| `feat/kitchen-heirloom` | Provisional rebrand, pot-and-steam mark | SAFE; byte-clean, color nit fixed |
| `feat/payment-funnel` | /pricing (your band) + checkout abstraction, beta flag-flip | SAFE under live attack; File-part 500 fixed |
| `feat/pwa` | Installable app: manifest + generated icons | SAFE; no findings |

Each has a Vercel branch preview (dev-Turso). Payment funnel rides the MVP branch, so its
preview ALSO needs the dev-Turso migration you're gating.

## Judgment calls I made in your name (review these)
- **Kitchen Heirloom = adopted provisionally** per your "if manageable, go with it": the field
  is crowded with small independents, the word is descriptive, nobody dominant surfaced. It's a
  branch, fully reversible. Public rename still needs a real TESS search + ~1 attorney hour.
- **Lifetime displays $59** — the LOW end of your $59–79 band (one string in
  `app/lib/payments.ts` to change). Individual/Family are exactly as decided.
- **Logo generation:** impossible tonight — no image-gen tool is connected to this
  environment. The SVG marks stand; next/og *renders* them to PNG for icons/cards.

## Parked honestly (not failures, gates)
- Video-import AI extraction: interface is built; needs an API key + plan gate (premium-only
  per your hard line). Instagram oEmbed needs a Facebook app token.
- Checkout rate-limiting + card-route render cost: matter when a real processor / public
  traffic lands; logged, not urgent.
- Capacitor (MOBILE.md rung 2): $99/yr Apple + $25 Play — spending, yours.

## Competitor intel
*Heirloom Recipe Box* (iOS) already ships save-from-TikTok/IG/YouTube — your video-import
instinct is validated and time-boxed. The legacy lane has at least three players now
(also *Family Recipe Keeper — Hearth*).

Full log: RUNBOOK.md. Waiting-list: HANDOFF.md. The loop is ended; no wakes pending.
