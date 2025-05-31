import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { GameState, Question, AttackStrength, Character } from '../types/game';
import { questions, shuffleArray, getQuestionWithShuffledOptions } from '../data/questions';
import { getStarterPokemonList, getRandomStarter, StarterPokemon } from '../utils/pokemonUtils';

interface GameContextType {
  gameState: GameState;
  selectLevel: (level: number) => void;
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
  gameStatus: 'selecting-level',
  computerAttackTimer: 5,
  selectedLevel: 1
};

const ATTACK_INTERVALS = {
  1: 10,
  2: 8.5,
  3: 7,
  4: 5.5,
  5: 4,
  6: 3.5,
  7: 3,
  8: 2.5,
  9: 2,
  10: 1.5
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [starterList] = useState<StarterPokemon[]>(getStarterPokemonList());
  const [unaskedQuestions, setUnaskedQuestions] = useState<Question[]>([]);
  const [playerAttackStrength, setPlayerAttackStrength] = useState<AttackStrength | null>(null);
  const [computerAttackStrength, setComputerAttackStrength] = useState<AttackStrength | null>(null);
  const [playerAttackDamage, setPlayerAttackDamage] = useState(0);
  const [computerAttackDamage, setComputerAttackDamage] = useState(0);
  const [showPlayerAttack, setShowPlayerAttack] = useState(false);
  const [showComputerAttack, setShowComputerAttack] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const selectLevel = useCallback((level: number) => {
    setGameState(prev => ({
      ...prev,
      selectedLevel: level,
      gameStatus: 'selecting-starter',
      computerAttackTimer: ATTACK_INTERVALS[level as keyof typeof ATTACK_INTERVALS]
    }));
  }, []);

  // Load a new question
  const loadNewQuestion = useCallback(() => {
    // If we've used all questions, reshuffle the full question set
    if (unaskedQuestions.length === 0) {
      setUnaskedQuestions(shuffleArray([...questions]));
    }

    // Take the first question from our unasked questions
    const nextQuestions = [...unaskedQuestions];
    const nextQuestion = nextQuestions.shift();
    setUnaskedQuestions(nextQuestions);

    // Shuffle the options for this question
    const questionWithShuffledOptions = getQuestionWithShuffledOptions(nextQuestion!);

    setGameState(prev => ({
      ...prev,
      currentQuestion: questionWithShuffledOptions,
      timeRemaining: 5,
    }));
    setAnswerSubmitted(false);
  }, [unaskedQuestions]);

  // Start the game
  const selectStarter = useCallback((selectedStarter: StarterPokemon) => {
    const computerStarter = getRandomStarter();
    // Initialize unasked questions with shuffled questions array
    const initialQuestions = shuffleArray([...questions]);
    setUnaskedQuestions(initialQuestions.slice(1)); // Remove first question since we'll use it as initial question

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
      currentQuestion: getQuestionWithShuffledOptions(initialQuestions[0])
    });
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState(defaultGameState);
    setUnaskedQuestions([]);
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
      case 'critical': return 15;
      case 'strong': return 12;
      case 'medium': return 8;
      case 'weak': return 5;
      default: return 0;
    }
  };

  // Handle player answering a question
  const answerQuestion = useCallback((optionIndex: number) => {
    if (answerSubmitted || gameState.gameStatus !== 'in-progress') return;
    
    setAnswerSubmitted(true);
    const correct = optionIndex === gameState.currentQuestion?.correctAnswer;
    
    if (correct) {
      const strength = calculateAttackStrength(gameState.timeRemaining);
      const damage = calculateDamage(strength);
      
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
      const damage = 8;
      
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

          // Time ran out - player takes small damage
          const strength: AttackStrength = 'medium';
          const damage = 3;
          
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
    if (gameState.gameStatus !== 'in-progress') return;
    
    const attackTimer = setInterval(() => {
      setGameState(prev => {
        const interval = ATTACK_INTERVALS[prev.selectedLevel as keyof typeof ATTACK_INTERVALS];
        const newComputerAttackTimer = prev.computerAttackTimer - 0.1;
        
        if (newComputerAttackTimer <= 0) {
          // Computer attacks
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
                gameStatus: newGameStatus,
                computerAttackTimer: interval
              };
            });
            
            setShowComputerAttack(false);
          }, 1000);
          
          return {
            ...prev,
            computerAttackTimer: interval
          };
        }
        
        return {
          ...prev,
          computerAttackTimer: newComputerAttackTimer
        };
      });
    }, 100);
    
    return () => clearInterval(attackTimer);
  }, [gameState.gameStatus]);

  return (
    <GameContext.Provider value={{
      gameState,
      selectLevel,
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