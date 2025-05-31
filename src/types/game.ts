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
  gameStatus: 'selecting-level' | 'selecting-starter' | 'in-progress' | 'player-won' | 'computer-won';
  computerAttackTimer: number;
  selectedLevel: number;
}

export type AttackStrength = 'weak' | 'medium' | 'strong' | 'critical';

export interface CharacterIcon {
  id: string;
  name: string;
  description: string;
}