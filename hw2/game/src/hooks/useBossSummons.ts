import { useState, useEffect, useCallback } from 'react';
import type { BossSummon } from '../types/game';
import { GAME_CONSTANTS } from '../types/game';

export const useBossSummons = (bossActive: boolean, isPlaying: boolean) => {
  const [summons, setSummons] = useState<BossSummon[]>([]);

  const generateSummon = useCallback((): BossSummon => {
    const types: ('pterodactyl' | 'cactus')[] = ['pterodactyl', 'cactus'];
    const type = types[Math.floor(Math.random() * types.length)];
    const randomSpeed = Math.random() * 3 + 2; // 2-5 的隨機速度

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: {
        x: window.innerWidth + 50,
        y:
          type === 'pterodactyl'
            ? GAME_CONSTANTS.DINOSAUR.GROUND_Y + 35 // 翼手龍在天空，高度在恐龍蹲下後略高，但比跑步狀態低
            : GAME_CONSTANTS.DINOSAUR.GROUND_Y, // 仙人掌貼地，與恐龍跑步/跳躍時同一高度
      },
      speed: randomSpeed,
      summonedAt: Date.now(),
    };
  }, []);

  const updateSummons = useCallback(() => {
    setSummons(prev => {
      // 移動召喚物
      const updated = prev.map(summon => ({
        ...summon,
        position: { ...summon.position, x: summon.position.x - summon.speed },
      }));

      // 移除螢幕外的召喚物
      return updated.filter(summon => summon.position.x > -50);
    });
  }, []);

  const spawnSummon = useCallback(() => {
    const newSummon = generateSummon();

    // 智能生成邏輯：預測到達時間，避免與恐龍位置附近的障礙物衝突
    setSummons(prev => {
      // Boss召喚物的動態間隔控制
      const baseDistance = 200;
      const speedMultiplier = Math.max(1, newSummon.speed / 3);
      const dynamicDistance = baseDistance * speedMultiplier;

      // 恐龍位置（假設在x=50）
      const dinosaurX = 50;
      const newSummonX = newSummon.position.x;

      // 檢查恐龍前後6個恐龍寬度範圍內是否有其他召喚物
      const dinosaurWidth = 30; // 恐龍寬度
      const safetyRange = dinosaurWidth * 6; // 前後6個恐龍寬度
      const safetyZoneStart = dinosaurX - safetyRange;
      const safetyZoneEnd = dinosaurX + safetyRange;

      // 檢查新召喚物是否在安全範圍內
      const newSummonInSafetyZone =
        newSummonX >= safetyZoneStart && newSummonX <= safetyZoneEnd;

      // 檢查現有召喚物是否在安全範圍內
      const hasConflict = prev.some(summon => {
        const summonX = summon.position.x;
        return summonX >= safetyZoneStart && summonX <= safetyZoneEnd;
      });

      // 如果新召喚物在安全範圍內，或者安全範圍內已有其他召喚物，則有衝突
      const hasSafetyConflict = newSummonInSafetyZone || hasConflict;

      // 檢查召喚物密度
      const summonCount = prev.length;
      const maxSummons = Math.max(4, Math.floor(newSummon.speed));

      // 如果有安全範圍衝突或召喚物過多，則不生成
      if (hasSafetyConflict || summonCount >= maxSummons) {
        return prev;
      }

      // 額外檢查：確保新召喚物不會與現有召喚物在生成位置重疊
      const tooClose = prev.some(summon => {
        const distance = Math.abs(summon.position.x - newSummonX);
        return distance < dynamicDistance;
      });

      if (tooClose) {
        return prev;
      }

      return [...prev, newSummon];
    });
  }, [generateSummon]);

  // 大魔王召喚邏輯
  useEffect(() => {
    if (!bossActive || !isPlaying) {
      setSummons([]);
      return;
    }

    const summonInterval = setInterval(
      () => {
        spawnSummon();
      },
      GAME_CONSTANTS.BOSS.SUMMON_INTERVAL + Math.random() * 3000
    ); // 2-5秒隨機間隔

    const updateInterval = setInterval(() => {
      updateSummons();
    }, 16); // 約 60 FPS

    return () => {
      clearInterval(summonInterval);
      clearInterval(updateInterval);
    };
  }, [bossActive, isPlaying, spawnSummon, updateSummons]);

  const resetSummons = useCallback(() => {
    setSummons([]);
  }, []);

  return {
    summons,
    updateSummons,
    resetSummons,
  };
};
