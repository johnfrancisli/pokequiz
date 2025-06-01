import React from 'react';
import { GameState, AnswerRecord } from '../types/game';

interface BattleResultsProps {
  gameState: GameState;
}

const BattleResults: React.FC<BattleResultsProps> = ({ gameState }) => {
  const getImagePath = (pokemonSlug: string) => {
    return new URL(`/src/assets/pokemon/regular/${pokemonSlug}.png`, import.meta.url).href;
  };

  const getAnswerStatusColor = (record: AnswerRecord) => {
    if (record.selectedAnswerIndex === null) return 'text-gray-500';
    return record.selectedAnswerIndex === record.correctAnswerIndex ? 'text-green-600' : 'text-red-600';
  };

  const getAnswerStatusText = (record: AnswerRecord) => {
    if (record.selectedAnswerIndex === null) return '時間切れ';
    return record.selectedAnswerIndex === record.correctAnswerIndex ? '正解' : '不正解';
  };

  return (
    <div className="space-y-8">
      {/* Battle Summary */}
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <img
            src={getImagePath(gameState.playerCharacter.pokemonSlug)}
            alt={gameState.playerCharacter.name}
            className="w-24 h-24 object-contain scale-x-[-1]"
          />
          <span className="font-bold">{gameState.playerCharacter.name}</span>
          <span className="text-sm">
            HP: {gameState.playerCharacter.health}/{gameState.playerCharacter.maxHealth}
          </span>
        </div>
        
        <div className="text-2xl font-bold">VS</div>
        
        <div className="flex flex-col items-center space-y-2">
          <img
            src={getImagePath(gameState.computerCharacter.pokemonSlug)}
            alt={gameState.computerCharacter.name}
            className="w-24 h-24 object-contain"
          />
          <span className="font-bold">{gameState.computerCharacter.name}</span>
          <span className="text-sm">
            HP: {gameState.computerCharacter.health}/{gameState.computerCharacter.maxHealth}
          </span>
        </div>
      </div>

      {/* Question History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">問題の履歴</h3>
        <div className="space-y-4">
          {gameState.questionHistory.map((record, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-800">
                  問題 {index + 1}: {record.question.text}
                </span>
                <span className={`font-medium ${getAnswerStatusColor(record)}`}>
                  {getAnswerStatusText(record)}
                </span>
              </div>
              
              <div className="space-y-2">
                {record.question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded ${
                      optionIndex === record.correctAnswerIndex
                        ? 'bg-green-100 border border-green-500'
                        : optionIndex === record.selectedAnswerIndex
                        ? 'bg-red-100 border border-red-500'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {option}
                    {optionIndex === record.correctAnswerIndex && (
                      <span className="ml-2 text-green-600">✓ 正解</span>
                    )}
                  </div>
                ))}
              </div>
              
              {record.timeRemaining > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  回答時間: {record.timeRemaining.toFixed(1)}秒
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleResults;