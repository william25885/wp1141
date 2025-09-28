// 遊戲基本型別定義

export interface Position {
  x: number;
  y: number;
}

export interface DinosaurState {
  position: Position;
  isJumping: boolean;
  isDucking: boolean;
  velocity: number;
  jumpStartTime: number;
  jumpDuration: number;
  jumpHeight: number;
  jumpDistance: number;
}

export interface Obstacle {
  id: string;
  type: 'cactus' | 'pterodactyl';
  position: Position;
  speed: number;
  height: number;
  width: number;
}

export interface BossSummon {
  id: string;
  type: 'pterodactyl' | 'cactus';
  position: Position;
  speed: number;
  summonedAt: number;
}

export interface BossPterodactyl {
  id: string;
  position: Position;
  speed: number;
  direction: 'left';
  summonedBy: 'boss';
}

export interface BossState {
  isActive: boolean;
  startTime: number | null;
  duration: number;
  isVictory: boolean;
  timeRemaining: number;
}

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  score: number;
  highScore: number;
  speed: number;
  dinosaur: DinosaurState;
  obstacles: Obstacle[];
  bossActive: boolean;
  bossTimeRemaining: number;
  bossSummons: BossSummon[];
}

// 遊戲常數
export const GAME_CONSTANTS = {
  DINOSAUR: {
    INITIAL_X: 50,
    GROUND_Y: 0, // 地板高度（從底部算起）- 完全貼地
    JUMP_HEIGHT: 100, // 固定跳躍高度
    JUMP_DURATION: 600, // 跳躍持續時間
    DUCK_HEIGHT: 30, // 蹲下時的高度
    MAX_JUMP_DISTANCE: 200, // 最大跳躍距離
  },
  OBSTACLES: {
    CACTUS_WIDTH: 20,
    CACTUS_HEIGHT: 30,
    PTERODACTYL_WIDTH: 30,
    PTERODACTYL_HEIGHT: 25,
    SPAWN_DISTANCE: 300,
  },
  BOSS: {
    SPEED_THRESHOLD: 6,
    ACTIVATION_SCORE: 0, // 不需要分數條件
    DURATION: 0, // 不需要時間限制
    SUMMON_INTERVAL: 2000, // 2秒
    VICTORY_SCORE: 10000, // 勝利條件：分數達到10000
  },
  GAME: {
    INITIAL_SPEED: 5,
    SPEED_INCREMENT: 0.1,
    SCORE_INCREMENT: 1,
  },
} as const;
