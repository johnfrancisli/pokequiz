import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  name: string;
  isPlayer?: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, name, isPlayer = false }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Calculate color based on health percentage
  const getHealthColor = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-2">
        <div className="flex flex-col gap-1 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20">
          <span className="text-sm font-bold text-gray-700 text-center">{name}</span>
          <span className="text-sm font-medium text-gray-600 text-center">{current}/{max} HP</span>
        </div>
      </div>
      <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden backdrop-blur-sm">
        <div 
          className={`h-full rounded-full ${getHealthColor()} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;