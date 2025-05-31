import React from 'react';
import { useGame } from '../context/GameContext';
import { StarterPokemon } from '../utils/pokemonUtils';

const StarterSelection: React.FC = () => {
  const { selectStarter, starterList } = useGame();

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Starter Pokémon</h2>
      <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
        {starterList.map((pokemon: StarterPokemon) => (
          <button
            key={pokemon.idx}
            onClick={() => selectStarter(pokemon)}
            className="flex flex-col items-center p-4 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/20 transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name}
              className="w-24 h-24 object-contain"
            />
            <span className="mt-2 font-medium text-gray-800">{pokemon.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};