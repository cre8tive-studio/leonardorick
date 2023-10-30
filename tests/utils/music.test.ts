import { describe, expect, it } from 'vitest';
import { incrementAvailableDemos } from '../../utils/music';

describe('music :: incrementAvailableDemos', () => {
  it('should add a available number when calling', () => {
    const newList = incrementAvailableDemos({ total: 10, previous: [], limit: 3 });
    expect(newList.length).toEqual(3);
  });

  it('should add the only available number if there is only one available', () => {
    const newList = incrementAvailableDemos({ total: 4, previous: [1, 3, 4], limit: 4 });
    expect(newList).toEqual([1, 2, 3, 4]);
  });

  it('should respect the limit of numbers allowed on list', () => {
    const newList = incrementAvailableDemos({ total: 10, previous: [], limit: 2 });
    expect(newList.length).toEqual(2);
  });

  it('should respect the limit of numbers allowed on list and do not change the numbers if the limit is the same as the previous list', () => {
    const newList = incrementAvailableDemos({ total: 4, previous: [1, 3, 4], limit: 3 });
    expect(newList).toEqual([1, 3, 4]);
  });
});
