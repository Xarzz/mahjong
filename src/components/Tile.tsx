import React from 'react';
import type { TileData } from '../utils/board';

interface TileProps {
  data: TileData;
  isFree: boolean;
  onClick: (tile: TileData) => void;
}

export const Tile: React.FC<TileProps> = ({ data, isFree, onClick }) => {
  const isMatched = data.state === 'matched';
  const isSelected = data.state === 'selected';
  
  const UNIT = 45;

  const left = data.x * UNIT;
  const top = data.y * UNIT;
  
  const zOffset = data.z * 10; 
  const zIndex = data.z * 100 + data.x + data.y;

  return (
    <div
      className={`mahjong-tile ${isFree ? 'is-free' : 'is-blocked'} ${isSelected ? 'is-selected' : ''} ${isMatched ? 'is-matched' : ''}`}
      style={{
        width: `${UNIT * 2 - 4}px`,
        height: `${UNIT * 2 - 4}px`,
        left: `${left - zOffset}px`,
        top: `${top - zOffset}px`,
        zIndex: zIndex,
        transform: isSelected ? 'translateY(-10px)' : 'none',
      }}
      onClick={() => {
        if (isFree) onClick(data);
      }}
    >
      <span className="char">{data.char}</span>
      <div className="tile-side-bottom" />
      <div className="tile-side-right" />
    </div>
  );
};
