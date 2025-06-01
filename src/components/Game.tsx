import React from 'react';
import { useGame } from '../context/GameContext';
import Character from './Character';
import HealthBar from './HealthBar';
import Timer from './Timer';
import QuestionBox from './QuestionBox';
import AttackDisplay from './AttackDisplay';
import LevelSelection from './LevelSelection';
import StarterSelection from './StarterSelection';
import QuestionSetSelection from './QuestionSetSelection';
import BattleResults from './BattleResults';

const pokemonLogoUrl = new URL('../assets/pokemon-logo.png', import.meta.url).href;

const Game: React.FC = () => {
  const { 
    gameState, 
    answerQuestion, 
    resetGame,
    playerAttackStrength,
    computerAttackStrength,
    playerAttackDamage,
    computerAttackDamage,
    showPlayerAttack,
    showComputerAttack
  } = useGame();

  const renderGameStatus = () => {
    switch (gameState.gameStatus) {
      case 'selecting-question-set':
        return (
          <div className="text-center space-y-6">
            <img src={pokemonLogoUrl} alt="Pokemon" className="h-24 mx-auto mb-4" />
            <QuestionSetSelection />
          </div>
        );

      case 'selecting-level':
        return <LevelSelection />;

      case 'selecting-starter':
        return (
          <div className="text-center space-y-6">
            <img src={pokemonLogoUrl} alt="Pokemon" className="h-24 mx-auto" />
            <StarterSelection />
          </div>
        );
      
      case 'player-won':
        return (
          <div className="text-center">
            <img src={pokemonLogoUrl} alt="Pokemon" className="h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-green-600">勝利！</h2>
            <BattleResults gameState={gameState} />
            <div className="space-y-4">
              <button 
                onClick={() => resetGame(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                同じレベルでもう一度
              </button>
              <button 
                onClick={() => resetGame(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                新しい問題セットを選ぶ
              </button>
            </div>
          </div>
        );
      
      case 'computer-won':
        return (
          <div className="text-center">
            <img src={pokemonLogoUrl} alt="Pokemon" className="h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-red-600">敗北！</h2>
            <BattleResults gameState={gameState} />
            <div className="space-y-4">
              <button 
                onClick={() => resetGame(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                同じレベルでもう一度
              </button>
              <button 
                onClick={() => resetGame(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                新しい問題セットを選ぶ
              </button>
            </div>
          </div>
        );
      
      case 'in-progress':
        return (
          <>
            <div className="flex justify-between items-center mb-6 relative">
              <div className="w-2/5">
                <HealthBar 
                  current={gameState.playerCharacter.health} 
                  max={gameState.playerCharacter.maxHealth} 
                  name={gameState.playerCharacter.name}
                  isPlayer
                />
              </div>
              
              <div className="w-2/5">
                <HealthBar 
                  current={gameState.computerCharacter.health} 
                  max={gameState.computerCharacter.maxHealth} 
                  name={gameState.computerCharacter.name}
                />
              </div>
              
              {showPlayerAttack && (
                <AttackDisplay 
                  attackStrength={playerAttackStrength}
                  isPlayerAttack={true}
                  damage={playerAttackDamage}
                  isVisible={showPlayerAttack}
                />
              )}
              
              {showComputerAttack && (
                <AttackDisplay 
                  attackStrength={computerAttackStrength}
                  isPlayerAttack={false}
                  damage={computerAttackDamage}
                  isVisible={showComputerAttack}
                />
              )}
            </div>
            
            <div className="flex justify-between mb-8">
              <Character character={gameState.playerCharacter} isPlayer={true} />
              <Character character={gameState.computerCharacter} isPlayer={false} />
            </div>
            
            <Timer timeRemaining={gameState.timeRemaining} maxTime={gameState.maxQuestionTime} />
            
            <QuestionBox 
              question={gameState.currentQuestion} 
              onAnswer={answerQuestion}
              isAnswerSubmitted={gameState.answerSubmitted}
              playerSelectedOptionIndex={gameState.currentQuestionPlayerSelectedOption}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-8">
        {renderGameStatus()}
      </div>
    </div>
  );
};

export default Game;