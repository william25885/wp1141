import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useDinosaur } from './hooks/useDinosaur';
import { useObstacles } from './hooks/useObstacles';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import { useBossSystem } from './hooks/useBossSystem';
import { useAudio } from './hooks/useAudio';
import GameContainer from './components/GameContainer';
import './App.css';

function App() {
  const {
    gameState,
    setGameState,
    startGame,
    endGame,
    victory,
    resetGame,
    updateScore,
    updateSpeed,
  } = useGameState();

  const {
    dinosaur,
    jump,
    stopJump,
    duck,
    stopDuck,
    updatePosition,
    resetDinosaur,
  } = useDinosaur();
  const { obstacles, resetObstacles } = useObstacles(
    gameState.speed,
    gameState.isPlaying
  );
  const { checkCollision } = useCollisionDetection();
  const { bossState, resetBoss } = useBossSystem(
    gameState.speed,
    gameState.score
  );
  const { isPlaying: isMusicPlaying, startMusic, stopMusic } = useAudio();

  // 音樂控制
  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // 鍵盤控制
  useKeyboard(
    {
      ' ': jump, // 按下空白鍵開始跳躍
      arrowdown: duck,
      s: duck,
    },
    {
      ' ': stopJump, // 放開空白鍵停止跳躍
    }
  );

  // 停止蹲下
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 's') {
        stopDuck();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [stopDuck]);

  // 遊戲主迴圈
  const gameUpdate = () => {
    if (!gameState.isPlaying || gameState.isGameOver || gameState.isVictory)
      return;

    // 更新恐龍位置
    updatePosition();

    // 更新遊戲狀態
    setGameState(prev => ({
      ...prev,
      dinosaur,
    }));

    // 檢查碰撞
    if (checkCollision(dinosaur, obstacles)) {
      endGame();
      stopMusic();
      return;
    }

    // 更新分數和速度
    updateScore();
    if (gameState.score % 100 === 0) {
      updateSpeed();
    }

    // 檢查大魔王勝利
    if (bossState.isVictory) {
      victory();
      stopMusic();
    }
  };

  useGameLoop(gameUpdate, gameState.isPlaying);

  // 重置遊戲
  const handleRestart = () => {
    resetGame();
    resetDinosaur();
    resetObstacles();
    resetBoss();
    stopMusic();
  };

  // 開始遊戲時播放音樂
  const handleStart = () => {
    startGame();
    startMusic();
  };

  return (
    <div className="App">
      <GameContainer
        gameState={gameState}
        obstacles={obstacles}
        onStart={handleStart}
        onRestart={handleRestart}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />
    </div>
  );
}

export default App;
