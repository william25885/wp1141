import React from 'react';
import type { Obstacle as ObstacleType } from '../types/game';

interface ObstacleProps {
  obstacle: ObstacleType;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const obstacleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${obstacle.position.x}px`,
    bottom: `${obstacle.position.y}px`,
    width: `${obstacle.width}px`,
    height: `${obstacle.height}px`,
    zIndex: 5,
  };

  const getObstacleContent = () => {
    if (obstacle.type === 'cactus') {
      return '🌵';
    } else {
      return '🦅';
    }
  };

  return (
    <div className={`obstacle ${obstacle.type}`} style={obstacleStyle}>
      {getObstacleContent()}
    </div>
  );
};

export default Obstacle;
