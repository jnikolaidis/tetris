# Tetris

Single-file Tetris with SRS rotation + wall kicks, T-spin detection (full & mini),
7-bag randomizer, lock delay, DAS/ARR, scoring with combos and back-to-back, and
procedural Web Audio sound effects.

## Play

No build step. Just open `index.html` in a browser:

```
open index.html
```

Desktop and mobile (touch controls) are both supported.

## Controls (desktop)

| Key         | Action            |
|-------------|-------------------|
| ← →         | Move              |
| ↓           | Soft drop         |
| ↑ / X       | Rotate CW         |
| Z           | Rotate CCW        |
| Space       | Hard drop         |
| C           | Hold              |
| P / Esc     | Pause             |
| Q           | Quit to menu      |

## Tests

Open `tests.html` in a browser to run the unit tests for the core game logic
(scoring, T-spin detection, board helpers, randomizer, gravity):

```
open tests.html
```

Results are printed on the page and also exposed at `window.__testsDone`.

## Project layout

| File             | Purpose                                                        |
|------------------|----------------------------------------------------------------|
| `index.html`     | Game: markup + styles + the DOM/render/input/audio glue        |
| `tetris-core.js` | Pure game logic (constants, shapes, kicks, board, scoring)     |
| `tests.html`     | Browser-based unit tests for `tetris-core.js`                  |

## Stack

- HTML5 + Canvas 2D rendering
- Vanilla JavaScript (ES6), no framework, no build system
- Web Audio API (procedural sound synthesis, no audio files)
- `localStorage` for the high score

## Notes

- The gravity/speed formula follows the Tetris Guideline:
  `(0.8 - (level-1) * 0.007) ^ (level-1)` seconds per row.
- Scoring follows the Guideline: T-spin mini is **not** a difficult clear
  (it neither grants nor consumes back-to-back); a 0-line T-spin is difficult
  and maintains the back-to-back chain. See `tests.html` for the exact cases.
