export const meta = {
  name: 'build-verified',
  description: 'Build independent chunks in parallel, adversarially verify each with the verifier agent, fix confirmed findings',
  whenToUse: 'For substantive autonomous build phases (per the /unattended standard). Pass chunks that own DISTINCT files (no overlaps); each is built, attacked through two verifier lenses, and fixed. This workflow never commits — green-gate + commit on the main thread afterward.',
  phases: [
    { title: 'Build', detail: 'one builder agent per chunk' },
    { title: 'Verify', detail: 'two adversarial verifier lenses per chunk' },
    { title: 'Fix', detail: 'one fix agent per chunk with confirmed findings' },
  ],
}

// args: {
//   repo: 'D:\\Code\\trade-app',          // ABSOLUTE path — subagents don't inherit cwd
//   context: 'shared facts every agent needs: spec doc paths, conventions, hard rules',
//   chunks: [{ label: 'poller', brief: 'what to build + acceptance criteria', files: 'files this chunk owns' }],
// }

const repo = args && args.repo
const context = (args && args.context) || ''
const chunks = (args && args.chunks) || []
if (!repo || !chunks.length) {
  log('Need args: { repo, context?, chunks: [{ label, brief, files? }] } — nothing to do.')
  return { chunks: [] }
}

const FINDINGS = {
  type: 'object',
  required: ['verdict', 'findings'],
  properties: {
    verdict: { enum: ['pass', 'issues'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'summary', 'evidence'],
        properties: {
          severity: { enum: ['high', 'medium', 'low'] },
          summary: { type: 'string' },
          evidence: { type: 'string', description: 'file:line plus repro/proof' },
          fix: { type: 'string', description: 'suggested fix direction' },
        },
      },
    },
    verified: { type: 'array', items: { type: 'string' }, description: 'claims re-checked that held' },
    notChecked: { type: 'array', items: { type: 'string' }, description: 'what could not be verified and why' },
  },
}

const LENSES = [
  { key: 'correctness', focus: 'correctness vs the spec, edge cases and boundaries, integration seams' },
  { key: 'honesty', focus: 'test honesty (would the tests catch a wrong implementation?), unverified claims in the builder report, security basics' },
]

const results = await pipeline(
  chunks,
  (chunk) =>
    agent(
      `Repo: ${repo} — use ABSOLUTE paths; you do NOT inherit this cwd.\n` +
        (context ? `Shared context: ${context}\n` : '') +
        `\nBuild this chunk: ${chunk.brief}\n` +
        (chunk.files ? `You own ONLY these files (others are owned by parallel agents — do not touch them): ${chunk.files}\n` : '') +
        `Write tests that would catch a wrong implementation, run them, and return raw data: ` +
        `files touched, what you verified by actually running it, and any claims you could NOT verify.`,
      { label: `build:${chunk.label}`, phase: 'Build' }
    ),
  (buildReport, chunk) => {
    if (!buildReport) {
      log(`build:${chunk.label} returned nothing — chunk dropped, rebuild it on the main thread`)
      throw new Error('builder died')
    }
    return parallel(
      LENSES.map((lens) => () =>
        agent(
          `Repo: ${repo} — use ABSOLUTE paths.\n` +
            (context ? `Shared context: ${context}\n` : '') +
            `\nA builder claims this chunk is done. Chunk spec: ${chunk.brief}\n` +
            (chunk.files ? `Chunk files: ${chunk.files}\n` : '') +
            `Builder's report:\n${buildReport}\n\n` +
            `Attack it through the ${lens.key} lens: ${lens.focus}. Reproduce failures where possible.`,
          { label: `verify:${chunk.label}:${lens.key}`, phase: 'Verify', agentType: 'verifier', schema: FINDINGS }
        )
      )
    ).then((verdicts) => ({ buildReport, verdicts: verdicts.filter(Boolean) }))
  },
  async (v, chunk) => {
    const all = v.verdicts.flatMap((x) => x.findings)
    const confirmed = all.filter((f) => f.severity !== 'low')
    const lows = all.filter((f) => f.severity === 'low')
    let fixReport = null
    if (confirmed.length) {
      fixReport = await agent(
        `Repo: ${repo} — use ABSOLUTE paths.\n` +
          (context ? `Shared context: ${context}\n` : '') +
          `\nFix these confirmed findings in the "${chunk.label}" chunk (spec: ${chunk.brief}):\n` +
          confirmed
            .map((f) => `- [${f.severity}] ${f.summary} — ${f.evidence}${f.fix ? ` (suggested: ${f.fix})` : ''}`)
            .join('\n') +
          `\nAdd or adjust tests so each fixed bug would be caught by the suite. Run the tests. Report what you changed.`,
        { label: `fix:${chunk.label}`, phase: 'Fix' }
      )
    }
    return {
      label: chunk.label,
      buildReport: v.buildReport,
      confirmedFindings: confirmed,
      deferredLows: lows,
      fixReport,
      verifiedClaims: v.verdicts.flatMap((x) => x.verified || []),
      notChecked: v.verdicts.flatMap((x) => x.notChecked || []),
    }
  }
)

const out = results.filter(Boolean)
const dropped = chunks.length - out.length
log(
  `${out.length}/${chunks.length} chunks through build+verify` +
    (dropped ? ` (${dropped} dropped — rebuild on main thread)` : '') +
    `. Now green-gate (typecheck/test/lint/build) + commit on the MAIN thread.`
)
return { chunks: out }
