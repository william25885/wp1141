import React from 'react';
import type { GameState } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onStart, onRestart }) => {
  if (gameState.isVictory) {
    return (
      <div className="game-ui victory-screen">
        <h1>🏆 勝利！</h1>
        <h2>你贏得了遊戲！</h2>
        <p>最終分數: {gameState.score}</p>
        <p>最高分: {gameState.highScore}</p>
        <button onClick={onRestart} className="game-button">
          再玩一次
        </button>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="game-ui game-over-screen">
        <h1>💀 遊戲結束</h1>
        <p>分數: {gameState.score}</p>
        <p>最高分: {gameState.highScore}</p>
        <button onClick={onRestart} className="game-button">
          重新開始
        </button>
      </div>
    );
  }

  if (!gameState.isPlaying) {
    return (
      <div className="game-ui start-screen">
        <h1>🦕 小恐龍遊戲</h1>
        <p>躲避障礙物，達到10000分即可獲勝！</p>
        <p>盡可能達到10000分吧！</p>
        <button onClick={onStart} className="game-button">
          開始遊戲
        </button>
      </div>
    );
  }

  return (
    <div className="game-ui">
      <div className="score-display">
        <div className="score">分數: {gameState.score}</div>
        <div className="high-score">最高分: {gameState.highScore}</div>
        <div className="speed">速度: {gameState.speed.toFixed(1)}</div>
      </div>
    </div>
  );
};

export default GameUI;
