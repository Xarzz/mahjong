export interface TileData {
  id: string;
  char: string;
  x: number;
  y: number;
  z: number;
  state: 'idle' | 'selected' | 'matched' | 'wrong';
}

export interface GameTheme {
  name: string;
  bg: string;
  panel: string;
  primary: string;
  tileBg: string;
  primaryGlow: string;
}

export const THEMES: GameTheme[] = [
  { name: 'Deep Forest', bg: '#064e3b', panel: 'rgba(6, 78, 59, 0.7)', primary: '#10b981', tileBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', primaryGlow: 'rgba(16, 185, 129, 0.5)' },
  { name: 'Sakura Garden', bg: '#831843', panel: 'rgba(131, 24, 67, 0.7)', primary: '#f472b6', tileBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', primaryGlow: 'rgba(244, 114, 182, 0.5)' },
  { name: 'Neo Tokyo', bg: '#1e1b4b', panel: 'rgba(30, 27, 75, 0.7)', primary: '#818cf8', tileBg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', primaryGlow: 'rgba(129, 140, 248, 0.5)' },
  { name: 'Volcano Peak', bg: '#450a0a', panel: 'rgba(69, 10, 10, 0.7)', primary: '#ef4444', tileBg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', primaryGlow: 'rgba(239, 68, 68, 0.5)' },
  { name: 'Abyssal Ocean', bg: '#0c4a6e', panel: 'rgba(12, 74, 110, 0.7)', primary: '#0ea5e9', tileBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', primaryGlow: 'rgba(14, 165, 233, 0.5)' },
  { name: 'Golden Temple', bg: '#78350f', panel: 'rgba(120, 53, 15, 0.7)', primary: '#f59e0b', tileBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', primaryGlow: 'rgba(245, 158, 11, 0.5)' },
  { name: 'Jade Palace', bg: '#064e3b', panel: 'rgba(6, 78, 59, 0.7)', primary: '#34d399', tileBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', primaryGlow: 'rgba(52, 211, 153, 0.5)' },
  { name: 'Midnight Storm', bg: '#1e1b4b', panel: 'rgba(30, 27, 75, 0.7)', primary: '#a78bfa', tileBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', primaryGlow: 'rgba(167, 139, 250, 0.5)' },
  { name: 'Dragon Fire', bg: '#7c2d12', panel: 'rgba(124, 45, 18, 0.7)', primary: '#fb923c', tileBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', primaryGlow: 'rgba(251, 146, 60, 0.5)' },
  { name: 'Zen Garden', bg: '#1c1917', panel: 'rgba(28, 25, 23, 0.7)', primary: '#a8a29e', tileBg: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', primaryGlow: 'rgba(168, 162, 158, 0.5)' },
];

export function getTheme(level: number): GameTheme {
  const index = Math.floor((level - 1) / 10) % THEMES.length;
  return THEMES[index];
}

// ===================================================================
// ABSTRACT FLAT LAYOUT PATTERNS — ALL z=0, no stacking
// Each [col, row] pair becomes position [col*2, row*2, 0] in game space.
// Tiles are spaced out with visible gaps between them.
// ===================================================================

const PATTERNS: number[][][] = [
  // 0: Scattered diamond (12 tiles)
  [
    [3,0],[4,0],
    [2,1],[5,1],
    [1,2],[6,2],
    [2,3],[5,3],
    [3,4],[4,4],
    [1,4],[6,4],
  ],
  // 1: Small cross (14 tiles)
  [
    [3,0],[4,0],
    [3,1],[4,1],
    [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
    [3,3],[4,3],
    [3,4],[4,4],
  ],
  // 2: Two wings (14 tiles)
  [
    [0,0],[1,0],[5,0],[6,0],
    [0,1],[6,1],
    [1,2],[5,2],
    [0,3],[6,3],
    [0,4],[1,4],[5,4],[6,4],
  ],
  // 3: Zigzag (12 tiles)
  [
    [0,0],[1,0],
    [2,1],[3,1],
    [4,2],[5,2],
    [2,3],[3,3],
    [0,4],[1,4],
    [2,5],[3,5],
  ],
  // 4: Flower petals (12 tiles)
  [
    [3,0],[4,0],
    [1,1],[6,1],
    [0,2],[3,2],[4,2],[7,2],
    [1,3],[6,3],
    [3,4],[4,4],
  ],
  // 5: Open diamond (24 tiles)
  [
    [3,0],[4,0],
    [2,1],[3,1],[4,1],[5,1],
    [1,2],[2,2],[5,2],[6,2],
    [0,3],[1,3],[6,3],[7,3],
    [1,4],[2,4],[5,4],[6,4],
    [2,5],[3,5],[4,5],[5,5],
    [3,6],[4,6],
  ],
  // 6: H-shape (22 tiles)
  [
    [0,0],[1,0],[6,0],[7,0],
    [0,1],[1,1],[6,1],[7,1],
    [0,2],[1,2],[3,2],[4,2],[6,2],[7,2],
    [0,3],[1,3],[6,3],[7,3],
    [0,4],[1,4],[6,4],[7,4],
  ],
  // 7: Ring / frame (20 tiles)
  [
    [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    [0,1],[7,1],
    [0,2],[7,2],
    [0,3],[7,3],
    [0,4],[7,4],
    [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
  ],
  // 8: Arrow right (18 tiles)
  [
    [0,0],[1,0],
    [0,1],[1,1],[2,1],[3,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],
    [0,3],[1,3],[2,3],[3,3],
    [0,4],[1,4],
  ],
  // 9: Spiral steps (18 tiles)
  [
    [2,0],[3,0],[4,0],[5,0],[6,0],
    [1,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],
    [4,3],
    [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
  ],
];

/**
 * Generate a layout for the given level.
 * - Levels 1-50: use a single pattern from PATTERNS (cycles through all 10)
 * - Levels 51-100: combine two patterns side-by-side for bigger boards
 * All tiles are on z=0 — no stacking.
 */
export function generateLayout(level: number): number[][] {
  const patternIndex = (level - 1) % PATTERNS.length;
  const basePattern = PATTERNS[patternIndex];

  let positions: number[][];

  if (level <= 50) {
    // Single pattern
    positions = basePattern.map(([c, r]) => [c * 2, r * 2, 0]);
  } else {
    // Combine two patterns side by side for harder levels
    const secondIndex = (patternIndex + 5) % PATTERNS.length;
    const secondPattern = PATTERNS[secondIndex];

    // Find max column of first pattern to offset the second
    const maxCol = Math.max(...basePattern.map(p => p[0]));
    const gap = 3; // gap between the two patterns

    const left = basePattern.map(([c, r]) => [c * 2, r * 2, 0]);
    const right = secondPattern.map(([c, r]) => [(c + maxCol + gap) * 2, r * 2, 0]);

    positions = [...left, ...right];
  }

  // Ensure even number
  if (positions.length % 2 !== 0) positions.pop();
  return positions;
}

const CHARACTERS = [
  'あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ',
  'た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ',
  '日','月','火','水','木','金','土','山','川','空','花','鳥','風','心','海',
  '一','二','三','四','五','六','七','八','九','十','人','子','女','学','生',
  '友','愛','和','力','天','地','光','暗','大','小','高','安','新','古','美',
  '木','林','森','石','田','星','雲','雨','雪','電','春','夏','秋','冬','色',
];

export function generateBoard(level: number): TileData[] {
  const layout = generateLayout(level);
  const totalTiles = layout.length;
  const numPairs = totalTiles / 2;

  let selectedChars: string[] = [];
  const variety = Math.min(8 + level, CHARACTERS.length);
  const pool = CHARACTERS.slice(0, variety);

  for (let i = 0; i < numPairs; i++) {
    const char = pool[i % pool.length];
    selectedChars.push(char, char);
  }

  // Shuffle
  for (let i = selectedChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedChars[i], selectedChars[j]] = [selectedChars[j], selectedChars[i]];
  }

  return layout.map((pos, index) => ({
    id: `tile-l${level}-${index}`,
    char: selectedChars[index],
    x: pos[0],
    y: pos[1],
    z: pos[2],
    state: 'idle'
  }));
}

export function isTileFree(tile: TileData, board: TileData[]): boolean {
  if (tile.state === 'matched') return false;
  // No stacking = all non-matched tiles are always free
  return true;
}
