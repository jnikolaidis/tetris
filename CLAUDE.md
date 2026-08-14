# Tetris

Single-file Tetris implementation with SRS rotation, T-spin detection, scoring, and Web Audio sound effects.

## Stack
- HTML5, Vanilla JavaScript (ES6)
- Canvas 2D rendering
- Web Audio API (procedural sound synthesis)
- localStorage (high score)

## Commands
No build system. Open `index.html` in a browser. `tetris.html` is a shareable copy of the same file — keep the two in sync when changing the game.

## Gotchas
- Entire game (~60KB, ~2000 lines) is one self-contained HTML file (portable by design — do not split it or add external script dependencies)
- Sound effects synthesized procedurally via Web Audio (no audio files)
- Full SRS with wall kicks and T-spin detection; T-spin mini is NOT a difficult clear, and a 0-line T-spin maintains back-to-back (see `calculateScore` / `detectTSpin` in Section 1)
- 7-bag randomizer for piece distribution
- Mobile vs desktop layout is driven by the CSS media query (`pointer: coarse` / `max-width: 600px`) and re-checked on resize via `checkMobileLayout()` — treat it as the single source of truth, not JS touch heuristics
- No test suite (removed in favor of single-file portability) — verify scoring changes by hand
