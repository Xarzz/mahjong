import React, { useState, useEffect, useMemo } from 'react';
import { type TileData, generateBoard, isTileFree, getTheme } from '../utils/board';
import { Tile } from './Tile';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, Target, Sparkles } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<TileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  const theme = useMemo(() => getTheme(level), [level]);

  useEffect(() => {
    setBoard(generateBoard(level));
    setSelectedTile(null);
  }, [level]);

  const handleTileClick = (tile: TileData) => {
    if (!isTileFree(tile, board)) return;

    if (selectedTile) {
      if (selectedTile.id === tile.id) {
        setBoard(b => b.map(t => t.id === tile.id ? { ...t, state: 'idle' } : t));
        setSelectedTile(null);
      } else if (selectedTile.char === tile.char) {
        // Match!
        const newBoard = board.map(t => 
          t.id === tile.id || t.id === selectedTile.id 
            ? { ...t, state: 'matched' } 
            : t
        );
        setBoard(newBoard);
        setScore(prev => prev + 100 * level);
        setSelectedTile(null);

        // Check level win
        if (newBoard.every(t => t.state === 'matched')) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [theme.primary, '#ffffff', '#fbbf24']
          });
          
          setTimeout(() => {
            if (level < 100) {
              setLevel(prev => prev + 1);
            }
          }, 1500);
        }
      } else {
        setBoard(b => b.map(t => {
          if (t.id === tile.id) return { ...t, state: 'selected' };
          if (t.id === selectedTile.id) return { ...t, state: 'idle' };
          return t;
        }));
        setSelectedTile(tile);
      }
    } else {
      setBoard(b => b.map(t => t.id === tile.id ? { ...t, state: 'selected' } : t));
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

      <div className="board-container" style={{ background: theme.panel }}>
        <div className="board-inner">
          {board.map(tile => (
            <Tile
              key={tile.id}
              data={tile}
              isFree={isTileFree(tile, board)}
              onClick={handleTileClick}
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
