import pokemonDataArray from '../data/pokemon.json';
import starterList from '../data/starter.json';
import { useLanguage } from '../context/LanguageContext';

const getImagePath = (pokemonSlug: string) => {
  return new URL(`/src/assets/pokemon/regular/${pokemonSlug}.png`, import.meta.url).href;
};

export interface PokemonData {
  idx: string;
  name: {
    eng: string;
    jpn: string;
    jpn_ro: string;
  };
  slug: {
    eng: string;
    jpn: string;
    jpn_ro: string;
  };
}

// Create a map for O(1) lookup of pokemon data by idx
const pokemonDataMap: { [key: string]: PokemonData } = Object.entries(pokemonDataArray).reduce((acc, [idx, pokemon]) => {
  acc[idx] = {
    idx,
    name: pokemon.name,
    slug: pokemon.slug
  };
  return acc;
}, {} as { [key: string]: PokemonData });

export interface StarterPokemon {
  idx: string;
  slug: string;
  name: string;
  imageUrl: string;
  names: {
    eng: string;
    jpn: string;
  };
}

export const getStarterPokemonList = (language: 'en' | 'ja'): StarterPokemon[] => {
  return starterList.map(starter => {
    const pokemon = pokemonDataMap[starter.idx];
    if (!pokemon) {
      // Provide fallback data if pokemon is not found
      return {
        idx: starter.idx,
        slug: starter.slug,
        name: '???',
        imageUrl: `/src/assets/pokemon/unknown.png`,
        names: {
          eng: '???',
          jpn: '???'
        }
      };
    }
    return {
      idx: starter.idx,
      slug: starter.slug,
      name: language === 'en' ? pokemon.name.eng : pokemon.name.jpn,
      imageUrl: getImagePath(starter.slug),
      names: {
        eng: pokemon.name.eng,
        jpn: pokemon.name.jpn
      }
    };
  });
};

export const getRandomStarter = (language: 'en' | 'ja'): StarterPokemon => {
  const starters = getStarterPokemonList(language);
  return starters[Math.floor(Math.random() * starters.length)];
};