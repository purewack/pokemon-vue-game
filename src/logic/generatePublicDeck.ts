import axios from "axios";
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateUniqueRandomArray(length, max) {
  // Create an array with numbers from 1 to the specified max
  const numbers = Array.from({ length: max }, (_, index) => index + 1);

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Return the first 'length' elements of the shuffled array
  return numbers.slice(0, length);
}

export default function generatePublicDeck(limit: number = 10) {
  const ids = generateUniqueRandomArray(limit, 500);
  return new Promise<CardData[]>((resolve, reject) => {
    let reqs = Array.from({ length: limit }, (_, i) => {
      return axios.get(`https://pokeapi.co/api/v2/pokemon/${ids[i]}`);
    });
    axios
      .all(reqs)
      .then(
        axios.spread((...responses) => {
          resolve(
            responses.map((pok) => {
              const p = pok.data;
              return {
                id: p.id,
                name: p.name,
                sprite: p.sprites.front_default,
                hp: p.stats[0].base_stat,
                types: p.types.map(
                  (t: { type: { name: string } }) => t.type.name,
                ),
              };
            }),
          );
        }),
      )
      .catch((errors) => {
        reject(errors);
      });
  });
}
