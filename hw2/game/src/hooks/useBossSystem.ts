import { useState, useEffect, useCallback } from 'react';
import type { BossState } from '../types/game';
import { GAME_CONSTANTS } from '../types/game';

export const useBossSystem = (speed: number, score: number) => {
  const [bossState, setBossState] = useState<BossState>({
    isActive: false,
    startTime: null,
    duration: GAME_CONSTANTS.BOSS.DURATION,
    isVictory: false,
    timeRemaining: GAME_CONSTANTS.BOSS.DURATION,
  });

  // 檢查是否應該啟動大魔王（速度達到6時）
  const shouldActivateBoss = useCallback(() => {
    return speed >= GAME_CONSTANTS.BOSS.SPEED_THRESHOLD;
  }, [speed]);

  // 啟動大魔王（只是標記狀態，不需要召喚物）
  const activateBoss = useCallback(() => {
    setBossState(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
      timeRemaining: GAME_CONSTANTS.BOSS.DURATION,
    }));
  }, []);

  // 勝利
  const bossVictory = useCallback(() => {
    setBossState(prev => ({
      ...prev,
      isActive: false,
      isVictory: true,
      timeRemaining: 0,
    }));
  }, []);

  // 重置大魔王狀態
  const resetBoss = useCallback(() => {
    setBossState({
      isActive: false,
      startTime: null,
      duration: GAME_CONSTANTS.BOSS.DURATION,
      isVictory: false,
      timeRemaining: GAME_CONSTANTS.BOSS.DURATION,
    });
  }, []);

  // 檢查啟動條件
  useEffect(() => {
    if (shouldActivateBoss() && !bossState.isActive && !bossState.isVictory) {
      activateBoss();
    }
  }, [
    shouldActivateBoss,
    bossState.isActive,
    bossState.isVictory,
    activateBoss,
  ]);

  // 檢查勝利條件（分數達到4000）
  useEffect(() => {
    if (bossState.isActive && score >= GAME_CONSTANTS.BOSS.VICTORY_SCORE) {
      bossVictory();
    }
  }, [bossState.isActive, score, bossVictory]);

  return {
    bossState,
    activateBoss,
    bossVictory,
    resetBoss,
  };
};
