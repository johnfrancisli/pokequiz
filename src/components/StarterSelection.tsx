import React from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { StarterPokemon } from '../utils/pokemonUtils';

const StarterSelection: React.FC = () => {
  const { selectStarter, starterList } = useGame();
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('starter.title')}</h2>
      <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto p-4">
        {starterList.map((pokemon: StarterPokemon) => (
          <button
            key={pokemon.idx}
            onClick={() => selectStarter(pokemon)}
            className="flex items-center p-4 rounded-xl bg-white/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 backdrop-blur-sm border border-white/20 transition-all hover:shadow-lg transform hover:-translate-y-1 hover:border-blue-200/50"
          >
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name}
              className="w-16 h-16 object-contain"
            />
            <span className="ml-4 font-medium text-gray-800">{pokemon.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarterSelection