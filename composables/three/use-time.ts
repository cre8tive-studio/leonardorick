const useTime = () => {
  const start = Date.now();
  const elapsed = ref(0);
  let current = start;
  // the default screens are running at 60 fps and at 60 fps the
  // time it takes between each frame is 16.6666666667 milliseconds
  let delta = 16;

  requestAnimationFrame(tick);

  function tick() {
    const currentTime = Date.now();
    delta = currentTime - current;
    current = currentTime;
    elapsed.value = current - start;
    requestAnimationFrame(tick);
  }
  return {
    delta,
    tick: computed(() => elapsed.value),
  };
};
export default useTime;
