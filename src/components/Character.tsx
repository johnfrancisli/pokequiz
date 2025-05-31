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
        className={`w-24 h-32 relative ${character.isHit ? 'animate-shake' : ''} transition-all duration-200`}
      >
        {/* Stick figure */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-12 h-28">
            {/* Head */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-full"></div>
            
            {/* Body */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gray-800"></div>
            
            {/* Left Arm */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-gray-800"></div>
            
            {/* Right Arm (Sword Arm) */}
            <div className={`absolute top-10 ${isPlayer ? 'right-0' : 'left-0'} w-5 h-1 bg-gray-800 transform ${isPlayer ? 'rotate-45 translate-x-1' : '-rotate-45 -translate-x-1'}`}></div>
            
            {/* Legs */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 rotate-30 w-1 h-8 bg-gray-800 origin-top" 
              style={{ transform: `translateX(-3px) rotate(30deg)` }}></div>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -rotate-30 w-1 h-8 bg-gray-800 origin-top" 
              style={{ transform: `translateX(3px) rotate(-30deg)` }}></div>

            {/* Sword */}
            <div className={`absolute ${isPlayer ? 'right-[-8px] top-[34px]' : 'left-[-8px] top-[34px]'} transition-all duration-200 ${character.isAttacking ? isPlayer ? 'animate-attack-right' : 'animate-attack-left' : ''}`}>
              <Sword 
                size={24} 
                className={`${isPlayer ? 'transform rotate-45' : 'transform -rotate-45'} text-gray-500`} 
              />
            </div>
          </div>
        </div>
      </div>
      <span className="mt-2 text-sm font-bold">{character.name}</span>
    </div>
  );
};

export default Character;