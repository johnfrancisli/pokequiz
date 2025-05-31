import pokemonDataArray from '../data/pokemon.json';
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

// Create a map for O(1) lookup of pokemon data by idx
const pokemonDataMap: { [key: string]: PokemonData } = (pokemonDataArray.pokemon || []).reduce((acc, pokemon: PokemonData) => {
  acc[pokemon.idx] = pokemon;
  return acc;
}, {} as { [key: string]: PokemonData });

export interface StarterPokemon {
  idx: string;
  slug: string;
  name: string;
  imageUrl: string;
}

export const getStarterPokemonList = (): StarterPokemon[] => {
  return starterList.map(starter => {
    const pokemon = pokemonDataMap[starter.idx];
    if (!pokemon) {
      // Provide fallback data if pokemon is not found
      return {
        idx: starter.idx,
        slug: starter.slug,
        name: 'Unknown Pokemon',
        imageUrl: `/src/assets/pokemon/unknown.png`
      };
    }
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