import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { GameState, Question, AttackStrength, Character } from '../types/game';
import { getRandomQuestion } from '../data/questions';
import { getStarterPokemonList, getRandomStarter, StarterPokemon } from '../utils/pokemonUtils';

interface GameContextType {
  gameState: GameState;
  selectStarter: (starter: StarterPokemon) => void;
  answerQuestion: (optionIndex: number) => void;
  resetGame: () => void;
  playerAttackStrength: AttackStrength | null;
  computerAttackStrength: AttackStrength | null;
  playerAttackDamage: number;
  computerAttackDamage: number;
  showPlayerAttack: boolean;
  showComputerAttack: boolean;
  starterList: StarterPokemon[];
}

const defaultGameState: GameState = {
  playerCharacter: {
    name: 'Player',
    health: 100,
    maxHealth: 100,
    isAttacking: false,
    isHit: false,
    pokemonSlug: ''
  },
  computerCharacter: {
    name: 'Computer',
    health: 100,
    maxHealth: 100,
    isAttacking: false,
    isHit: false,
    pokemonSlug: ''
  },
  currentQuestion: null,
  timeRemaining: 5,
  gameStatus: 'selecting-starter',
  computerAttackTimer: 5
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [starterList] = useState<StarterPokemon[]>(getStarterPokemonList());
  const [playerAttackStrength, setPlayerAttackStrength] = useState<AttackStrength | null>(null);
  const [computerAttackStrength, setComputerAttackStrength] = useState<AttackStrength | null>(null);
  const [playerAttackDamage, setPlayerAttackDamage] = useState(0);
  const [computerAttackDamage, setComputerAttackDamage] = useState(0);
  const [showPlayerAttack, setShowPlayerAttack] = useState(false);
  const [showComputerAttack, setShowComputerAttack] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Load a new question
  const loadNewQuestion = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: getRandomQuestion(),
      timeRemaining: 5,
    }));
    setAnswerSubmitted(false);
  }, []);

  // Start the game
  const selectStarter = useCallback((selectedStarter: StarterPokemon) => {
    const computerStarter = getRandomStarter();
    setGameState({
      ...defaultGameState,
      playerCharacter: {
        ...defaultGameState.playerCharacter,
        name: selectedStarter.name,
        pokemonSlug: selectedStarter.slug
      },
      computerCharacter: {
        ...defaultGameState.computerCharacter,
        name: computerStarter.name,
        pokemonSlug: computerStarter.slug
      },
      gameStatus: 'in-progress',
      currentQuestion: getRandomQuestion()
    });
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState(defaultGameState);
    setPlayerAttackStrength(null);
    setComputerAttackStrength(null);
    setPlayerAttackDamage(0);
    setComputerAttackDamage(0);
    setShowPlayerAttack(false);
    setShowComputerAttack(false);
    setAnswerSubmitted(false);
  }, []);

  // Calculate attack strength based on time remaining
  const calculateAttackStrength = (timeRemaining: number): AttackStrength => {
    if (timeRemaining > 4) return 'critical';
    if (timeRemaining > 3) return 'strong';
    if (timeRemaining > 1) return 'medium';
    return 'weak';
  };

  // Calculate damage based on attack strength
  const calculateDamage = (strength: AttackStrength): number => {
    switch (strength) {
      case 'critical': return 25;
      case 'strong': return 20;
      case 'medium': return 15;
      case 'weak': return 10;
      default: return 0;
    }
  };

  // Handle player answering a question
  const answerQuestion = useCallback((optionIndex: number) => {
    if (answerSubmitted || gameState.gameStatus !== 'in-progress') return;
    
    setAnswerSubmitted(true);
    const correct = optionIndex === gameState.currentQuestion?.correctAnswer;
    
    if (correct) {
      const strength: AttackStrength = 'medium';
      const damage = 5;
      
      setPlayerAttackStrength(strength);
      setPlayerAttackDamage(damage);
      
      // Player attacks
      setGameState(prev => ({
        ...prev,
        playerCharacter: { ...prev.playerCharacter, isAttacking: true },
        computerCharacter: { ...prev.computerCharacter, isHit: true }
      }));
      
      setShowPlayerAttack(true);
      
      // After a short delay, update health and reset attack/hit status
      setTimeout(() => {
        setGameState(prev => {
          const newComputerHealth = Math.max(0, prev.computerCharacter.health - damage);
          const newGameStatus = newComputerHealth <= 0 ? 'player-won' : prev.gameStatus;
          
          return {
            ...prev,
            computerCharacter: {
              ...prev.computerCharacter,
              health: newComputerHealth,
              isHit: false
            },
            playerCharacter: {
              ...prev.playerCharacter,
              isAttacking: false
            },
            gameStatus: newGameStatus
          };
        });
        
        setShowPlayerAttack(false);
        
        // Load a new question if the game is still in progress
        setTimeout(() => {
          setGameState(prev => {
            if (prev.gameStatus === 'in-progress') {
              loadNewQuestion();
            }
            return prev;
          });
        }, 500);
      }, 1000);
    } else {
      // Wrong answer - player takes 10 damage
      const strength: AttackStrength = 'strong';
      const damage = 10;
      
      setComputerAttackStrength(strength);
      setComputerAttackDamage(damage);
      
      setGameState(prev => ({
        ...prev,
        computerCharacter: { ...prev.computerCharacter, isAttacking: true },
        playerCharacter: { ...prev.playerCharacter, isHit: true }
      }));
      
      setShowComputerAttack(true);
      
      setTimeout(() => {
        setGameState(prev => {
          const newPlayerHealth = Math.max(0, prev.playerCharacter.health - damage);
          const newGameStatus = newPlayerHealth <= 0 ? 'computer-won' : prev.gameStatus;
          
          return {
            ...prev,
            playerCharacter: {
              ...prev.playerCharacter,
              health: newPlayerHealth,
              isHit: false
            },
            computerCharacter: {
              ...prev.computerCharacter,
              isAttacking: false
            },
            gameStatus: newGameStatus
          };
        });
        
        setShowComputerAttack(false);
        
        // Load new question if game continues
        setTimeout(() => {
          if (gameState.gameStatus === 'in-progress') {
            loadNewQuestion();
          }
        }, 500);
      }, 1000);
    }
  }, [gameState, answerSubmitted, loadNewQuestion]);

  // Game timer logic
  useEffect(() => {
    if (gameState.gameStatus !== 'in-progress' || answerSubmitted) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          setAnswerSubmitted(true);

          // Time ran out - player takes 5 damage
          const strength: AttackStrength = 'medium';
          const damage = 5;
          
          setComputerAttackStrength(strength);
          setComputerAttackDamage(damage);
          
          setGameState(prevState => ({
            ...prevState,
            computerCharacter: { ...prevState.computerCharacter, isAttacking: true },
            playerCharacter: { ...prevState.playerCharacter, isHit: true }
          }));
          
          setShowComputerAttack(true);
          
          setTimeout(() => {
            setGameState(prevState => {
              const newPlayerHealth = Math.max(0, prevState.playerCharacter.health - damage);
              const newGameStatus = newPlayerHealth <= 0 ? 'computer-won' : prevState.gameStatus;
              
              return {
                ...prevState,
                playerCharacter: {
                  ...prevState.playerCharacter,
                  health: newPlayerHealth,
                  isHit: false
                },
                computerCharacter: {
                  ...prevState.computerCharacter,
                  isAttacking: false
                },
                gameStatus: newGameStatus
              };
            });
            
            setShowComputerAttack(false);
          
            // Load new question if game continues
            setTimeout(() => {
              if (gameState.gameStatus === 'in-progress') {
                loadNewQuestion();
              }
            }, 500);
          }, 1000);
          
          return prev;
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 0.1
        };
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [gameState.gameStatus, gameState.timeRemaining, answerSubmitted, loadNewQuestion]);

  // Computer attack timer
  useEffect(() => {
    // Remove computer auto-attack timer since we're using the new damage rules
    return;
  }, [gameState.gameStatus]);

  return (
    <GameContext.Provider value={{
      gameState,
      selectStarter,
      answerQuestion,
      resetGame,
      playerAttackStrength,
      computerAttackStrength,
      playerAttackDamage,
      computerAttackDamage,
      showPlayerAttack,
      showComputerAttack,
      starterList
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};