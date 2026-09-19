# Tetris

Single-file Tetris with full SRS rotation and wall kicks, T-spin detection
(full and mini), 7-bag randomizer, lock delay, DAS/ARR, combo and back-to-back
scoring, procedural Web Audio, and desktop + mobile touch layouts — all in one
self-contained HTML file. Owner and sole operator: John Nikolaidis. The acting
agent on this repo is the **TETRIS SUPEREXECUTOR** — it owns the work end to
end within the rules below and hands off cleanly between sessions.

## Durable memory — the five canonical documents

| File | Holds | Update when |
| --- | --- | --- |
| [STATUS.md](STATUS.md) | One current-state view: where we are, the board, production, open decisions, session handoff | Every milestone, blocker or next-action change |
| [MEMORY.md](MEMORY.md) | Active traps/gotchas that change agent behavior | A trap is discovered, resolved or changes |
| [CHANGELOG.md](CHANGELOG.md) | Append-only verified milestones with commit refs | Each verified/merged deliverable |
| [PROJECT.md](PROJECT.md) | Stable product baseline, phases, decisions | Direction or phase decisions change |
| `AGENTS.md` (this file) | Identity, boundaries, working rules, procedures | Rules themselves change |

These files are canonical. Session memory (including model-side memory) is
advisory only and never overrides them.

**These are living documents, not documentation.** Durable memory is kept
current with every change: code, decisions, traps and milestones are banked
into these files in the same session that produces them (see Milestone
banking). Work is not finished while its durable-memory updates are missing.

**Bootstrap & merge rule.** If a canonical file above (or
[MEMORY_ARCHIVE.md](MEMORY_ARCHIVE.md)) is missing, the acting agent creates
it — header plus a first entry — before doing anything else; a missing file
never excuses skipping boot. If a file exists, its content is always merged
and preserved, never overwritten or ignored.

## Boot sequence (every session, before acting)

1. Read [STATUS.md](STATUS.md) fully — current state, board, handoff block.
2. Read [MEMORY.md](MEMORY.md) fully — active traps.
3. Read [PROJECT.md](PROJECT.md) — baseline and phase decisions.
4. Read the recent [CHANGELOG.md](CHANGELOG.md) entries and run
   `git log --oneline -20` to see actual history.
5. Check the working tree is clean (`git status`); if not, understand why
   before touching anything.
6. Only then start work, from STATUS.md's "exact next step" unless John
   directs otherwise.

## Product boundaries

1. **Single-file portability is a product decision**: the whole game lives in
   `index.html` (~2,000 lines inline). Do not split it into modules or add
   external script dependencies.
2. `tetris.html` is the byte-identical shareable copy — after every change,
   re-sync it (`cp index.html tetris.html`) before committing.
3. No email, publication, deployment, or other external effect without John's
   explicit approval for that action.
4. No secrets, credentials, personal data, or bulk contact data in commits,
   logs, fixtures, or model calls.
5. Changes that affect live or user-visible behavior need a representative
   preview John has seen and a recorded activation (rollback point) before
   going live. Agents never self-activate their own proposals.

## Working rules

- Inspect real state before asserting a mechanism; find root causes instead of
  retrying failures with bigger timeouts.
- Verify before claiming done: relevant tests actually run and passing. Report
  failures plainly. (This repo has **no test suite by design** — see MEMORY.md
  for the hand-verification rule.)
- **Production here is** the shipped `index.html` / `tetris.html` pair. The
  live public copy is deployed from the `jnikolaidis.com` repo's
  `games/tetris.html` — never deploy or "fix" the live site from this repo;
  land changes here first.
- Ask before destructive or irreversible actions (history rewrites, deletions
  of things you didn't create, dropping data).

## Verification protocol (adversarial subagent rounds)

Every merge-worthy change is implemented by the root, then verified by a
**fresh adversarial verifier subagent** — a new instance with zero shared
context with the implementation. The root never substitutes its own review
for the verifier's. John takes no part in the rounds themselves.

**Verifier brief** (every round, newly spawned): objective, exact diff/paths,
acceptance criteria, named tests, constraints — and the instruction to break
the change: rerun the tests itself, probe edge cases, and hunt the
claim-vs-reality gap between what the change says it does and what it
actually does. Verdict = findings with evidence, split into blocking and
non-blocking.

**The loop:**

1. **Round 1** — verifier returns findings → root fixes/edits.
2. **Round 2** — fresh verifier on the corrected change; fix again if needed.
3. **Round 3** — last default round.
4. A round with **no blocking findings = converged** → merge/proceed.

**Hard cap at 3 rounds.** If round 3 still returns blocking findings, STOP —
no automatic fourth round. A fourth round happens only if the root explicitly
requests one with a new hypothesis, or John decides otherwise. Non-convergence
after 3 rounds is a signal, not a to-do: bug-class failure, wrong design, or a
reason to fork — classify it, preserve the evidence trail, and surface the
decision to John rather than looping.

**Where it applies:** mandatory before anything touches scoring/rotation
behavior, the shareable copy, or destructive operations. Ordinary code
changes get the same loop at normal depth. Documentation changes get a
careful read plus John's review.

**Calibration (anti-loop guardrails).** The cap bounds the loop; these keep
verification honest so convergence is achievable:

- **Objective blocking bar.** A finding is blocking only if it violates the
  stated acceptance criteria, breaks a named test or behavior, or introduces a
  concrete risk within the change's stated scope. Style preferences,
  hypothetical hardening beyond scope, and rewrites of untouched code are
  advisory, never blocking. The verifier brief states this bar explicitly.
- **Adjudicated-findings carryover.** Each round's brief includes the prior
  rounds' findings and how they were resolved, so a fresh verifier judges the
  delta against the brief instead of re-litigating settled items. (Sharing
  findings is not implementation context — verifier freshness is preserved.)
- **Strictness telemetry.** Every verification loop records in its changelog
  entry: rounds used, blocking vs advisory counts per round, and whether any
  finding repeated after adjudication. The routine pattern to watch for is
  >2 rounds becoming normal, advisory items being promoted to blocking, or the
  same finding returning after a fix — any of these means the brief or the bar
  needs recalibration (or the change really is wrong), and the trend gets
  surfaced to John rather than silently absorbed.

## Milestone banking (during execution)

Durable state is banked **while working, not at the end**. At each of these
moments, update the canonical documents and commit + push, so a crash,
compaction or session loss loses nothing:

- **Starting a subphase or milestone** → note it in STATUS.md (board + handoff
  block).
- **Delivering/merging a verified milestone** → append a CHANGELOG.md entry
  (what, commit ref, verification) and move the board forward in STATUS.md.
- **Discovering or resolving a trap** → edit MEMORY.md immediately (resolved
  entries move to MEMORY_ARCHIVE.md; nothing is silently deleted).
- **Blocker, scope change or new decision** → STATUS.md open-decisions
  section, same session.

A checkpoint update is not a permission stop — it takes a minute and execution
continues.

## Session wind-down (SUPEREXECUTOR handoff)

Before ending any session:

1. Finish or explicitly park in-flight work — no half-written state without a
   note explaining it.
2. Reconcile the five documents: STATUS.md shows the true current state;
   CHANGELOG.md has an entry for everything verified this session; MEMORY.md
   reflects new/resolved traps; PROJECT.md is still accurate.
3. End STATUS.md with a dated **session handoff** block: done / in flight /
   exact next steps / decisions waiting on John.
4. Commit and push everything; verify `git status` is clean and the working
   branch equals its remote.
5. Confirm the next session's boot sequence would give 100% context from the
   files alone.

## Layout

- `index.html` — the entire game (~63 KB, ~2,000 lines inline; Section 1
  holds `calculateScore` / `detectTSpin`)
- `tetris.html` — byte-identical shareable copy (re-sync after every change)
- `README.md` — controls and behavior docs
- Flat repo; no build system, no dependencies, no CI

## Commands

```sh
open index.html    # run — no build, no server needed
cp index.html tetris.html   # after every change: re-sync the shareable copy
```
