import pokemonData from '../data/pokemon.json';
import starterList from '../data/starter.json';

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

export interface StarterPokemon {
  idx: string;
  slug: string;
  name: string;
  imageUrl: string;
}

export const getStarterPokemonList = (): StarterPokemon[] => {
  return starterList.map(starter => {
    const pokemon = pokemonData[starter.idx];
    return {
      idx: starter.idx,
      slug: starter.slug,
      name: pokemon.name.eng,
      imageUrl: `/src/assets/pokemon/regular/${starter.slug}.png`
    };
  });
};

export const getRandomStarter = (): StarterPokemon => {
  const starters = getStarterPokemonList();
  return starters[Math.floor(Math.random() * starters.length)];
};