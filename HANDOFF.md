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
- **Active frontier:** pick a global STYLE at `/preview` — **Homestead / Atelier / Keepsake**
  (each implements Recipe, Profile, Family, New-recipe form, Settings) — then wire the winner
  into the REAL pages. Preview (latest `dev`):
  `https://family-recipe-git-dev-nfs-projects-adbffaf9.vercel.app/preview`
- **Unmerged branch `feat/mvp-sharing-families`** (monetization MVP): tokenized share links
  (`/r/[token]`), save-a-copy lineage (`parentRecipeId`), favorites, family invites, plan gates
  (30 AUTHORED recipes free — shared/family never count; family members 5 free / 50 premium by
  the OWNER's plan). No payment processor, no AI (hard line: no recurring cost before recurring
  income). Its migration still needs applying to dev-Turso before its preview works.

## Decisions waiting on Frost
- **The style pick** (Homestead / Atelier / Keepsake) → then wire into real pages.
- **OAuth redirect URIs for prod** (Google + Facebook consoles): social login on prod fails the
  callback until `https://family-recipe-nine.vercel.app/api/auth/callback/{google,facebook}` is
  registered (+ FB App Domains, Live mode, Privacy/Data-Deletion URLs). Email/pw already works.
- **Merge decision** on `feat/mvp-sharing-families` (needs dev-Turso migration first).

## Conventions / gotchas
- `authorId` comes from the session, never the form; ownership checked on every edit/delete.
- Ingredients/steps are JSON-in-TEXT, (de)serialized only inside `app/lib/*-repository.ts`.
- SQLite/libSQL has no enums/arrays → TEXT. Modified Next.js — read `node_modules/next/dist/docs/`
  before framework APIs (AGENTS.md).
- **Turso migrations:** `scripts/backup-turso.mts` FIRST, then `scripts/migrate-turso.mts`
  (Prisma migrate can't speak `libsql://`). Env trap: local `.env` = prod DB, `.env.local` =
  `file:./local.db` — mind which one a script loads.
- Design/preview changes: standing OK to commit + push to `dev` once verified. Schema, auth,
  server actions, prod: ask first.
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
