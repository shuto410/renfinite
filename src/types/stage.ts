/**
 * Stage-related type definitions
 */

/**
 * Stage types
 */
export type StageType = 'start' | 'shop' | 'battle' | 'event' | 'boss';

/**
 * Base stage type
 */
type BaseStage = {
  canMoveOtherRoute?: boolean;
};

/**
 * Start stage
 */
type StartStage = {
  type: 'start';
  canMoveOtherRoute: true;
};

/**
 * Battle stage
 */
type BattleStage = {
  type: 'battle';
  enemyLevel: 'test' | 'easy' | 'medium' | 'hard';
};

/**
 * Shop stage
 */
type ShopStage = {
  type: 'shop';
  // shopItems: ShopItem[];
};

/**
 * Event stage
 */
type EventStage = {
  type: 'event';
  // eventType: '' | 'special';
};

/**
 * Boss stage
 */
type BossStage = {
  type: 'boss';
};

/**
 * Stage type definition
 */
export type Stage =
  | BaseStage & (StartStage | BattleStage | ShopStage | EventStage | BossStage);

/**
 * Route types
 */
export type RouteType = 'A' | 'B' | 'C';

/**
 * Route type definition
 */
export type Route = {
  stages: Stage[];
};

/**
 * All routes type definition
 */
export type Routes = {
  [key in RouteType]: Route;
};
