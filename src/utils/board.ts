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

// ============ 10 ABSTRACT LAYOUT PATTERNS ============
// Each is [x, y] grid positions for the base layer (z=0)

// Pattern 0: Cross / Plus
const P_CROSS: number[][] = [
  [3,0],[4,0],
  [3,1],[4,1],
  [3,2],[4,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
  [3,5],[4,5],
  [3,6],[4,6],
  [3,7],[4,7],
];

// Pattern 1: Diamond
const P_DIAMOND: number[][] = [
  [3,0],[4,0],
  [2,1],[3,1],[4,1],[5,1],
  [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
  [2,5],[3,5],[4,5],[5,5],
  [3,6],[4,6],
];

// Pattern 2: T-Shape
const P_TSHAPE: number[][] = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
  [3,2],[4,2],
  [3,3],[4,3],
  [2,4],[3,4],[4,4],[5,4],
  [2,5],[3,5],[4,5],[5,5],
];

// Pattern 3: Butterfly / Hourglass
const P_BUTTERFLY: number[][] = [
  [0,0],[1,0],[2,0],[5,0],[6,0],[7,0],
  [1,1],[2,1],[5,1],[6,1],
  [2,2],[3,2],[4,2],[5,2],
  [3,3],[4,3],
  [2,4],[3,4],[4,4],[5,4],
  [1,5],[2,5],[5,5],[6,5],
  [0,6],[1,6],[2,6],[5,6],[6,6],[7,6],
];

// Pattern 4: Castle / Fortress
const P_CASTLE: number[][] = [
  [0,0],[1,0],[3,0],[4,0],[6,0],[7,0],
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
  [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
  [2,3],[3,3],[4,3],[5,3],
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
  [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],
];

// Pattern 5: Arrow Up
const P_ARROW: number[][] = [
  [3,0],[4,0],
  [2,1],[3,1],[4,1],[5,1],
  [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [3,4],[4,4],
  [3,5],[4,5],
  [3,6],[4,6],
  [3,7],[4,7],
];

// Pattern 6: H-Shape
const P_HSHAPE: number[][] = [
  [0,0],[1,0],[6,0],[7,0],
  [0,1],[1,1],[6,1],[7,1],
  [0,2],[1,2],[6,2],[7,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
  [0,5],[1,5],[6,5],[7,5],
  [0,6],[1,6],[6,6],[7,6],
  [0,7],[1,7],[6,7],[7,7],
];

// Pattern 7: Spiral / S-Shape
const P_SPIRAL: number[][] = [
  [2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [1,1],[2,1],
  [0,2],[1,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],
  [5,4],[6,4],
  [6,5],[7,5],
  [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
  [0,7],[1,7],
];

// Pattern 8: Frame / Ring
const P_FRAME: number[][] = [
  [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
  [0,1],[1,1],[6,1],[7,1],
  [0,2],[1,2],[6,2],[7,2],
  [0,3],[1,3],[6,3],[7,3],
  [0,4],[1,4],[6,4],[7,4],
  [0,5],[1,5],[6,5],[7,5],
  [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
];

// Pattern 9: Lightning Bolt
const P_LIGHTNING: number[][] = [
  [4,0],[5,0],[6,0],[7,0],
  [3,1],[4,1],[5,1],
  [2,2],[3,2],[4,2],
  [1,3],[2,3],[3,3],[4,3],[5,3],
  [3,4],[4,4],[5,4],
  [2,5],[3,5],[4,5],
  [0,6],[1,6],[2,6],[3,6],
];

const ALL_PATTERNS: number[][][] = [
  P_CROSS, P_DIAMOND, P_TSHAPE, P_BUTTERFLY, P_CASTLE,
  P_ARROW, P_HSHAPE, P_SPIRAL, P_FRAME, P_LIGHTNING,
];

export function generateLayout(level: number) {
  const layout: number[][] = [];

  // Pick pattern: cycles through all 10 patterns
  const patternIndex = (level - 1) % ALL_PATTERNS.length;
  const basePattern = ALL_PATTERNS[patternIndex];

  // Layers increase with level: 1 layer for levels 1-10, 2 for 11-30, 3 for 31+
  const layers = level <= 10 ? 1 : level <= 30 ? 2 : 3;

  for (let z = 0; z < layers; z++) {
    const shrink = z; // Upper layers are smaller

    for (const [px, py] of basePattern) {
      if (z > 0) {
        // For upper layers, only keep tiles near center
        const centerX = 3.5;
        const centerY = 3.5;
        const maxDist = Math.max(3 - shrink, 1.5);
        if (Math.abs(px - centerX) > maxDist || Math.abs(py - centerY) > maxDist) continue;
      }

      const offsetZ = z * 0.5;
      layout.push([(px + offsetZ) * 2, (py + offsetZ) * 2, z]);
    }
  }

  // Ensure even number of tiles
  if (layout.length % 2 !== 0) layout.pop();
  return layout;
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
  const variety = Math.min(10 + level, CHARACTERS.length);
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

  const activeTiles = board.filter(t =>
    t.state !== 'matched' &&
    t.id !== tile.id
  );

  const hasTopBlocker = activeTiles.some(t =>
    t.z > tile.z &&
    Math.abs(t.x - tile.x) < 2 &&
    Math.abs(t.y - tile.y) < 2
  );

  return !hasTopBlocker;
}
