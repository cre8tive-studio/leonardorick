import { describe, expect, it } from 'vitest';
import { incrementAvailablePreviews } from '../../utils/music';

describe('music :: incrementAvailablePreviews', () => {
  it('should add startPreviewsCount quantity of items if its starting the list', () => {
    const previewsReady = [1, 2, 3, 4];
    const newList = incrementAvailablePreviews({
      previous: [],
      paidInvoicesCount: 1,
      previewsReady,
      startPreviewsCount: 3,
    });
    expect(newList).length(3);
    expect(previewsReady).contain(newList[0]);
    expect(previewsReady).contain(newList[1]);
    expect(previewsReady).contain(newList[2]);
  });

  it('should add the only available number if there is only one available and its the second invoice', () => {
    const newList = incrementAvailablePreviews({
      previous: [1, 3, 4],
      paidInvoicesCount: 2,
      previewsReady: [1, 2, 3, 4],
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([1, 2, 3, 4]);
  });

  it('should limit the final list to previewsReady size if its less than startPreviewsCount', () => {
    const newList = incrementAvailablePreviews({
      previous: [],
      paidInvoicesCount: 0,
      previewsReady: [1, 11],
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([1, 11]);
  });

  it('should add nothing if the number of invoices paid is 1 (just the first one)', () => {
    const newList = incrementAvailablePreviews({
      previous: [4, 3, 1],
      paidInvoicesCount: 1,
      previewsReady: [1, 2, 3, 4],
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([1, 3, 4]);
  });

  it('should add all the available items if the number of paid invoices exceeds the previewsReady', () => {
    const newList = incrementAvailablePreviews({
      previous: [1, 3, 4],
      paidInvoicesCount: 5,
      previewsReady: [1, 2, 3, 4, 7, 9],
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([1, 2, 3, 4, 7, 9]);
  });

  it('should respect the limit of numbers allowed on list based on startPreviewsCount and paidInvoicesCount', () => {
    const previewsReady = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13];
    const newList = incrementAvailablePreviews({
      previewsReady,
      previous: [],
      paidInvoicesCount: 2,
      startPreviewsCount: 3,
    });
    expect(newList.length).toEqual(4);
    newList.forEach((item) => expect(previewsReady).contain(item));
  });

  it('should respect the limit of numbers allowed on list based on startPreviewsCount and paidInvoicesCount and do not change the list if limit reached', () => {
    const newList = incrementAvailablePreviews({
      previewsReady: [1, 2, 3, 4],
      previous: [1, 3, 4],
      paidInvoicesCount: 0,
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([1, 3, 4]);
  });

  it('should return only 2 if total is 2', () => {
    const newList = incrementAvailablePreviews({
      previewsReady: [1, 2],
      previous: [],
      paidInvoicesCount: 1000,
      startPreviewsCount: 3000,
    });
    expect(newList).toEqual([1, 2]);
  });

  it('should increment the list with the remaining preview in previewsReady if only one is remaining', () => {
    const newList = incrementAvailablePreviews({
      previous: [3, 4, 5, 9],
      paidInvoicesCount: 3,
      previewsReady: [3, 4, 5, 7, 9],
      startPreviewsCount: 3,
    });
    expect(newList).toEqual([3, 4, 5, 7, 9]);
  });
});
