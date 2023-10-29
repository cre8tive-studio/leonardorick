import { describe, expect, it } from 'vitest';
import { getExpireTime, isNotExpired } from '../../utils/js-utilities';

describe('js-utilities :: isNotExpired', () => {
  it('should return true if the date is not expired', () => {
    expect(isNotExpired(new Date().getTime() - 10)).toEqual(false);
  });

  it('should return false if the date is expired', () => {
    expect(isNotExpired(new Date().getTime() + 10)).toEqual(true);
  });

  it('should return false if time is 0', () => {
    expect(isNotExpired(0)).toEqual(false);
  });
});

describe('js-utilities :: getExpTime', () => {
  it('should return 15 minutes in the future from now if calling without parameters', () => {
    expect(getExpireTime()).toEqual(new Date().getTime() + 15 * 60 * 1000);
  });

  it('should return 15 minutes in the future related to sent time if time sent', () => {
    const date = new Date().getTime();
    // sending 14 minutes because theres some delay on the function execution
    expect(getExpireTime(date)).toEqual(date + 15 * 60 * 1000);
  });

  it('should convert string to date if string sent', () => {
    expect(getExpireTime('2024-10-23T09:50:50.734+00:00', 0)).toEqual(1729677050734);
  });
});
