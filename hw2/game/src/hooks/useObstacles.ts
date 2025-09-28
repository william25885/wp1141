import { useState, useCallback, useEffect } from 'react';
import type { Obstacle } from '../types/game';
import { GAME_CONSTANTS } from '../types/game';

export const useObstacles = (speed: number, isPlaying: boolean) => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  // const [spawnTimer, setSpawnTimer] = useState(0);

  const generateObstacle = useCallback((): Obstacle => {
    const types: ('cactus' | 'pterodactyl')[] = ['cactus', 'pterodactyl'];
    const type = types[Math.floor(Math.random() * types.length)];

    // 當速度達到6時，某些障礙物會有不同的速度
    let obstacleSpeed = speed;
    if (speed >= 6) {
      // 30% 機率生成不同速度的障礙物
      if (Math.random() < 0.3) {
        // 速度變化範圍：0.8x 到 1.5x
        const speedMultiplier = 0.8 + Math.random() * 0.7;
        obstacleSpeed = speed * speedMultiplier;
      }
    }

    const obstacle: Obstacle = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: {
        x: window.innerWidth + 50,
        y: GAME_CONSTANTS.DINOSAUR.GROUND_Y,
      },
      speed: obstacleSpeed,
      height:
        type === 'cactus'
          ? GAME_CONSTANTS.OBSTACLES.CACTUS_HEIGHT
          : GAME_CONSTANTS.OBSTACLES.PTERODACTYL_HEIGHT,
      width:
        type === 'cactus'
          ? GAME_CONSTANTS.OBSTACLES.CACTUS_WIDTH
          : GAME_CONSTANTS.OBSTACLES.PTERODACTYL_WIDTH,
    };

    // 以 GROUND_Y 為基準調整位置，確保與恐龍對齊
    if (type === 'cactus') {
      // 仙人掌貼地（與恐龍跑步/跳躍時同一高度）
      obstacle.position.y = GAME_CONSTANTS.DINOSAUR.GROUND_Y;
    } else {
      // 翼手龍在天空中，高度在恐龍蹲下後略高，但比跑步狀態低
      obstacle.position.y = GAME_CONSTANTS.DINOSAUR.GROUND_Y + 35; // 調整翼手龍高度
    }

    return obstacle;
  }, [speed]);

  const updateObstacles = useCallback(() => {
    setObstacles(prev => {
      // 移動障礙物
      const updated = prev.map(obstacle => ({
        ...obstacle,
        position: {
          ...obstacle.position,
          x: obstacle.position.x - obstacle.speed,
        },
      }));

      // 移除螢幕外的障礙物
      return updated.filter(obstacle => obstacle.position.x > -obstacle.width);
    });
  }, []);

  const spawnObstacle = useCallback(() => {
    if (Math.random() < 0.04) {
      // 4% 機率生成障礙物（增加一倍）
      const newObstacle = generateObstacle();

      // 智能生成邏輯：預測到達時間，避免與恐龍位置附近的障礙物衝突
      setObstacles(prev => {
        // 根據遊戲速度動態調整間隔（縮小基礎距離讓障礙物更密集）
        const baseDistance = 150; // 從250減少到150
        const speedMultiplier = Math.max(1, speed / 3); // 速度越快，間隔越大
        const dynamicDistance = baseDistance * speedMultiplier;

        // 恐龍位置（假設在x=50）
        const dinosaurX = 50;
        const newObstacleX = newObstacle.position.x;

        // 計算新障礙物到達恐龍位置所需的時間
        const distanceToDinosaur = newObstacleX - dinosaurX;
        const timeToReachDinosaur = distanceToDinosaur / newObstacle.speed;

        // 檢查現有障礙物是否會在相近時間到達恐龍位置
        const hasConflict = prev.some(obstacle => {
          const obstacleDistanceToDinosaur = obstacle.position.x - dinosaurX;
          const obstacleTimeToReach =
            obstacleDistanceToDinosaur / obstacle.speed;

          // 計算時間差
          const timeDifference = Math.abs(
            timeToReachDinosaur - obstacleTimeToReach
          );

          // 如果兩個障礙物會在相近時間（2秒內）到達恐龍位置，則有衝突
          // 縮短時間間隔讓障礙物更密集
          return timeDifference < 2.0;
        });

        // 如果有時間衝突，則不生成
        if (hasConflict) {
          return prev;
        }

        // 額外檢查：確保新障礙物不會與現有障礙物在生成位置重疊
        const tooClose = prev.some(obstacle => {
          const distance = Math.abs(obstacle.position.x - newObstacleX);
          return distance < dynamicDistance;
        });

        if (tooClose) {
          return prev;
        }

        return [...prev, newObstacle];
      });
    }
  }, [generateObstacle]);

  // 遊戲迴圈更新
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      updateObstacles();
      spawnObstacle();
    }, 16); // 約 60 FPS

    return () => clearInterval(gameLoop);
  }, [isPlaying, updateObstacles, spawnObstacle]);

  const resetObstacles = useCallback(() => {
    setObstacles([]);
    // setSpawnTimer(0);
  }, []);

  return {
    obstacles,
    updateObstacles,
    resetObstacles,
  };
};
