import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { type TileData, generateBoard, isTileFree, getTheme } from '../utils/board';
import { Tile } from './Tile';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, Target, Sparkles } from 'lucide-react';

const UNIT = 55;

export const GameBoard: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<TileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = useMemo(() => getTheme(level), [level]);

  useEffect(() => {
    setBoard(generateBoard(level));
    setSelectedTile(null);
  }, [level]);

  // Calculate visual boundaries (no z-offset since all flat)
  const bounds = useMemo(() => {
    if (board.length === 0) return { width: 0, height: 0, offsetX: 0, offsetY: 0 };
    const xs = board.map(t => t.x * UNIT);
    const ys = board.map(t => t.y * UNIT);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      width: (maxX - minX) + (UNIT * 2),
      height: (maxY - minY) + (UNIT * 2),
      offsetX: minX,
      offsetY: minY
    };
  }, [board]);

  // Dynamic scaling — fill container
  const recalcScale = useCallback(() => {
    if (!containerRef.current || bounds.width === 0) return;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    if (cW === 0 || cH === 0) return;

    const sX = cW / bounds.width;
    const sY = cH / bounds.height;
    setScale(Math.max(0.2, Math.min(sX, sY, 3)));
  }, [bounds]);

  useEffect(() => {
    recalcScale();
    window.addEventListener('resize', recalcScale);
    return () => window.removeEventListener('resize', recalcScale);
  }, [recalcScale]);

  const handleTileClick = (tile: TileData) => {
    if (!isTileFree(tile, board)) return;

    if (selectedTile) {
      if (selectedTile.id === tile.id) {
        // Deselect
        setBoard(b => b.map(t => t.id === tile.id ? { ...t, state: 'idle' as const } : t));
        setSelectedTile(null);
      } else if (selectedTile.char === tile.char) {
        // Correct match!
        const newBoard = board.map(t =>
          t.id === tile.id || t.id === selectedTile.id
            ? { ...t, state: 'matched' as const }
            : t
        );
        setBoard(newBoard);
        setScore(prev => prev + 100 * level);
        setSelectedTile(null);

        if (newBoard.every(t => t.state === 'matched')) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [theme.primary, '#ffffff', '#fbbf24']
          });
          setTimeout(() => {
            if (level < 100) setLevel(prev => prev + 1);
          }, 1500);
        }
      } else {
        // WRONG match → shake both tiles
        const wrongId1 = selectedTile.id;
        const wrongId2 = tile.id;

        setBoard(b => b.map(t => {
          if (t.id === wrongId1 || t.id === wrongId2) return { ...t, state: 'wrong' as const };
          return t;
        }));
        setSelectedTile(null);

        setTimeout(() => {
          setBoard(b => b.map(t => {
            if (t.id === wrongId1 || t.id === wrongId2) return { ...t, state: 'idle' as const };
            return t;
          }));
        }, 600);
      }
    } else {
      setBoard(b => b.map(t => t.id === tile.id ? { ...t, state: 'selected' as const } : t));
      setSelectedTile(tile);
    }
  };

  const handleRestart = () => {
    setBoard(generateBoard(level));
    setSelectedTile(null);
    setScore(0);
  };

  const remainingPairs = board.filter(t => t.state !== 'matched').length / 2;

  return (
    <div className="game-container" style={{
      backgroundColor: theme.bg,
      backgroundImage: `radial-gradient(circle at 15% 50%, ${theme.primaryGlow}, transparent 25%), radial-gradient(circle at 85% 30%, ${theme.primaryGlow}, transparent 25%)`
    }}>
      <div className="header" style={{ background: theme.panel }}>
        <div className="title-section">
          <div className="level-badge" style={{ background: theme.primary }}>
            LVL {level}
          </div>
          <div>
            <h1 className="title" style={{ background: `linear-gradient(to right, ${theme.primary}, #fff)`, WebkitBackgroundClip: 'text' }}>
              Nihongo Blast
            </h1>
            <p className="subtitle">Tema: {theme.name}</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <Trophy size={18} className="stat-icon" style={{ color: '#fbbf24' }} />
            <div className="stat-value">{score.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <Target size={18} className="stat-icon" style={{ color: theme.primary }} />
            <div className="stat-value">{remainingPairs} Pasang</div>
          </div>
          <button onClick={handleRestart} className="restart-btn" style={{ background: theme.primary }}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="board-container" ref={containerRef}>
        <div
          className="board-inner"
          style={{
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
            transform: `translate(-50%, -50%) scale(${scale})`
          }}
        >
          {board.map(tile => (
            <Tile
              key={tile.id}
              data={tile}
              isFree={isTileFree(tile, board)}
              onClick={handleTileClick}
              styleOffset={{ x: bounds.offsetX, y: bounds.offsetY }}
            />
          ))}
          {remainingPairs === 0 && (
            <div className="level-up-overlay">
              <Sparkles size={48} color="#fbbf24" />
              <h2>LEVEL {level} CLEAR!</h2>
              <p>Menuju Level {level + 1}...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
