@AGENTS.md

# Working notes

Lean by design: lean on Claude's built-ins instead of reimplementing them. Use the `Plan` agent / plan mode for architecture, the `Explore` agent for codebase recon, `/code-review` for review, and `/verify` for verification. Backend and frontend coding happen on the main thread.

The `designer` agent and `frontend-design` skill are installed **globally** (`~/.claude/`), so the same design intelligence is available in every project — they're project-agnostic by design. This file carries the repo-specific facts they need (below).

## Project conventions (the *why* is in code comments)

- `authorId` always comes from the session, never the form (anti-spoofing). Ownership checked on every edit/delete.
- Ingredients/steps are JSON-in-TEXT, (de)serialized only inside `app/lib/*-repository.ts`; the rest of the app sees `string[]`.
- SQLite/libSQL has no enums/arrays — visibility and member role are TEXT.
- Per AGENTS.md: this is a modified Next.js — read `node_modules/next/dist/docs/` before using framework APIs.

## Design exploration (active frontier)

Visual variants live in `app/components/design-variants/`, previewed at `/preview/discover`.

- Each variant is a `({ isDark?, theme }: { isDark?: boolean; theme: Theme }) => JSX` component, fully driven by theme tokens (`theme.ts`) — color comes from the picker, so differentiate variants on **layout, type, structure, and motion**, not hardcoded palettes.
- Shared mock recipe data: `app/components/design-variants/mock-recipes.ts`. Never import the real data layer (`app/lib/**`, `prisma/**`) into a variant.
- Register a new variant in `app/preview/discover/page.tsx` and it appears in `VersionPicker` automatically.
- Use the global `frontend-design` skill for aesthetic direction, and the global `designer` agent when you want this work isolated/parallelized.
- To see changes, start a local preview via the Claude Preview MCP (it manages its own process — don't run `npm run dev` in the foreground Bash tool, which blocks it). The deployed dev preview is `https://family-recipe-git-dev-nfs-projects-adbffaf9.vercel.app/preview/discover` (latest pushed `dev`).
- For generating several variants at once: the `design-variants` workflow (opt-in) fans out parallel `designer` agents.
