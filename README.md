# Tetris

Single-file Tetris with SRS rotation + wall kicks, T-spin detection (full & mini),
7-bag randomizer, lock delay, DAS/ARR, scoring with combos and back-to-back, and
procedural Web Audio sound effects.

## Play

No build step, no dependencies. The entire game is one self-contained file —
just open `index.html` in a browser:

```
open index.html
```

You can hand this one file to anyone and they can play. Desktop and mobile
(touch controls) are both supported.

## Controls (desktop)

| Key         | Action            |
|-------------|-------------------|
| ← →         | Move              |
| ↓           | Soft drop (+1/cell) |
| ↑ / X       | Rotate CW         |
| Z           | Rotate CCW        |
| Space       | Hard drop (+2/cell) |
| C           | Hold              |
| P / Esc     | Pause             |
| Q           | Quit to menu      |

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
  and maintains the back-to-back chain.
