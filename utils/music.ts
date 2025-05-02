import { getRandomInt } from './js-utilities';

interface Params {
  paidInvoicesCount: number;
  previous: number[];
  demosReady: number[];
  startDemosCount: number;
}

/**
 * Increments the list of available demos by adding new items based on the provided parameters.
 * Ensures that the new list respects the total, limit, and readiness constraints.
 *
 * @param params.previous - The previous list of demos available for a single user
 * @param params.paidInvoicesCount - The number of invoices paid by a single user counting the first one (paid when the user subscribes)
 * @param params.demosReady - The list of demos numbers that are ready to be public and can be considered to be added to the final list.
 * @param params.startDemosCount - The number of demos that should be available for the user right on the subscription succeeded
 * @returns number[] - The updated list of demos, sorted and limited as per the constraints.
 * @throws {Error} - Throws an error if no demos are available to be added.
 */
export function incrementAvailableDemos({ previous, paidInvoicesCount, demosReady, startDemosCount }: Params) {
  // if previoulsy we already had all demos (total), then, just return the same list
  const finalListSize = startDemosCount + Math.max(paidInvoicesCount - 1, 0);
  if (previous.length === demosReady.length || previous.length === finalListSize) {
    return previous.sort();
  }

  const newList = [...previous];
  const available = demosReady.filter((demo) => !previous.includes(demo));
  const limitIndex = Math.min(available.length, finalListSize);

  for (let i = 0; i < limitIndex; i++) {
    const index = getRandomInt(available.length - 1);
    newList.push(...available.splice(index, 1));
  }
  return newList.sort();
}
