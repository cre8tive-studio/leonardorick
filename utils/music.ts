import { getRandomInt } from './js-utilities';

interface Params {
  paidInvoicesCount: number;
  previous: number[];
  previewsReady: number[];
  startPreviewsCount: number;
}

/**
 * Increments the list of available previews by adding new items based on the provided parameters.
 * Ensures that the new list respects the total, limit, and readiness constraints.
 *
 * @param params.previous - The previous list of previews available for a single user
 * @param params.paidInvoicesCount - The number of invoices paid by a single user counting the first one (paid when the user subscribes)
 * @param params.previewsReady - The list of previews numbers that are ready to be public and can be considered to be added to the final list.
 * @param params.startPreviewsCount - The number of previews that should be available for the user right on the subscription succeeded
 * @returns number[] - The updated list of previews, sorted and limited as per the constraints.
 * @throws {Error} - Throws an error if no previews are available to be added.
 */
export function incrementAvailablePreviews({ previous, paidInvoicesCount, previewsReady, startPreviewsCount }: Params) {
  // if previoulsy we already had all previews (total), then, just return the same list
  const finalListSize = startPreviewsCount + Math.max(paidInvoicesCount - 1, 0);
  if (previous.length === previewsReady.length || previous.length === finalListSize) {
    return previous.sort();
  }

  const newList = [...previous];
  const available = previewsReady.filter((preview) => !previous.includes(preview));
  const limitIndex = Math.min(available.length, finalListSize);

  for (let i = 0; i < limitIndex; i++) {
    const index = getRandomInt(available.length - 1);
    newList.push(...available.splice(index, 1));
  }
  return newList.sort();
}
