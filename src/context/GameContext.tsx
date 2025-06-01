import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { GameState, Question, AttackStrength, Character } from '../types/game';
import { shuffleArray, getQuestionWithShuffledOptions, loadQuestionSetData } from '../data/questions';
import { getStarterPokemonList, getRandomStarter, StarterPokemon } from '../utils/pokemonUtils';

interface GameContextType {
  gameState: GameState;
  selectLevel: (level: number) => void;
  loadQuestionSet: (id: string) => Promise<void>;
  selectStarter: (starter: StarterPokemon) => void;
  answerQuestion: (optionIndex: number) => void;
  resetGame: (keepLevelAndQuestionSet?: boolean) => void;
  starterList: StarterPokemon[];
  playerAttackStrength: AttackStrength | null;
  computerAttackStrength: AttackStrength | null;
  playerAttackDamage: number;
  computerAttackDamage: number;
  showPlayerAttack: boolean;
  showComputerAttack: boolean;
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
  timeRemaining: 10,
  maxQuestionTime: 10,
  gameStatus: 'selecting-question-set',
  selectedLevel: 1,
  currentQuestionSetId: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ 
  children: React.ReactNode;
  initialQuestionSetId?: string | null;
}> = ({ children, initialQuestionSetId }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [starterList] = useState<StarterPokemon[]>(getStarterPokemonList());
  const [unaskedQuestions, setUnaskedQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [playerAttackStrength, setPlayerAttackStrength] = useState<AttackStrength | null>(null);
  const [computerAttackStrength, setComputerAttackStrength] = useState<AttackStrength | null>(null);
  const [playerAttackDamage, setPlayerAttackDamage] = useState(0);
  const [computerAttackDamage, setComputerAttackDamage] = useState(0);
  const [showPlayerAttack, setShowPlayerAttack] = useState(false);
  const [showComputerAttack, setShowComputerAttack] = useState(false);

  // Load question set
  const loadQuestionSet = useCallback(async (id: string) => {
    try {
      const questionSet = await loadQuestionSetData(id);
      setAllQuestions(questionSet.questions);
      setGameState(prev => ({
        ...prev,
        gameStatus: 'selecting-level',
        currentQuestionSetId: id
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  // Handle initial question set from URL
  useEffect(() => {
    if (initialQuestionSetId) {
      loadQuestionSet(initialQuestionSetId).catch(() => {
        // If loading fails, stay in question set selection state
        setGameState(prev => ({
          ...prev,
          gameStatus: 'selecting-question-set'
        }));
      });
    }
  }, [initialQuestionSetId, loadQuestionSet]);

  const getAttackStrengthFromPercentage = (percentage: number): AttackStrength => {
    if (percentage >= 80) return 'critical';
    if (percentage >= 60) return 'effective';
    if (percentage >= 40) return 'good';
    if (percentage >= 20) return 'ok';
    return 'weak';
  };

  const selectLevel = useCallback((level: number) => {
    const questionTime = QUESTION_TIMERS[level as keyof typeof QUESTION_TIMERS];
    setGameState(prev => ({
      ...prev,
      selectedLevel: level,
      gameStatus: 'selecting-starter',
      timeRemaining: questionTime,
      maxQuestionTime: questionTime
    }));
  }, []);

  // Load a new question
  const loadNewQuestion = useCallback(() => {
    const questionTime = QUESTION_TIMERS[gameState.selectedLevel as keyof typeof QUESTION_TIMERS];
    
    // If we've used all questions, reshuffle the full question set
    if (unaskedQuestions.length === 0) {
      setUnaskedQuestions(shuffleArray([...allQuestions]));
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
      timeRemaining: questionTime,
      maxQuestionTime: questionTime
    })); 
    setAnswerSubmitted(false);
  }, [unaskedQuestions, gameState.selectedLevel, allQuestions]);

  // Start the game
  const selectStarter = useCallback((selectedStarter: StarterPokemon) => {
    const computerStarter = getRandomStarter();
    const questionTime = QUESTION_TIMERS[gameState.selectedLevel as keyof typeof QUESTION_TIMERS];
    
    // Initialize unasked questions with shuffled questions array
    const initialQuestions = shuffleArray([...allQuestions]);
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
      currentQuestion: getQuestionWithShuffledOptions(initialQuestions[0]),
      selectedLevel: gameState.selectedLevel,
      timeRemaining: questionTime,
      maxQuestionTime: questionTime
    });
  }, [gameState.selectedLevel, allQuestions]);

  // Reset the game
  const resetGame = useCallback((keepLevelAndQuestionSet: boolean = false) => {
    setGameState(prev => ({
      ...prev,
      ...defaultGameState,
      selectedLevel: keepLevelAndQuestionSet ? prev.selectedLevel : 1,
      currentQuestionSetId: keepLevelAndQuestionSet ? prev.currentQuestionSetId : null,
      gameStatus: keepLevelAndQuestionSet ? 'selecting-level' : 'selecting-question-set'
    }));
    setUnaskedQuestions([]);
    setAnswerSubmitted(false);
    setPlayerAttackStrength(null);
    setComputerAttackStrength(null);
    setPlayerAttackDamage(0);
    setComputerAttackDamage(0);
    setShowPlayerAttack(false);
    setShowComputerAttack(false);
  }, []);

  // Handle player answering a question
  const answerQuestion = useCallback((optionIndex: number) => {
    if (answerSubmitted || gameState.gameStatus !== 'in-progress') return;
    
    setAnswerSubmitted(true);
    const correct = optionIndex === gameState.currentQuestion?.correctAnswer;
    
    if (correct) {
      const percentage = (gameState.timeRemaining / gameState.maxQuestionTime) * 100;
      const damage = Math.ceil((percentage / 100) * 10);
      const strength = getAttackStrengthFromPercentage(percentage);
      
      setPlayerAttackStrength(strength);
      setPlayerAttackDamage(damage);
      setShowPlayerAttack(true);
      
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
        
        setShowPlayerAttack(false);
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
      const percentage = (timePassed / gameState.maxQuestionTime) * 100;
      const damage = Math.ceil((percentage / 100) * 10);
      const strength = getAttackStrengthFromPercentage(percentage);
      
      setComputerAttackStrength(strength);
      setComputerAttackDamage(damage);
      setShowComputerAttack(true);
      
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
        
        setShowComputerAttack(false);
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

          const damage = 10;
          setComputerAttackStrength('critical');
          setComputerAttackDamage(damage);
          setShowComputerAttack(true);
          
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

  return (
    <GameContext.Provider value={{
      gameState,
      selectLevel,
      selectStarter,
      answerQuestion,
      resetGame,
      loadQuestionSet,
      starterList,
      playerAttackStrength,
      computerAttackStrength,
      playerAttackDamage,
      computerAttackDamage,
      showPlayerAttack,
      showComputerAttack
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