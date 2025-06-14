import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GameState, AnswerRecord } from '../types/game';

interface BattleResultsProps {
  gameState: GameState;
}

const BattleResults: React.FC<BattleResultsProps> = ({ gameState }) => {
  const { t } = useLanguage();

  const getImagePath = (pokemonSlug: string) => {
    return new URL(`/src/assets/pokemon/regular/${pokemonSlug}.png`, import.meta.url).href;
  };

  const getAnswerStatusColor = (record: AnswerRecord) => {
    if (record.selectedAnswerIndex === null) return 'text-gray-500';
    return record.selectedAnswerIndex === record.correctAnswerIndex ? 'text-green-600' : 'text-red-600';
  };

  const getAnswerStatusText = (record: AnswerRecord) => {
    if (record.selectedAnswerIndex === null) return t('battle.timeout');
    return record.selectedAnswerIndex === record.correctAnswerIndex ? t('battle.correct') : t('battle.incorrect');
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
            {t('battle.hp').replace('{current}', gameState.playerCharacter.health.toString()).replace('{max}', gameState.playerCharacter.maxHealth.toString())}
          </span>
        </div>
        
        <div className="text-2xl font-bold">{t('battle.vs')}</div>
        
        <div className="flex flex-col items-center space-y-2">
          <img
            src={getImagePath(gameState.computerCharacter.pokemonSlug)}
            alt={gameState.computerCharacter.name}
            className="w-24 h-24 object-contain"
          />
          <span className="font-bold">{gameState.computerCharacter.name}</span>
          <span className="text-sm">
            {t('battle.hp').replace('{current}', gameState.computerCharacter.health.toString()).replace('{max}', gameState.computerCharacter.maxHealth.toString())}
          </span>
        </div>
      </div>

      {/* Question History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">{t('battle.history')}</h3>
        <div className="space-y-4">
          {gameState.questionHistory.map((record, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-800">
                  {t('battle.questionPrefix').replace('{number}', (index + 1).toString())}{' '}{record.question.text}
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
                      <span className="ml-2 text-green-600">{t('battle.correctMark')}</span>
                    )}
                  </div>
                ))}
              </div>
              
              {record.timeRemaining > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {t('battle.answerTime').replace('{time}', record.timeRemaining.toFixed(1))}
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