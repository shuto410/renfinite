interface SettingButtonsProps {
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  onSizeChange: (size: number) => void;
  onWinLengthChange: (length: number) => void;
  onCPUModeToggle: () => void;
  onCPULevelChange: (level: number) => void;
}

export default function SettingButtons({
  size,
  winLength,
  isCPUMode,
  cpuLevel,
  onSizeChange,
  onWinLengthChange,
  onCPUModeToggle,
  onCPULevelChange,
}: SettingButtonsProps) {
  const availableWinLengths = Array.from(
    { length: Math.min(7, size) - 2 },
    (_, i) => i + 3,
  );

  return (
    <div className='mb-6 flex gap-4 items-center flex-wrap justify-center'>
      <div className='flex gap-4 items-center'>
        <label className='text-gray-100'>Board Size:</label>
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className='px-3 py-2 border border-gray-300 rounded-md'
        >
          {[3, 5, 7, 9, 11].map((num) => (
            <option key={num} value={num}>
              {num}x{num}
            </option>
          ))}
        </select>
      </div>

      <div className='flex gap-4 items-center'>
        <label className='text-gray-100'>Win Length:</label>
        <select
          value={winLength}
          onChange={(e) => onWinLengthChange(Number(e.target.value))}
          className='px-3 py-2 border border-gray-300 rounded-md'
        >
          {availableWinLengths.map((num) => (
            <option key={num} value={num}>
              {num} in a row
            </option>
          ))}
        </select>
      </div>

      <div className='flex gap-4 items-center'>
        <label className='text-gray-100'>CPU Opponent:</label>
        <button
          onClick={onCPUModeToggle}
          className={`px-4 py-2 rounded-md transition-colors duration-200 
            ${
              isCPUMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {isCPUMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {isCPUMode && (
        <div className='flex gap-4 items-center'>
          <label className='text-gray-100'>CPU Level:</label>
          <select
            value={cpuLevel}
            onChange={(e) => onCPULevelChange(Number(e.target.value))}
            className='px-3 py-2 border border-gray-300 rounded-md'
          >
            <option value={0}>Random</option>
            <option value={1}>Smart</option>
          </select>
        </div>
      )}
    </div>
  );
}
