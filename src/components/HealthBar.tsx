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
    <div className={`w-full max-w-xs ${isPlayer ? 'text-left' : 'text-right'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-700">{current} / {max} HP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          className={`h-full rounded-full ${getHealthColor()} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;