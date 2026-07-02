# family-recipe (recipes-app) — session hand-off (START HERE)

Single entry point for a fresh session. The repo is the durable memory; deeper history and the
decision ledger live in Claude project memory. Local: `D:\Code\recipes-app`.
Owner: **Frost** (notFrost / DiegoJohnsonL).

## What this is
**Family Recipe** — a recipe box with public discovery and private family groups. The soul (and
the differentiator): recipe `story` + "originally from" — family legacy, free and viral. Stack:
Next.js 16 (App Router), React 19, Prisma 7 + libSQL/Turso, Better Auth v1.6, Tailwind v4 +
shadcn/ui, Vercel.

## State (2026-07-01)
- **Prod is LIVE on the new app** (`https://family-recipe-nine.vercel.app`, Vercel project
  `family-recipe`): Warm & Homey **Amber** design (Nunito, mocha dark) + Better Auth (cutover
  2026-06-29, in-place and data-preserving). Email/password works on prod.
- **Branch flow:** `dev` → `prod`. Vercel env scopes: `prod` branch → Production scope → prod
  Turso; ALL other branches → Preview scope → dev Turso (automatic isolation).
- **HOMESTEAD WIRING COMPLETE on dev (2026-07-01, verifier: PASS).** All five real pages ship
  the Homestead language on real data: recipe, profile (`/u/[id]`), family, form (new+edit,
  behaviors preserved + family-CTA now defaults FAMILY visibility), and a NEW `/settings`
  route (read-only account — mutations are ask-first). Navbar: avatar+name → `/settings`
  (mobile-reachable), route-aware active pills (NavLinks). Foundations: `authorImage`/
  `userImage` repo includes, read-only `user-repository`, `Avatar` fallback, `ShareLinkButton`,
  CopyLinkButton pill variant that copies ABSOLUTE urls. Where mocks used missing fields the
  pages adapt — proposed-adds list in the decision ledger; `story`/`sourceName` arrive with
  the MVP branch merge, don't fake them. `/preview` harness stays for future exploration.
- **Brand exploration (2026-07-01):** `/preview/branding` fitting room — 15 candidates in 4
  batches (opening flight / heirloom shelf / warm shelf / single words) × 11 Amber SVG marks,
  live navbar/app-icon/favicon try-on, and a 22-name GRAVEYARD of verified collisions (don't
  re-propose those). Every batch-2+ name was live-web-vetted; USPTO + app-store sweep on the
  finalists is the real gate. **Frost peer-reviews tonight via the dev preview.**
- **Competitor intel (2026-07-01):** *Family Recipe Keeper — Hearth* (iOS) is directly our
  product — the family-legacy lane now has at least two players (with Heirloom).
  Preview (latest `dev`):
  `https://family-recipe-git-dev-nfs-projects-adbffaf9.vercel.app/preview`
- **Unmerged branch `feat/mvp-sharing-families`** (monetization MVP): tokenized share links
  (`/r/[token]`), save-a-copy lineage (`parentRecipeId`), favorites, family invites, plan gates
  (30 AUTHORED recipes free — shared/family never count; family members 5 free / 50 premium by
  the OWNER's plan). No payment processor, no AI (hard line: no recurring cost before recurring
  income). Its migration still needs applying to dev-Turso before its preview works.

## Overnight run 2026-07-02, COMPLETE (RUNBOOK.md = full log, MORNING.md = the brief)
**Six feature branches await greenlight — every one verifier-attacked, findings fixed,
green-gated, pushed. NONE merged to dev.** Vercel branch previews on dev-Turso:
1. `feat/cooking-mode` — step-by-step cook view (wake-lock, keyboard, finish screen).
2. `feat/print-recipe` — print charm (tin frame, serif masthead, QR growth loop) +
   **share-as-image** (`/recipes/[id]/card`, branded 1080×1350 PNG, page-identical gating
   via shared `canViewRecipe`).
3. `feat/video-import` — TikTok/Shorts/Reels → recipe draft (keyless oEmbed, SSRF-fuzzed);
   premium AI extractor = interface slot awaiting a key + plan gate.
4. `feat/kitchen-heirloom` — provisional rebrand (research: crowded field, descriptive word →
   manageable REVERSIBLY; public rename needs TESS + attorney hour).
5. `feat/payment-funnel` (off the MVP branch) — /pricing with the decided band (**Lifetime
   shows $59 = low end of your $59–79 band, one string in app/lib/payments.ts**),
   PaymentProvider abstraction, beta flag-flip checkout; money path survived live attack
   (CSRF, cross-user, injection). No processor, no real charging.
6. `feat/pwa` — installable app: manifest + build-time-generated icons (pot mark), themeColor.
MOBILE.md = the ladder (PWA shipped → Capacitor when video-import is premium-live → RN
never-unless). Competitor intel: *Heirloom Recipe Box* (iOS) already ships video-import.
Deferred with log: card-route render cost (unauth DoS vector → rate-limit later); app-wide
next/image throw on empty imageUrl (pre-existing); checkout rate-limit (matters when a real
processor lands).

## Decisions waiting on Frost
- **OK to fix the familyId-leak bug?** (verifier-confirmed, PRE-EXISTING, touches server
  actions = ask-first): forged form data can attach `familyId` to a PUBLIC/PRIVATE recipe with
  no membership check, and it renders inside that family's private grid. Fix = scrub familyId
  in `parseRecipeFormData` when visibility !== FAMILY + filter `getRecipesByFamily` to
  `visibility: "FAMILY"`. Small, ready to go on your word.
- **Greenlights for the six branches above** (test each branch preview; note: cooking-mode and
  print-recipe both edit the recipe page's action row → whichever merges second needs a small
  manual reconcile; payment-funnel rides on the MVP branch and merges with it).
- **The name + mark pick** (peer feedback + `/preview/branding`): keep Family Recipe with a
  better mark, or commit to Kitchen Heirloom (then: TESS + attorney, favicon/navbar swap is
  already built on its branch).
- **OAuth redirect URIs for prod** (Google + Facebook consoles): social login on prod fails the
  callback until `https://family-recipe-nine.vercel.app/api/auth/callback/{google,facebook}` is
  registered (+ FB App Domains, Live mode, Privacy/Data-Deletion URLs). Email/pw already works.
- **Merge decision** on `feat/mvp-sharing-families` (+ payment funnel): needs its migration
  applied to dev-Turso first (backup-turso.mts, then migrate-turso.mts — your call).

## Conventions / gotchas
- `authorId` comes from the session, never the form; ownership checked on every edit/delete.
- Ingredients/steps are JSON-in-TEXT, (de)serialized only inside `app/lib/*-repository.ts`.
- SQLite/libSQL has no enums/arrays → TEXT. Modified Next.js — read `node_modules/next/dist/docs/`
  before framework APIs (AGENTS.md). Known trap: `next/image` `priority` is DEPRECATED in this
  Next 16 → use `preload` (the design variants still say `priority`; fix on port).
- eslint ignores `.claude/worktrees/**` (stale session worktrees used to redden lint with
  generated `.next` output).
- **NEVER round-trip source files through PowerShell 5.1 Get-Content/Set-Content** — it reads
  UTF-8 as cp1252 and writes back BOM + mojibake (corrupted the navbar 🍳 on a whole branch;
  tsc/lint/build can't catch it). Use the editor tools for file edits, always.
- **Turso migrations:** `scripts/backup-turso.mts` FIRST, then `scripts/migrate-turso.mts`
  (Prisma migrate can't speak `libsql://`). Env trap: local `.env` = prod DB, `.env.local` =
  `file:./local.db` — mind which one a script loads.
- Design/preview changes: standing OK to commit + push to `dev` once verified. Schema, auth,
  server actions, prod: ask first.
- **Design-review kill switch** (`app/lib/design-review.ts`): the whole /preview harness +
  Review-designs CTA are OFF in production always (hard-coded), and can be muted between
  review rounds by setting `DESIGN_REVIEW=0` in Vercel's Preview env scope (+ redeploy);
  remove the var (or `=1`) when sharing the dev preview for a round. Unset = visible on
  non-prod. ADD the var, never detach shared ones (see the env-edit incident below).
- **Branches pruned (2026-07-01):** only `dev`, `prod`, `feat/cooking-mode`,
  `feat/print-recipe`, and `feat/mvp-sharing-families` (UNMERGED — the monetization MVP,
  do not delete) remain. better-auth / preview-styles / recipe-user-page-variants /
  homestead-real-pages were fully merged into dev and deleted local+remote.
- Don't run `npm run dev` in foreground Bash — use the Preview MCP (`launch.json` "dev").
  Don't `rm -rf .next` while the preview server runs. A push with no Vercel build = dropped
  webhook → empty commit or Redeploy.
- Parallel `designer` agents race in shared registries (`styles.tsx`) — reconcile centrally after.
- Pricing (decided, goodwill band): Individual ~$11.99/yr, Family ~$24.99/yr (the hero — admin
  pays, members free), Lifetime ~$59–79. PPP later via ~3–5 store bands, not hand-set prices.

## Dead ends / don't redo
- Per-page design variants (Editorial Spread, Split Portrait, etc.) → **deleted** when the
  harness pivoted to STYLES → pages (2026-06-30). Don't resurrect per-page pickers.
- Family price $54.99 → rejected as anchored to AI-heavy comps; honest comp is AnyList household
  $14.99/yr.
- Free-tier AI → cut (premium-only when it lands).
- Recipe caps 150 and 20 → both wrong; 30 counting AUTHORED only was the lever.
- Vercel env edits: detaching a shared var removed Production's DB vars once — sensitive vars
  read back EMPTY via `vercel env pull`; re-add from `.env`, never from a pull-backup.

## Doc map
`CLAUDE.md` (conventions + design frontier + automation) · `AGENTS.md` (vendored-Next warning) ·
this file (state) · `.claude/workflows/` (`design-variants`, `build-verified`) · decision ledger +
full history in Claude project memory (`working-style-orchestrator`, `decision-ledger`,
`project-recipes-app`, `better-auth-migration`).
