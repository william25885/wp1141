import React from 'react';
import type { DinosaurState } from '../types/game';

interface DinosaurProps {
  dinosaur: DinosaurState;
}

const Dinosaur: React.FC<DinosaurProps> = ({ dinosaur }) => {
  // 計算跳躍位置
  const getJumpPosition = () => {
    if (!dinosaur.isJumping || dinosaur.jumpStartTime === 0) return 0;

    const elapsed = Date.now() - dinosaur.jumpStartTime;
    const progress = elapsed / dinosaur.jumpDuration;

    if (progress >= 1) return 0; // 跳躍結束，回到地面

    const maxHeight = dinosaur.jumpHeight;

    // 確保上升和下降速度完全一致
    if (progress < 0.5) {
      // 上升階段（前50%時間）- 線性上升
      return maxHeight * (progress / 0.5);
    } else {
      // 下降階段（後50%時間）- 線性下降，速度與上升相同
      const fallProgress = (progress - 0.5) / 0.5; // 0 到 1
      return maxHeight * (1 - fallProgress);
    }
  };

  const jumpOffset = getJumpPosition();

  const dinosaurStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${dinosaur.position.x}px`,
    bottom: `${dinosaur.position.y + jumpOffset}px`, // 使用恐龍的 y 位置 + 跳躍偏移
    width: '30px',
    height: '40px', // 固定高度，不因蹲下而改變
    backgroundColor: 'transparent', // 去背
    borderRadius: '5px',
    transition: dinosaur.isJumping ? 'none' : 'all 0.1s ease',
    zIndex: 10,
    fontSize: '30px', // 確保圖示大小
    // 移除 transform，讓 CSS 處理
  };

  return (
    <div
      className={`dinosaur ${dinosaur.isJumping ? 'jumping' : ''} ${dinosaur.isDucking ? 'ducking' : ''} ${!dinosaur.isJumping && !dinosaur.isDucking ? 'running' : ''}`}
      style={dinosaurStyle}
    >
      🦖
    </div>
  );
};

export default Dinosaur;
