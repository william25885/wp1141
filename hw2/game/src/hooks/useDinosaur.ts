import { useState, useCallback } from 'react';
import type { DinosaurState } from '../types/game';
import { GAME_CONSTANTS } from '../types/game';

export const useDinosaur = () => {
  const [dinosaur, setDinosaur] = useState<DinosaurState>({
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
  });

  const jump = useCallback(() => {
    // 只有在恐龍在地面且沒有跳躍時才能跳躍（移除蹲下檢查，因為狀態更新有延遲）
    if (
      !dinosaur.isJumping &&
      dinosaur.position.y === GAME_CONSTANTS.DINOSAUR.GROUND_Y
    ) {
      setDinosaur(prev => ({
        ...prev,
        isJumping: true,
        isDucking: false, // 跳躍時自動停止蹲下
        jumpStartTime: Date.now(),
        jumpHeight: GAME_CONSTANTS.DINOSAUR.JUMP_HEIGHT, // 固定最大跳躍高度
        jumpDistance: 0,
      }));
    }
  }, [dinosaur.isJumping, dinosaur.position.y]);

  const stopJump = useCallback(() => {
    if (dinosaur.isJumping) {
      setDinosaur(prev => ({
        ...prev,
        isJumping: false,
        jumpStartTime: 0,
      }));
    }
  }, [dinosaur.isJumping]);

  const duck = useCallback(() => {
    if (!dinosaur.isJumping) {
      setDinosaur(prev => ({
        ...prev,
        isDucking: true,
      }));
    }
  }, [dinosaur.isJumping]);

  const stopDuck = useCallback(() => {
    setDinosaur(prev => ({
      ...prev,
      isDucking: false,
    }));
  }, []);

  const updatePosition = useCallback(() => {
    setDinosaur(prev => {
      if (prev.isJumping) {
        const elapsed = Date.now() - prev.jumpStartTime;

        // 如果跳躍時間超過最大持續時間，強制結束跳躍
        if (elapsed >= prev.jumpDuration) {
          return {
            ...prev,
            isJumping: false,
            position: { ...prev.position, y: GAME_CONSTANTS.DINOSAUR.GROUND_Y },
          };
        }

        // 跳躍中，位置由組件計算（上升後自動下墜）
        return prev;
      }

      // 如果沒有跳躍也沒有蹲下，確保在地面上
      if (!prev.isJumping && !prev.isDucking) {
        return {
          ...prev,
          position: { ...prev.position, y: GAME_CONSTANTS.DINOSAUR.GROUND_Y },
        };
      }

      return prev;
    });
  }, []);

  const resetDinosaur = useCallback(() => {
    setDinosaur({
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
    });
  }, []);

  return {
    dinosaur,
    jump,
    stopJump,
    duck,
    stopDuck,
    updatePosition,
    resetDinosaur,
  };
};
