import { getRandomInt } from './js-utilities';

interface Params {
  total: number;
  limit?: number;
  previous: number[];
}

export function incrementAvailableDemos({ total, previous, limit }: Params) {
  // if previoulsy we already had all demos (total), then, just return the same list
  if (previous.length === total || previous.length === limit) {
    return previous;
  }

  // all available numbers except the ones that are already on previous
  const available = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !previous.includes(n));

  // if we are starting the list, add three items.
  // if we are not starting the list, add one item
  const newList = [...previous];
  for (let i = 0; i < (previous.length === 0 ? 3 : 1); i++) {
    const index = getRandomInt(available.length - 1);
    const newNumber = available[index];
    if (newNumber) {
      newList.push(newNumber);
    }
  }
  return newList.sort((a, b) => a - b).filter((_, i) => i < (limit || total));
}
