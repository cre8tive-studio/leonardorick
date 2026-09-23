import { afterEach, describe, expect, it, vi } from 'vitest';
import useWhenReady from '../../composables/use-when-ready';

afterEach(() => vi.unstubAllGlobals());

describe('useWhenReady', () => {
  it('schedules an already-ready callback on the requested DOM tick', () => {
    vi.stubGlobal('isRef', () => false);
    const nextTick = vi.fn();
    vi.stubGlobal('nextTick', nextTick);
    const callback = vi.fn();

    useWhenReady(() => true, callback, { isNextTick: true });

    expect(callback).not.toHaveBeenCalled();
    expect(nextTick).toHaveBeenCalledWith(callback);
  });

  it('runs an already-ready callback immediately by default', () => {
    vi.stubGlobal('isRef', () => false);
    const callback = vi.fn();

    useWhenReady(() => true, callback);

    expect(callback).toHaveBeenCalledOnce();
  });
});
