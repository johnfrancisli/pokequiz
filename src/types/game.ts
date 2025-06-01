export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Character {
  name: string;
  health: number;
  maxHealth: number;
  isAttacking: boolean;
  isHit: boolean;
  pokemonSlug: string;
}

export interface GameState {
  playerCharacter: Character;
  computerCharacter: Character;
  currentQuestion: Question | null;
  timeRemaining: number;
  maxQuestionTime: number;
  gameStatus: 'selecting-question-set' | 'selecting-level' | 'selecting-starter' | 'in-progress' | 'player-won' | 'computer-won';
  selectedLevel: number;
  currentQuestionSetId: string | null;
}

export type AttackStrength = 'weak' | 'medium' | 'strong' | 'critical';

export interface CharacterIcon {
  id: string;
  name: string;
  description: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}