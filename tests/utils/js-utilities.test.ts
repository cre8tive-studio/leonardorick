import { describe, expect, it } from 'vitest';
import { isNotExpired } from '../../utils/js-utilities';

describe('js-utilities :: isNotExpired', () => {
  it('should return true if the date is not expired', () => {
    // current time -----------> 20:20 (just for example)
    // createdAt --------------> 20:10
    // expire time ------------> 20:34
    // function:
    // 20:10 > 20:20 - 14 -----> 20:06 (true, not expired)
    expect(isNotExpired(new Date().getTime() - 10 * 60 * 1000)).toEqual(true);
  });

  it('should return false if the date is expired', () => {
    // current time -----------> 20:20 (just for example)
    // createdAt --------------> 20:05
    // expire time ------------> 20:34
    // function:
    // 20:05 > 20:20 - 14 -----> 20:06 (false, expired)
    expect(isNotExpired(new Date().getTime() - 15 * 60 * 1000)).toEqual(false);
  });
});
