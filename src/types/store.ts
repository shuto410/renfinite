import {
  BlockDirection,
  Card,
  MagicType,
  MoveRecord,
  PlayerMagicStatus,
  SquareMetaInfo,
} from './battle';
import { Routes, RouteType } from './stage';

/**
 * Battle board state management
 */
export interface BattleBoardState {
  squares: ('X' | 'O' | null)[];
  squaresMetaInfo: SquareMetaInfo[];
  xIsNext: boolean;
  blockedSquares: ('X' | 'O' | null)[];
  lastPlacedPosition: number | null;
  playerRenCount: number;
  cpuRenCount: number;
  playerHitPoints: number;
  cpuHitPoints: number;
  finalWinner: 'X' | 'O' | null;
  setSquares: (newSquares: ('X' | 'O' | null)[]) => void;
  setSquaresMetaInfo: (newSquaresMetaInfo: SquareMetaInfo[]) => void;
  setXIsNext: (newXIsNext: boolean) => void;
  setBlockedSquares: (newBlockedSquares: ('X' | 'O' | null)[]) => void;
  setLastPlacedPosition: (newLastPlacedPosition: number | null) => void;
  setPlayerRenCount: (newPlayerRenCount: number) => void;
  setCpuRenCount: (newCpuRenCount: number) => void;
  setFinalWinner: (newFinalWinner: 'X' | 'O' | null) => void;
  endTurn: () => void;
  setPlayerHitPoints: (newPlayerHitPoints: number) => void;
  setCpuHitPoints: (newCpuHitPoints: number) => void;
  placePiece: (position: number, magicType?: MagicType) => void;
  placeBlock: (position: number, blockDirection: BlockDirection) => void;
  destroyPiece: (position: number) => void;
  crossDestroyAndPlace: (position: number, magicType?: MagicType) => void;
  allDestroyAndPlace: (position: number, magicType?: MagicType) => void;
}

/**
 * Move history state management
 */
export interface MoveHistoryState {
  moveRecords: MoveRecord[];
  addMoveRecord: (
    player: 'X' | 'O',
    position: number,
    magic: Card | null,
  ) => void;
  clearMoveRecords: () => void;
}

/**
 * Game configuration state management
 */
export interface GameConfigState {
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  setSize: (newSize: number) => void;
  setWinLength: (newWinLength: number) => void;
  setIsCPUMode: (newIsCPUMode: boolean) => void;
  setCPULevel: (newCPULevel: number) => void;
}

/**
 * Item management state
 */
export interface ItemsState {
  gold: number;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => void;
}

/**
 * Stage route state management
 */
export interface StageRouteState {
  routes: Routes;
  currentRouteType: RouteType;
  currentStageIndex: number;
  setCurrentRouteType: (route: RouteType) => void;
  setCurrentStageIndex: (stage: number) => void;
  moveToNextStage: (routeType?: RouteType) => void;
}

/**
 * Magic system state management
 */
export interface MagicSystemState {
  playerState: PlayerMagicStatus;
  cpuState: PlayerMagicStatus;
  selectedMagic: Card | null;
  setPlayerDeck: (newPlayerDeck: Card[]) => void;
  setCpuDeck: (newCpuDeck: Card[]) => void;
  setPlayerHand: (newPlayerHand: Card[]) => void;
  setCpuHand: (newCpuHand: Card[]) => void;
  setPlayerMana: (newPlayerMana: number) => void;
  setCpuMana: (newCpuMana: number) => void;
  setSelectedMagic: (newSelectedMagic: Card | null) => void;
  addToPlayerDiscard: (cards: Card[]) => void;
  addToCpuDiscard: (cards: Card[]) => void;
  setPlayerDiscard: (newPlayerDiscard: Card[]) => void;
  setCpuDiscard: (newCpuDiscard: Card[]) => void;
  reshufflePlayerDiscard: () => void;
  reshuffleCpuDiscard: () => void;
}

/**
 * Player deck state management
 */
export interface PlayerDeckState {
  deck: Card[]; // Current deck composition
  addCard: (card: Card) => void; // Add card to deck
  removeCard: (cardId: string) => void; // Remove card from deck
  updateCard: (cardId: string, updatedCard: Partial<Card>) => void; // Update card information
  resetDeck: () => void; // Reset deck to initial state
  getDeckSize: () => number; // Get deck size
  getCardById: (cardId: string) => Card | undefined; // Search card by ID
}

export type StoreState = GameConfigState &
  BattleBoardState &
  MagicSystemState &
  MoveHistoryState &
  PlayerDeckState &
  ItemsState &
  StageRouteState;
