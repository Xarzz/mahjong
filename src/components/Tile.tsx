import React from 'react';
import type { TileData } from '../utils/board';

interface TileProps {
  data: TileData;
  isFree: boolean;
  onClick: (tile: TileData) => void;
  styleOffset?: { x: number, y: number };
}

const UNIT = 50;

export const Tile: React.FC<TileProps> = ({ data, isFree, onClick, styleOffset = { x: 0, y: 0 } }) => {
  const isMatched = data.state === 'matched';
  const isSelected = data.state === 'selected';
  const isWrong = data.state === 'wrong';
  
  const zOffset = data.z * 8; 

  // Position including visual 3D shift, then subtracted by the board's minimum visual bound
  const left = (data.x * UNIT - zOffset) - styleOffset.x;
  const top = (data.y * UNIT - zOffset) - styleOffset.y;
  
  const zIndex = data.z * 100 + data.x + data.y;

  const classNames = [
    'mahjong-tile',
    isFree ? 'is-free' : 'is-blocked',
    isSelected ? 'is-selected' : '',
    isMatched ? 'is-matched' : '',
    isWrong ? 'is-wrong' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{
        width: `${UNIT * 2 + 8}px`,
        height: `${UNIT * 2 + 8}px`,
        left: `${left}px`,
        top: `${top}px`,
        zIndex: zIndex,
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
