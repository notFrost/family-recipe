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

## Decisions waiting on Frost
- **OK to fix the familyId-leak bug?** (verifier-confirmed, PRE-EXISTING, touches server
  actions = ask-first): forged form data can attach `familyId` to a PUBLIC/PRIVATE recipe with
  no membership check, and it renders inside that family's private grid. Fix = scrub familyId
  in `parseRecipeFormData` when visibility !== FAMILY + filter `getRecipesByFamily` to
  `visibility: "FAMILY"`. Small, ready to go on your word.
- **The name + mark pick** at `/preview/branding` (peer review tonight; a rename must beat its
  switching costs — keeping "Family Recipe" with a better mark is a legitimate outcome).
  Then: real favicon/app-icon/navbar swap, deep USPTO/domain/store sweep on finalists.
- **Greenlight for feature branches** (both verifier-passed, fixes applied, pushed —
  Vercel branch previews on dev-Turso): `feat/cooking-mode` (step-by-step cook view w/
  wake-lock; fixed: scroll clip, finish-screen ←, focus restore, aria) and
  `feat/print-recipe` (printable recipe card, ink-safe from dark mode; fixed: UTF-8
  corruption BLOCKER, print-invisible step numbers). Branch previews only — no dev merge
  without OK. NOTE: both edit the recipe page's action row → merging the second will need
  a small manual reconcile.
- **OAuth redirect URIs for prod** (Google + Facebook consoles): social login on prod fails the
  callback until `https://family-recipe-nine.vercel.app/api/auth/callback/{google,facebook}` is
  registered (+ FB App Domains, Live mode, Privacy/Data-Deletion URLs). Email/pw already works.
- **Merge decision** on `feat/mvp-sharing-families` (needs dev-Turso migration first).

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
