# PROJECT — Tetris

_Stable product baseline: what this is, phases, decisions. Update only when
direction changes; live state belongs in STATUS.md._

## What this is

A single-file Tetris implementation with full SRS rotation + wall kicks,
T-spin detection (full & mini), 7-bag randomizer, lock delay, DAS/ARR,
combos/back-to-back scoring, procedural Web Audio sound, and desktop + mobile
touch layouts. The shareable artifact is `tetris.html`, a byte-identical copy
of `index.html`. A live copy ships on jnikolaidis.com from the site repo.

## Stack

- HTML5 Canvas, vanilla ES6 JavaScript, Web Audio API, localStorage — all
  inline in one file; no build system, no dependencies

## Phases

- Single-phase project: built, stable, occasional refinement.

## Decisions

- 2026-09-19 — This repo runs under the SuperExecutor agent contract
  (AGENTS.md); durable memory lives in the five canonical documents.
- Single-file portability over testability: the extracted `tetris-core.js` +
  tests were deliberately removed; verification is by hand.
- The live public copy is deployed from the `jnikolaidis.com` repo, never
  from here.
