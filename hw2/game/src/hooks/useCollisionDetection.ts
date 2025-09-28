import { useCallback } from 'react';
import type { DinosaurState, Obstacle } from '../types/game';

export const useCollisionDetection = () => {
  const checkCollision = useCallback(
    (dinosaur: DinosaurState, obstacles: Obstacle[]): boolean => {
      // 蹲下時碰撞體積調整：高度減少，但保持貼地
      const dinosaurHeight = dinosaur.isDucking ? 30 : 40; // 蹲下時高度減少

      // 計算跳躍偏移
      const getJumpOffset = () => {
        if (!dinosaur.isJumping || dinosaur.jumpStartTime === 0) return 0;

        const elapsed = Date.now() - dinosaur.jumpStartTime;
        const progress = elapsed / dinosaur.jumpDuration;

        if (progress >= 1) return 0; // 跳躍結束，回到地面

        if (progress < 0.5) {
          // 上升階段
          return dinosaur.jumpHeight * (progress * 2);
        } else {
          // 下降階段
          return dinosaur.jumpHeight * (2 - progress * 2);
        }
      };

      const jumpOffset = getJumpOffset();

      const dinosaurRect = {
        x: dinosaur.position.x,
        y: dinosaur.position.y + jumpOffset, // 恐龍的底部位置
        width: 30,
        height: dinosaurHeight,
      };

      return obstacles.some(obstacle => {
        const obstacleRect = {
          x: obstacle.position.x,
          y: obstacle.position.y, // 障礙物的底部位置
          width: obstacle.width,
          height: obstacle.height,
        };

        // 矩形碰撞檢測 - 檢查是否有實際重疊
        const horizontalOverlap =
          dinosaurRect.x < obstacleRect.x + obstacleRect.width &&
          dinosaurRect.x + dinosaurRect.width > obstacleRect.x;

        const verticalOverlap =
          dinosaurRect.y < obstacleRect.y + obstacleRect.height &&
          dinosaurRect.y + dinosaurRect.height > obstacleRect.y;

        // 只有水平和垂直都重疊才算碰撞
        return horizontalOverlap && verticalOverlap;
      });
    },
    []
  );

  return { checkCollision };
};
