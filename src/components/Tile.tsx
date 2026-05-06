import React from 'react';
import type { TileData } from '../utils/board';

interface TileProps {
  data: TileData;
  isFree: boolean;
  onClick: (tile: TileData) => void;
  styleOffset?: { x: number, y: number };
}

export const Tile: React.FC<TileProps> = ({ data, isFree, onClick, styleOffset = { x: 0, y: 0 } }) => {
  const isMatched = data.state === 'matched';
  const isSelected = data.state === 'selected';
  
  const UNIT = 45;
  const zOffset = data.z * 10; 

  // Position including visual 3D shift, then subtracted by the board's minimum visual bound
  const left = (data.x * UNIT - zOffset) - styleOffset.x;
  const top = (data.y * UNIT - zOffset) - styleOffset.y;
  
  const zIndex = data.z * 100 + data.x + data.y;

  return (
    <div
      className={`mahjong-tile ${isFree ? 'is-free' : 'is-blocked'} ${isSelected ? 'is-selected' : ''} ${isMatched ? 'is-matched' : ''}`}
      style={{
        width: `${UNIT * 2 - 4}px`,
        height: `${UNIT * 2 - 4}px`,
        left: `${left}px`,
        top: `${top}px`,
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
