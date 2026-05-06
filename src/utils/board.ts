export interface TileData {
  id: string;
  char: string;
  x: number;
  y: number;
  z: number;
  state: 'idle' | 'selected' | 'matched';
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
];

export function getTheme(level: number): GameTheme {
  const index = Math.floor((level - 1) / 10) % THEMES.length;
  return THEMES[index];
}

export function generateLayout(level: number) {
  const layout: number[][] = [];
  // Grid size grows from 4x4 up to 10x10
  const sizeMultiplier = Math.floor((level - 1) / 10);
  const baseSize = Math.min(4 + sizeMultiplier, 10);
  // Layers grow from 2 to 6
  const layers = Math.min(2 + Math.floor((level - 1) / 20), 6);

  for (let z = 0; z < layers; z++) {
    const currentSize = baseSize - z;
    if (currentSize <= 0) break;
    
    const offset = z * 0.5; // Offset by half a unit for pyramid look
    
    for (let x = 0; x < currentSize; x++) {
      for (let y = 0; y < currentSize; y++) {
        layout.push([(x + offset) * 2, (y + offset) * 2, z]);
      }
    }
  }

  // Ensure even count
  if (layout.length % 2 !== 0) layout.pop();
  return layout;
}

const CHARACTERS = [
  'あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ',
  '日','月','火','水','木','金','土','山','川','空','花','鳥','風','心','海',
  '一','二','三','四','五','六','七','八','九','十','人','子','女','学','生',
  '友','愛','和','力','気','天','地','光','暗','大','小','長','高','安','新'
];

export function generateBoard(level: number): TileData[] {
  const layout = generateLayout(level);
  const totalTiles = layout.length;
  const numPairs = totalTiles / 2;
  
  let selectedChars: string[] = [];
  // Use more variety of characters as levels go up
  const variety = Math.min(6 + level, CHARACTERS.length);
  const pool = CHARACTERS.slice(0, variety);

  for (let i = 0; i < numPairs; i++) {
    const char = pool[i % pool.length];
    selectedChars.push(char, char);
  }
  
  // Shuffle characters
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
    t.state !== 'selected' && 
    t.id !== tile.id
  );

  const hasTopBlocker = activeTiles.some(t => 
    t.z > tile.z && 
    Math.abs(t.x - tile.x) < 2 && 
    Math.abs(t.y - tile.y) < 2
  );

  return !hasTopBlocker;
}
