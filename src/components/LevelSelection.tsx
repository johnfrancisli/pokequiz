import React from 'react';
import { useGame } from '../context/GameContext';
import pokemonLogo from '../assets/pokemon-logo.png';

const LEVEL_DESCRIPTIONS = {
  1: '初級: 10秒ごとに攻撃',
  2: '初級+: 8.5秒ごとに攻撃',
  3: '中級: 7秒ごとに攻撃',
  4: '中級+: 5.5秒ごとに攻撃',
  5: '上級: 4秒ごとに攻撃',
  6: '上級+: 3.5秒ごとに攻撃',
  7: 'エキスパート: 3秒ごとに攻撃',
  8: 'エキスパート+: 2.5秒ごとに攻撃',
  9: 'マスター: 2秒ごとに攻撃',
  10: 'チャンピオン: 1.5秒ごとに攻撃'
};

const LevelSelection: React.FC = () => {
  const { selectLevel } = useGame();

  return (
    <div className="text-center space-y-6">
      <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">難易度を選んでください</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-4">
        {Object.entries(LEVEL_DESCRIPTIONS).map(([level, description]) => (
          <button
            key={level}
            onClick={() => selectLevel(parseInt(level))}
            className="flex flex-col items-center p-6 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/20 
              transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            <span className="text-xl font-bold text-gray-800 mb-2">レベル {level}</span>
            <span className="text-sm text-gray-600">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;