import React from 'react';
import { Sword } from 'lucide-react';
import { Character as CharacterType } from '../types/game';

interface CharacterProps {
  character: CharacterType;
  isPlayer: boolean;
}

const Character: React.FC<CharacterProps> = ({ character, isPlayer }) => {
  return (
    <div className={`relative flex flex-col items-center ${isPlayer ? 'order-first' : 'order-last'}`}>
      <div
        className={`w-32 h-32 relative ${character.isHit ? 'animate-shake' : ''} transition-all duration-200 
          ${character.isAttacking ? isPlayer ? 'animate-attack-right' : 'animate-attack-left' : ''}`}
      >
        <img 
          src={`/src/assets/pokemon/regular/${character.pokemonSlug}.png`}
          alt={character.name}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="mt-2 text-sm font-bold">{character.name}</span>
    </div>
  );
};

export default Character;