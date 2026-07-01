export const meta = {
  name: 'design-variants',
  description: 'Generate design explorations in parallel using designer agents (mock data only, shared registry untouched)',
  whenToUse: 'When you want to explore several distinct design directions at once in the styles → pages preview harness — a whole new STYLE (a full design language, all 5 pages) or alternate page treatments within a style. Opt-in: the user must ask to run it.',
  phases: [
    { title: 'Design', detail: 'one designer agent per brief, mock data only', model: 'opus' },
  ],
}

// args: { briefs: [{ label, brief }] }
// A brief can be a whole style or a single unit. Examples:
//   { briefs: [
//     { label: 'hearth',           brief: 'New STYLE "Hearth": rustic tavern warmth — implement all 5 pages (Recipe, Profile, Family, Form, Settings) under styles/hearth/ with a shared _kit.tsx' },
//     { label: 'homestead-family', brief: 'Alternate Family page treatment for the Homestead style' },
//   ] }
const briefs = (args && args.briefs) || []

if (!briefs.length) {
  log('No briefs passed in args.briefs — nothing to do. Pass { briefs: [{ label, brief }] }.')
  return { variants: [] }
}

log(`Generating ${briefs.length} design exploration(s)`)

const results = await parallel(
  briefs.map((b) => () =>
    agent(
      `You are designing for the preview harness at /preview/[style]/[page] (see CLAUDE.md "Design exploration"). Brief: "${b.brief}".\n` +
        `Create NEW self-contained components under app/components/design-variants/ (style work goes in styles/<style>/), ` +
        `driven by the shipped Amber token system (app/globals.css CSS vars) and the shared mock data in mock-data.ts. ` +
        `Differentiate on layout/type/structure/motion, not palette. ` +
        `Do NOT edit shared registries (styles.tsx, styles-meta.ts) or create routes — the orchestrator registers keepers afterward to avoid parallel conflicts. ` +
        `Run npx tsc --noEmit, then return your structured summary.`,
      { label: `design:${b.label}`, phase: 'Design', agentType: 'designer' }
    ).then((design) => ({ label: b.label, brief: b.brief, design }))
  )
)

const variants = results.filter(Boolean)
log(`${variants.length} exploration(s) generated. Review them, then register the keepers in styles.tsx / styles-meta.ts centrally.`)
return { variants }
