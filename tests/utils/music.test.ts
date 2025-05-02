import { describe, expect, it } from 'vitest';
import { incrementAvailableDemos } from '../../utils/music';

describe('music :: incrementAvailableDemos', () => {
  it('should add startDemosCount quantity of items if its starting the list', () => {
    const demosReady = [1, 2, 3, 4];
    const newList = incrementAvailableDemos({
      previous: [],
      paidInvoicesCount: 1,
      demosReady,
      startDemosCount: 3,
    });
    expect(newList).length(3);
    expect(demosReady).contain(newList[0]);
    expect(demosReady).contain(newList[1]);
    expect(demosReady).contain(newList[2]);
  });

  it('should add the only available number if there is only one available and its the second invoice', () => {
    const newList = incrementAvailableDemos({
      previous: [1, 3, 4],
      paidInvoicesCount: 2,
      demosReady: [1, 2, 3, 4],
      startDemosCount: 3,
    });
    expect(newList).toEqual([1, 2, 3, 4]);
  });

  it('should limit the final list to demosReady size if its less than startDemosCount', () => {
    const newList = incrementAvailableDemos({
      previous: [],
      paidInvoicesCount: 0,
      demosReady: [1, 11],
      startDemosCount: 3,
    });
    expect(newList).toEqual([1, 11]);
  });

  it('should add nothing if the number of invoices paid is 1 (just the first one)', () => {
    const newList = incrementAvailableDemos({
      previous: [4, 3, 1],
      paidInvoicesCount: 1,
      demosReady: [1, 2, 3, 4],
      startDemosCount: 3,
    });
    expect(newList).toEqual([1, 3, 4]);
  });

  it('should add all the available items if the number of paid invoices exceeds the demosReady', () => {
    const newList = incrementAvailableDemos({
      previous: [1, 3, 4],
      paidInvoicesCount: 5,
      demosReady: [1, 2, 3, 4, 7, 9],
      startDemosCount: 3,
    });
    expect(newList).toEqual([1, 2, 3, 4, 7, 9]);
  });

  it('should respect the limit of numbers allowed on list based on startDemosCount and paidInvoicesCount', () => {
    const demosReady = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13];
    const newList = incrementAvailableDemos({
      demosReady,
      previous: [],
      paidInvoicesCount: 2,
      startDemosCount: 3,
    });
    expect(newList.length).toEqual(4);
    newList.forEach((item) => expect(demosReady).contain(item));
  });

  it('should respect the limit of numbers allowed on list based on startDemosCount and paidInvoicesCount and do not change the list if limit reached', () => {
    const newList = incrementAvailableDemos({
      demosReady: [1, 2, 3, 4],
      previous: [1, 3, 4],
      paidInvoicesCount: 0,
      startDemosCount: 3,
    });
    expect(newList).toEqual([1, 3, 4]);
  });

  it('should return only 2 if total is 2', () => {
    const newList = incrementAvailableDemos({
      demosReady: [1, 2],
      previous: [],
      paidInvoicesCount: 1000,
      startDemosCount: 3000,
    });
    expect(newList).toEqual([1, 2]);
  });

  it('should increment the list with the remaining demo in demosReady if only one is remaining', () => {
    const newList = incrementAvailableDemos({
      previous: [3, 4, 5, 9],
      paidInvoicesCount: 3,
      demosReady: [3, 4, 5, 7, 9],
      startDemosCount: 3,
    });
    expect(newList).toEqual([3, 4, 5, 7, 9]);
  });
});
