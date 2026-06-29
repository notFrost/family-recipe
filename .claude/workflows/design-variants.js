export const meta = {
  name: 'design-variants',
  description: 'Generate N visual design variants in parallel using the designer agent (mock data only)',
  whenToUse: 'When you want to explore several distinct UI directions at once for a page/component — e.g. new Discover or RecipeCard variants. Opt-in: the user must ask to run it.',
  phases: [
    { title: 'Design', detail: 'one designer agent per brief, mock data only', model: 'opus' },
  ],
}

// args: { page: string, briefs: [{ label, brief }] }
// Example:
//   { page: '/preview/discover', briefs: [
//     { label: 'editorial', brief: 'Editorial cookbook spread, serif display, generous margins' },
//     { label: 'tactile',   brief: 'Tactile recipe-card feel, paper texture, hand-set numerals' },
//   ] }
const page = (args && args.page) || '/preview/discover'
const briefs = (args && args.briefs) || []

if (!briefs.length) {
  log('No briefs passed in args.briefs — nothing to do. Pass { page, briefs: [{label, brief}] }.')
  return { variants: [] }
}

log(`Generating ${briefs.length} variant(s) for ${page}`)

const results = await parallel(
  briefs.map((b) => () =>
    agent(
      `You are designing a visual variant for ${page}. Brief: "${b.brief}".\n` +
        `Create a NEW self-contained variant component under app/components/design-variants/ driven by theme tokens, ` +
        `using the shared mock data in mock-recipes.ts. Do NOT edit shared files (page.tsx, VersionPicker) — registration is done by the orchestrator afterward to avoid parallel conflicts. ` +
        `Differentiate on layout/type/structure/motion, not hardcoded color. Run npx tsc --noEmit, then return your structured summary.`,
      { label: `design:${b.label}`, phase: 'Design', agentType: 'designer' }
    ).then((design) => ({ label: b.label, brief: b.brief, design }))
  )
)

const variants = results.filter(Boolean)
log(`${variants.length} variant(s) generated. Review them, then register the keepers in ${page}.`)
return { variants }
