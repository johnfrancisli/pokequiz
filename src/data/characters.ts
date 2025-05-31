import { CharacterIcon } from '../types/game';

export const characterIcons: CharacterIcon[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A brave warrior skilled in sword combat'
  },
  {
    id: 'knight',
    name: 'Knight',
    description: 'A noble knight with unwavering honor'
  },
  {
    id: 'samurai',
    name: 'Samurai',
    description: 'A disciplined samurai following the way of the sword'
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'A swift and agile fighter'
  }
];

export const getRandomCharacterIcon = (): CharacterIcon => {
  const randomIndex = Math.floor(Math.random() * characterIcons.length);
  return characterIcons[randomIndex];
};