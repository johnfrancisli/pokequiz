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
  starterList: StarterPokemon[];
}

const QUESTION_TIMERS = {
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
  timeRemaining: QUESTION_TIMERS[1],
  maxQuestionTime: QUESTION_TIMERS[1],
  gameStatus: 'selecting-level',
  selectedLevel: 1
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [starterList] = useState<StarterPokemon[]>(getStarterPokemonList());
  const [unaskedQuestions, setUnaskedQuestions] = useState<Question[]>([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const selectLevel = useCallback((level: number) => {
    setGameState(prev => ({
      ...prev,
      selectedLevel: level,
      gameStatus: 'selecting-starter',
      timeRemaining: QUESTION_TIMERS[level as keyof typeof QUESTION_TIMERS],
      maxQuestionTime: QUESTION_TIMERS[level as keyof typeof QUESTION_TIMERS]
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
      timeRemaining: QUESTION_TIMERS[prev.selectedLevel as keyof typeof QUESTION_TIMERS],
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
    setAnswerSubmitted(false);
  }, []);

  // Handle player answering a question
  const answerQuestion = useCallback((optionIndex: number) => {
    if (answerSubmitted || gameState.gameStatus !== 'in-progress') return;
    
    setAnswerSubmitted(true);
    const correct = optionIndex === gameState.currentQuestion?.correctAnswer;
    
    if (correct) {
      const damage = Math.ceil((gameState.timeRemaining / gameState.maxQuestionTime) * 10);
      
      setGameState(prev => ({
        ...prev,
        playerCharacter: { ...prev.playerCharacter, isAttacking: true },
        computerCharacter: { ...prev.computerCharacter, isHit: true }
      }));
      
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
      }, 1000);
      
      
      // Load a new question if the game is still in progress
      setTimeout(() => {
        setGameState(prev => {
          if (prev.gameStatus === 'in-progress') {
            loadNewQuestion();
          }
          return prev;
        }, 500);
      });
    } else {
      const timePassed = gameState.maxQuestionTime - gameState.timeRemaining;
      const damage = Math.ceil((timePassed / gameState.maxQuestionTime) * 10);
      
      setGameState(prev => ({
        ...prev,
        computerCharacter: { ...prev.computerCharacter, isAttacking: true },
        playerCharacter: { ...prev.playerCharacter, isHit: true }
      }));
      
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
      }, 1000);
      
      
      // Load new question if game continues
      setTimeout(() => {
        if (gameState.gameStatus === 'in-progress') {
          loadNewQuestion();
        }
      }, 500);
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

          const damage = 10; // Full damage when time runs out
          
          setGameState(prevState => ({
            ...prevState,
            computerCharacter: { ...prevState.computerCharacter, isAttacking: true },
            playerCharacter: { ...prevState.playerCharacter, isHit: true }
          }));
          
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

  return (
    <GameContext.Provider value={{
      gameState,
      selectLevel,
      selectStarter,
      answerQuestion,
      resetGame,
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