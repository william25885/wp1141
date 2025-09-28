import React from 'react';
import type { GameState, Obstacle } from '../types/game';
import Dinosaur from './Dinosaur';
import ObstacleComponent from './Obstacle';
import GameUI from './GameUI';

interface GameContainerProps {
  gameState: GameState;
  obstacles: Obstacle[];
  onStart: () => void;
  onRestart: () => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  gameState,
  obstacles,
  onStart,
  onRestart,
  isMusicPlaying,
  onToggleMusic,
}) => {
  return (
    <div className="game-container">
      <div className="game-area">
        {/* 星星 */}
        <div className="star small"></div>
        <div className="star medium"></div>
        <div className="star small"></div>
        <div className="star large"></div>
        <div className="star small"></div>
        <div className="star medium"></div>
        <div className="star small"></div>
        <div className="star medium"></div>
        <div className="star small"></div>
        <div className="star large"></div>
        <div className="star small"></div>
        <div className="star medium"></div>

        {/* 月亮 */}
        <div className="moon" />

        {/* 地面 */}
        <div className="ground" />

        {/* 恐龍 */}
        <Dinosaur dinosaur={gameState.dinosaur} />

        {/* 一般障礙物 */}
        {obstacles.map(obstacle => (
          <ObstacleComponent key={obstacle.id} obstacle={obstacle} />
        ))}
      </div>

      <GameUI gameState={gameState} onStart={onStart} onRestart={onRestart} />

      {/* 音樂控制按鈕 */}
      {onToggleMusic && (
        <button
          className="music-toggle"
          onClick={onToggleMusic}
          title={isMusicPlaying ? '關閉音樂' : '開啟音樂'}
        >
          {isMusicPlaying ? '🔊' : '🔇'}
        </button>
      )}
    </div>
  );
};

export default GameContainer;
