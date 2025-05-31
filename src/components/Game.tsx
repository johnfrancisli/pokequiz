import React from 'react';
import { useGame } from '../context/GameContext';
import Character from './Character';
import HealthBar from './HealthBar';
import Timer from './Timer';
import QuestionBox from './QuestionBox';
import AttackDisplay from './AttackDisplay';
import StarterSelection from './StarterSelection';
import pokemonLogo from '../assets/pokemon-logo.png';

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
      case 'selecting-starter':
        return (
          <div className="text-center space-y-6">
            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto" />
            <StarterSelection />
          </div>
        );
      
      case 'player-won':
        return (
          <div className="text-center">
            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-green-600">勝利！</h2>
            <p className="mb-6">あなたの知識で相手を倒しました！</p>
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              もう一度プレイ
            </button>
          </div>
        );
      
      case 'computer-won':
        return (
          <div className="text-center">
            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-red-600">敗北！</h2>
            <p className="mb-6">コンピューターがあなたを倒しました！</p>
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              もう一度挑戦
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
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-8">
        {renderGameStatus()}
      </div>
    </div>
  );
};

export default Game;