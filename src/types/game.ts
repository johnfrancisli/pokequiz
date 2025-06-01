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
  gameStatus: 'selecting-level' | 'selecting-starter' | 'in-progress' | 'player-won' | 'computer-won';
  selectedLevel: number;
}

export interface CharacterIcon {
  id: string;
  name: string;
  description: string;
}