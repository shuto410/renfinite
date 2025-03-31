import React from 'react';
import SettingButtons from './setting-buttons';

interface BattleSettingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  onSizeChange: (size: number) => void;
  onWinLengthChange: (length: number) => void;
  onCPUModeToggle: () => void;
  onCPULevelChange: (level: number) => void;
}

export const BattleSettingPopup: React.FC<BattleSettingPopupProps> = ({
  isOpen,
  onClose,
  size,
  winLength,
  isCPUMode,
  cpuLevel,
  onSizeChange,
  onWinLengthChange,
  onCPUModeToggle,
  onCPULevelChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 rounded-lg'>
      <div className='bg-gray-900 rounded-lg w-full max-w-2xl '>
        <div className='sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center rounded-lg'>
          <h2 className='text-xl font-bold text-white'>戦闘設定</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            ✕
          </button>
        </div>
        <div className='p-6'>
          <SettingButtons
            size={size}
            winLength={winLength}
            isCPUMode={isCPUMode}
            cpuLevel={cpuLevel}
            onSizeChange={onSizeChange}
            onWinLengthChange={onWinLengthChange}
            onCPUModeToggle={onCPUModeToggle}
            onCPULevelChange={onCPULevelChange}
          />
        </div>
      </div>
    </div>
  );
};
