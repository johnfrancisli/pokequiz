import React from 'react';
import { useGame } from '../context/GameContext';
import Character from './Character';
import HealthBar from './HealthBar';
import Timer from './Timer';
import QuestionBox from './QuestionBox';
import AttackDisplay from './AttackDisplay';

const Game: React.FC = () => {
  const { 
    gameState, 
    startGame, 
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
      case 'not-started':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Question Battle</h1>
            <p className="mb-6">Answer questions quickly to attack your opponent!</p>
            <button 
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors"
            >
              Start Game
            </button>
          </div>
        );
      
      case 'player-won':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-600">Victory!</h1>
            <p className="mb-6">You defeated the computer with your knowledge!</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        );
      
      case 'computer-won':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Defeat!</h1>
            <p className="mb-6">The computer has defeated you!</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
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
            
            <Timer timeRemaining={gameState.timeRemaining} maxTime={5} />
            
            <QuestionBox 
              question={gameState.currentQuestion} 
              onAnswer={answerQuestion}
              disabled={false}
            />
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Computer attacks in: {gameState.computerAttackTimer.toFixed(1)}s
              </p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-6">
        {renderGameStatus()}
      </div>
    </div>
  );
};

export default Game;