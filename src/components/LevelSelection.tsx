import React from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import pokemonLogo from '../assets/pokemon-logo.png';

const LevelSelection: React.FC = () => {
  const { selectLevel } = useGame();
  const { t } = useLanguage();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="text-center space-y-6">
      <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('level.title')}</h2>
      <p className="text-gray-600 mb-6">{t('level.description')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-4">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => selectLevel(level)}
            className="flex flex-col items-center p-6 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/20 
              transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            <span className="text-xl font-bold text-gray-800 mb-2">{t('level.' + level)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;