# MEMORY — Tetris

_Active traps and gotchas that change agent behavior. When a trap is resolved,
move its entry to MEMORY_ARCHIVE.md — nothing is silently deleted.
Carried over from the previous CLAUDE.md contract (2026-09-19)._

## Active traps

- `tetris.html` is a byte-identical shareable copy of `index.html`. After
  changing the game, re-sync it: `cp index.html tetris.html`.
- Entire game (~60 KB, ~2,000 lines) is one self-contained HTML file —
  portable by design; do not split it or add external script dependencies.
- Sound effects are synthesized procedurally via Web Audio (no audio files).
- **Scoring rules that must not regress** (see `calculateScore` /
  `detectTSpin` in Section 1): full SRS with wall kicks and T-spin detection;
  T-spin mini is NOT a difficult clear; a 0-line T-spin maintains back-to-back.
- 7-bag randomizer for piece distribution.
- Mobile vs desktop layout is driven by the CSS media query
  (`pointer: coarse` / `max-width: 600px`) and re-checked on resize via
  `checkMobileLayout()` — treat it as the single source of truth, not JS
  touch heuristics.
- **No test suite** (removed in favor of single-file portability) — verify
  scoring changes by hand before claiming done.
- High score persists in `localStorage`.
