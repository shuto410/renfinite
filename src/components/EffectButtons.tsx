import { BlockDirection } from "@/types/game";

interface EffectButtonsProps {
  isBlockEffectActive: BlockDirection;
  isReplaceStoneActive: boolean;
  xIsNext: boolean;
  playerMana: number;
  cpuMana: number;
  onBlockEffect: (direction: BlockDirection) => void;
  onReplaceStone: () => void;
}

export function EffectButtons({
  isBlockEffectActive,
  isReplaceStoneActive,
  xIsNext,
  playerMana,
  cpuMana,
  onBlockEffect,
  onReplaceStone
}: EffectButtonsProps) {
  return (
    <div className="mb-4 flex gap-2">
      {(['up', 'right', 'down', 'left'] as const).map((direction) => (
        <button
          key={direction}
          className={`px-4 py-2 rounded-md transition-colors duration-200 
            ${isBlockEffectActive === direction
              ? 'bg-purple-500 text-white' 
              : ((xIsNext && playerMana >= 1) || (!xIsNext && cpuMana >= 1))
                ? 'bg-purple-200 hover:bg-purple-300'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          onClick={() => onBlockEffect(direction)}
          disabled={isBlockEffectActive !== null || ((xIsNext && playerMana < 1) || (!xIsNext && cpuMana < 1))}
        >
          {isBlockEffectActive === direction ? 'Block Effect Active' : `Block ${direction} (1 Mana)`}
        </button>
      ))}
      <button
        className={`px-4 py-2 rounded-md transition-colors duration-200 
          ${isReplaceStoneActive
            ? 'bg-red-500 text-white' 
            : ((xIsNext && playerMana >= 2) || (!xIsNext && cpuMana >= 2))
              ? 'bg-red-200 hover:bg-red-300'
              : 'bg-gray-200 cursor-not-allowed'
          }`}
        onClick={onReplaceStone}
        disabled={isReplaceStoneActive || ((xIsNext && playerMana < 2) || (!xIsNext && cpuMana < 2))}
      >
        {isReplaceStoneActive ? 'Replace Stone Active' : 'Replace Stone (2 Mana)'}
      </button>
    </div>
  );
} 