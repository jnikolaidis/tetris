# Tetris

Single-file Tetris implementation with SRS rotation, T-spin detection, scoring, and Web Audio sound effects.

## Stack
- HTML5, Vanilla JavaScript (ES6)
- Canvas 2D rendering
- Web Audio API (procedural sound synthesis)
- localStorage (high score)

## Commands
No build system. Open `index.html` in a browser.

## Gotchas
- Entire game (~45KB) is one `index.html` file with ~1600 lines of inline JS
- Sound effects synthesized procedurally via Web Audio (no audio files)
- Full SRS with wall kicks and T-spin detection
- 7-bag randomizer for piece distribution
- Canvas scales dynamically to window while maintaining aspect ratio
