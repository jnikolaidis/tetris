'use strict';
/* ============================================
   tetris-core.js — Pure game-logic for Tetris.
   No DOM, no globals of its own beyond the constants/tables.
   Loaded by index.html (game) and tests.html (unit tests).
   ============================================ */

/* ----- Board dimensions ----- */
const COLS = 10;
const ROWS = 24;            // 4 hidden + 20 visible
const VISIBLE_ROWS = 20;
const HIDDEN_ROWS = 4;

/* ----- Timing (ms) ----- */
const LOCK_DELAY = 500;
const MAX_LOCK_RESETS = 15;
const DAS_DELAY = 167;
const ARR_INTERVAL = 33;
const LINE_CLEAR_TIME = 300;

/* ============================================
   TETROMINO DEFINITIONS
   ============================================ */
// Piece type index: I=1, O=2, T=3, S=4, Z=5, J=6, L=7
const PIECE_NAMES = ['', 'I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Rotation states for each piece (4 states each) — standard SRS.
const SHAPES = {
  1: [ // I
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  2: [ // O
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ],
  3: [ // T
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ],
  4: [ // S
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ],
  5: [ // Z
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ],
  6: [ // J
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ],
  7: [ // L
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ],
};

// SRS Wall Kick Data. Offsets: [dx, dy] where +x=right, +y=down (board coords).
const KICKS_JLSTZ = {
  '0>1': [[ 0, 0],[-1, 0],[-1,-1],[ 0, 2],[-1, 2]],
  '1>0': [[ 0, 0],[ 1, 0],[ 1, 1],[ 0,-2],[ 1,-2]],
  '1>2': [[ 0, 0],[ 1, 0],[ 1, 1],[ 0,-2],[ 1,-2]],
  '2>1': [[ 0, 0],[-1, 0],[-1,-1],[ 0, 2],[-1, 2]],
  '2>3': [[ 0, 0],[ 1, 0],[ 1,-1],[ 0, 2],[ 1, 2]],
  '3>2': [[ 0, 0],[-1, 0],[-1, 1],[ 0,-2],[-1,-2]],
  '3>0': [[ 0, 0],[-1, 0],[-1, 1],[ 0,-2],[-1,-2]],
  '0>3': [[ 0, 0],[ 1, 0],[ 1,-1],[ 0, 2],[ 1, 2]],
};

const KICKS_I = {
  '0>1': [[ 0, 0],[-2, 0],[ 1, 0],[-2, 1],[ 1,-2]],
  '1>0': [[ 0, 0],[ 2, 0],[-1, 0],[ 2,-1],[-1, 2]],
  '1>2': [[ 0, 0],[-1, 0],[ 2, 0],[-1,-2],[ 2, 1]],
  '2>1': [[ 0, 0],[ 1, 0],[-2, 0],[ 1, 2],[-2,-1]],
  '2>3': [[ 0, 0],[ 2, 0],[-1, 0],[ 2,-1],[-1, 2]],
  '3>2': [[ 0, 0],[-2, 0],[ 1, 0],[-2, 1],[ 1,-2]],
  '3>0': [[ 0, 0],[ 1, 0],[-2, 0],[ 1, 2],[-2,-1]],
  '0>3': [[ 0, 0],[-1, 0],[ 2, 0],[-1,-2],[ 2, 1]],
};

/* ----- Piece helpers ----- */
function getShape(type, rot) {
  return SHAPES[type][rot];
}

// Spawn positions (col offset for top-left of bounding box)
function spawnX(type) {
  return type === 1 ? 3 : type === 2 ? 4 : 3;
}
function spawnY(type) {
  return type === 1 ? 0 : 2; // I starts higher due to 4x4 box
}

/* ============================================
   7-BAG RANDOM GENERATOR
   ============================================ */
function shuffledBag() {
  const bag = [1, 2, 3, 4, 5, 6, 7];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

/* ============================================
   GRAVITY
   ============================================ */
// Per-level gravity multiplier (Tetris Guideline formula).
function gravityFactor(level) {
  return Math.pow(0.8 - ((level - 1) * 0.007), level - 1);
}
// Drop interval in ms for a given level.
function dropIntervalFor(level) {
  return gravityFactor(level) * 1000;
}

/* ============================================
   BOARD HELPERS (pure — board passed explicitly)
   ============================================ */
function makeBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function isValidOn(board, type, rot, px, py) {
  const shape = getShape(type, rot);
  const size = shape.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!shape[r][c]) continue;
      const bx = px + c;
      const by = py + r;
      if (bx < 0 || bx >= COLS || by >= ROWS) return false;
      if (by < 0) continue; // above board is ok
      if (board[by][bx] !== 0) return false;
    }
  }
  return true;
}

function getFullRowsOf(board) {
  const full = [];
  for (let r = HIDDEN_ROWS; r < ROWS; r++) {
    if (board[r].every(c => c !== 0)) full.push(r);
  }
  return full;
}

function removeRowsFrom(board, rows) {
  for (const r of [...rows].sort((a, b) => a - b)) {
    board.splice(r, 1);
    board.unshift(new Array(COLS).fill(0));
  }
}

/* ============================================
   T-SPIN DETECTION (pure)
   piece: {type, rot, x, y}; lastMove: 'move' | 'rotate' | null
   ============================================ */
function detectTSpin(piece, board, lastMove) {
  if (!piece || piece.type !== 3) return { tspin: false, mini: false };
  if (lastMove !== 'rotate') return { tspin: false, mini: false };

  const cx = piece.x + 1;
  const cy = piece.y + 1;
  const cornerFilled = (bx, by) =>
    bx < 0 || bx >= COLS || by < 0 || by >= ROWS || board[by][bx] !== 0;

  const corners = [
    [cx - 1, cy - 1], [cx + 1, cy - 1],
    [cx - 1, cy + 1], [cx + 1, cy + 1],
  ];
  let filled = 0;
  for (const [bx, by] of corners) if (cornerFilled(bx, by)) filled++;
  if (filled < 3) return { tspin: false, mini: false };

  const frontCorners = {
    0: [[cx - 1, cy - 1], [cx + 1, cy - 1]], // flat side on top
    1: [[cx + 1, cy - 1], [cx + 1, cy + 1]], // flat side on right
    2: [[cx - 1, cy + 1], [cx + 1, cy + 1]], // flat side on bottom
    3: [[cx - 1, cy - 1], [cx - 1, cy + 1]], // flat side on left
  };
  let frontFilled = 0;
  for (const [bx, by] of frontCorners[piece.rot]) if (cornerFilled(bx, by)) frontFilled++;

  if (frontFilled === 2) return { tspin: true, mini: false };
  return { tspin: false, mini: true };
}

/* ============================================
   SCORING (pure)
   state: {level, backToBack, combo}
   returns: {points, backToBack, combo, difficult}
   ============================================ */
function calculateScore(state, numLines, tspin, mini) {
  const level = state.level;
  const at = (table, i) => (i < table.length ? table[i] : table[table.length - 1]);

  let base = 0;
  let difficult = false;

  if (tspin) {
    difficult = true;
    base = at([400, 800, 1200, 1600], numLines);
  } else if (mini) {
    // FIX: T-spin mini is NOT a "difficult" clear (Guideline), so it neither
    // grants nor consumes back-to-back. Last entry non-zero so a (very rare)
    // mini-triple doesn't silently score nothing.
    difficult = false;
    base = at([100, 200, 400, 400], numLines);
  } else {
    base = at([0, 100, 300, 500, 800], numLines);
    difficult = numLines === 4;
  }

  let pts = base * level;
  let backToBack = state.backToBack;
  let combo = state.combo;

  if (numLines > 0) {
    // B2B ×1.5 applies only to difficult LINE CLEARS. A 0-line T-spin is not
    // a line clear, so it scores flat base×level (but still maintains B2B below).
    if (difficult && backToBack) {
      pts = Math.floor(pts * 1.5);
    }
    backToBack = difficult;
    combo += 1;
    pts += 50 * combo * level;
  } else {
    combo = -1;
    // FIX: a 0-line T-spin is difficult and maintains the back-to-back chain.
    if (tspin) backToBack = true;
  }

  return { points: pts, backToBack, combo, difficult };
}
