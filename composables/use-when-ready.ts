/**
 * Composable just to facilitate watching something that usually we want to run only once but with some nuances. 1) Usually we want
 * to watch only if the value is not ready, but if it's ready we want to execute right away. 2) Also, we don't want to watch once if the
 * value is false. We want to execute always when the value is ready. The composable cam be improved to run only when it's fale by adding another
 * option property. 3) Sometimes we want to run on the next tick. Use this composable if you have this scenario that can repeat a lot, for example
 * to wait something to be loaded and then run a callback.
 * @param source Something to be watched. can be improved later to validate more things that can be watched,
 * but to ensure consistency, would be important that the object has the obj: { value: something} structure
 * @param callback  function to run if the value is ready.
 * @param options
 *  - isNexttick: to run on next vue tick
 */
const useWhenready = (source: globalThis.Ref, callback: () => void, { isNextTick = false } = {}) => {
  if (source.value) {
    callback();
  } else {
    const unwatch = watch(source, () => {
      if (source.value) {
        if (isNextTick) {
          nextTick(() => {
            callback();
            unwatch();
          });
        } else {
          callback();
          unwatch();
        }
      }
    });
  }
};

export default useWhenready;