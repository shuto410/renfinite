import React from 'react';
import { BattleSettingPopup } from './BattleSettingPopup';
import { useGameStore } from '@/store';

export const SettingButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    size,
    winLength,
    isCPUMode,
    cpuLevel,
    setSize,
    setWinLength,
    setIsCPUMode,
    setCPULevel,
  } = useGameStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2'
      >
        <span>設定</span>
      </button>

      <BattleSettingPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={size}
        winLength={winLength}
        isCPUMode={isCPUMode}
        cpuLevel={cpuLevel}
        onSizeChange={setSize}
        onWinLengthChange={setWinLength}
        onCPUModeToggle={() => setIsCPUMode(!isCPUMode)}
        onCPULevelChange={setCPULevel}
      />
    </>
  );
};
