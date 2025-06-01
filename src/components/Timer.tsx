import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface TimerProps {
  timeRemaining: number;
  maxTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, maxTime }) => {
  const percentage = (timeRemaining / maxTime) * 100;
  const { t } = useLanguage();
  
  // Calculate color based on time remaining
  const getTimerColor = () => {
    if (percentage > 60) return 'bg-blue-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-2 mb-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{t('battle.timeRemaining')}</span>
        <span className="text-sm font-medium text-gray-700">{timeRemaining.toFixed(1)}s</span>
      </div>
      <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
        <div 
          className={`h-full rounded-full ${getTimerColor()} transition-all duration-200`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;