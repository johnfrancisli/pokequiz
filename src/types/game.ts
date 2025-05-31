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
  iconId: string;
}

export interface GameState {
  playerCharacter: Character;
  computerCharacter: Character;
  currentQuestion: Question | null;
  timeRemaining: number;
  gameStatus: 'not-started' | 'in-progress' | 'player-won' | 'computer-won';
  computerAttackTimer: number;
}

export type AttackStrength = 'weak' | 'medium' | 'strong' | 'critical';

export interface CharacterIcon {
  id: string;
  name: string;
  description: string;
}