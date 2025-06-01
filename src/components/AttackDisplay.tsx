import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AttackStrength } from '../types/game';

interface AttackDisplayProps {
  attackStrength: AttackStrength | null;
  isPlayerAttack: boolean;
  damage: number;
  isVisible: boolean;
}

const AttackDisplay: React.FC<AttackDisplayProps> = ({ 
  attackStrength, 
  isPlayerAttack, 
  damage, 
  isVisible 
}) => {
  if (!isVisible || !attackStrength) return null;
  const { t } = useLanguage();
  
  const getAttackColor = () => {
    switch (attackStrength) {
      case 'weak': return 'text-gray-500';
      case 'ok': return 'text-yellow-500';
      case 'good': return 'text-orange-500';
      case 'effective': return 'text-red-500';
      case 'critical': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };
  
  const getAttackLabel = () => {
    return t(`attack.${attackStrength}`);
  };

  return (
    <div className={`absolute top-[75%] ${isPlayerAttack ? 'right-1/2' : 'left-1/2'} transform -translate-y-1/2 ${isPlayerAttack ? '-translate-x-1/2' : 'translate-x-1/2'} z-10`}>
      <div className="flex flex-col items-center animate-float-up">
        <span className={`text-lg font-bold ${getAttackColor()}`}>{getAttackLabel()}!</span>
        <span className="text-2xl font-extrabold text-red-600">-{damage} HP</span>
      </div>
    </div>
  );
};

export default AttackDisplay;