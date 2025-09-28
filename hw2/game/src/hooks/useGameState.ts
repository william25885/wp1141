import { useState } from 'react';
import type { GameState } from '../types/game';
import { GAME_CONSTANTS } from '../types/game';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    isVictory: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('dinoHighScore') || '0'),
    speed: GAME_CONSTANTS.GAME.INITIAL_SPEED,
    dinosaur: {
      position: {
        x: GAME_CONSTANTS.DINOSAUR.INITIAL_X,
        y: GAME_CONSTANTS.DINOSAUR.GROUND_Y,
      },
      isJumping: false,
      isDucking: false,
      velocity: 0,
      jumpStartTime: 0,
      jumpDuration: GAME_CONSTANTS.DINOSAUR.JUMP_DURATION,
      jumpHeight: GAME_CONSTANTS.DINOSAUR.JUMP_HEIGHT,
      jumpDistance: 0,
    },
    obstacles: [],
    bossActive: false,
    bossTimeRemaining: GAME_CONSTANTS.BOSS.DURATION,
    bossSummons: [],
  });

  // 更新最高分
  const updateHighScore = (newScore: number) => {
    if (newScore > gameState.highScore) {
      const newHighScore = newScore;
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
      localStorage.setItem('dinoHighScore', newHighScore.toString());
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: false,
      isVictory: false,
      score: 0,
      speed: GAME_CONSTANTS.GAME.INITIAL_SPEED,
      dinosaur: {
        position: {
          x: GAME_CONSTANTS.DINOSAUR.INITIAL_X,
          y: GAME_CONSTANTS.DINOSAUR.GROUND_Y,
        },
        isJumping: false,
        isDucking: false,
        velocity: 0,
        jumpStartTime: 0,
        jumpDuration: GAME_CONSTANTS.DINOSAUR.JUMP_DURATION,
        jumpHeight: GAME_CONSTANTS.DINOSAUR.JUMP_HEIGHT,
        jumpDistance: 0,
      },
      obstacles: [],
      bossActive: false,
      bossTimeRemaining: GAME_CONSTANTS.BOSS.DURATION,
      bossSummons: [],
    }));
  };

  // 開始遊戲
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isGameOver: false,
      isVictory: false,
    }));
  };

  // 結束遊戲
  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
    updateHighScore(gameState.score);
  };

  // 勝利
  const victory = () => {
    setGameState(prev => ({ ...prev, isPlaying: false, isVictory: true }));
    updateHighScore(gameState.score);
  };

  // 更新分數
  const updateScore = (
    increment: number = GAME_CONSTANTS.GAME.SCORE_INCREMENT
  ) => {
    setGameState(prev => ({ ...prev, score: prev.score + increment }));
  };

  // 更新速度
  const updateSpeed = (
    increment: number = GAME_CONSTANTS.GAME.SPEED_INCREMENT
  ) => {
    setGameState(prev => ({ ...prev, speed: prev.speed + increment }));
  };

  return {
    gameState,
    setGameState,
    updateHighScore,
    resetGame,
    startGame,
    endGame,
    victory,
    updateScore,
    updateSpeed,
  };
};
