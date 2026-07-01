@AGENTS.md

# Working notes

**Read `HANDOFF.md` first** for current state, the waiting-on-Frost list, and dead ends.

Lean by design: lean on Claude's built-ins instead of reimplementing them. Use the `Plan` agent / plan mode for architecture, the `Explore` agent for codebase recon, `/code-review` for review, and `/verify` for verification. Backend and frontend coding happen on the main thread.

The `designer` agent and `frontend-design` skill are installed **globally** (`~/.claude/`), so the same design intelligence is available in every project — they're project-agnostic by design. This file carries the repo-specific facts they need (below).

## Project conventions (the *why* is in code comments)

- `authorId` always comes from the session, never the form (anti-spoofing). Ownership checked on every edit/delete.
- Ingredients/steps are JSON-in-TEXT, (de)serialized only inside `app/lib/*-repository.ts`; the rest of the app sees `string[]`.
- SQLite/libSQL has no enums/arrays — visibility and member role are TEXT.
- Per AGENTS.md: this is a modified Next.js — read `node_modules/next/dist/docs/` before using framework APIs.

## Design exploration (active frontier)

The preview harness is **STYLES → pages** (an app commits to ONE visual language): each style is a
complete design language implementing EVERY page (Recipe, Profile, Family, New-recipe form, Settings).
Route `/preview/[style]/[page]`, entry `/preview`. Current styles: **Homestead / Atelier / Keepsake**
— Frost's pick is pending; the winner gets wired into the REAL pages.

- Registry: `app/components/design-variants/styles.tsx` + `styles-meta.ts`; page shells live under
  `app/components/design-variants/styles/<style>/`. `app/preview/layout.tsx` wraps every page in the
  real Navbar/Footer/DoodleField chrome.
- Everything runs on the shipped Amber token system (`app/globals.css` shadcn CSS vars) — differentiate
  styles on **layout, type, structure, and motion**, not palette.
- Shared mock data: `app/components/design-variants/mock-data.ts`. Never import the real data layer
  (`app/lib/**`, `prisma/**`) into a variant.
- Parallel `designer` agents race in the shared registry (`styles.tsx`) and create temp routes — tell
  them not to touch it and reconcile centrally afterward (the `design-variants` workflow does this).
- Use the global `frontend-design` skill for aesthetic direction, and the global `designer` agent when
  you want this work isolated/parallelized.
- Preview via the Claude Preview MCP (don't run `npm run dev` in foreground Bash — it blocks the shell).
  Deployed preview (latest `dev`): `https://family-recipe-git-dev-nfs-projects-adbffaf9.vercel.app/preview`.
- Standing OK: verified design/preview changes auto-commit + push to `dev`. Schema/auth/prod = ask first.

## Automation

- Workflows (`.claude/workflows/`, opt-in): `design-variants` (parallel designer agents),
  `build-verified` (autonomous build + adversarial `verifier` review + fixes; never commits — green-gate
  and commit on the main thread).
- Unsupervised runs follow the global `/unattended` standard; wind down with `/handoff`.
- Ask-first here: prod merges/deploys, Turso migrations (dev AND prod — always `scripts/backup-turso.mts`
  before `scripts/migrate-turso.mts`), auth, pricing. Design→dev is the standing exception above.
- Current state + waiting-on-Frost list: `HANDOFF.md`.
