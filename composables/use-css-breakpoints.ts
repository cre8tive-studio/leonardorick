const useCssBreakpoints = () => {
  const isXl = ref(true);
  if (import.meta.client) {
    const query = window.matchMedia('screen and (min-width: 1280px)');
    isXl.value = query.matches;
    const handler = (e: MediaQueryListEvent) => {
      isXl.value = e.matches;
    };
    query.addEventListener('change', handler);
    onUnmounted(() => {
      query.removeEventListener('change', handler);
    });

    onUnmounted(() => {
      query.removeEventListener('change', handler);
    });
  }
  return {
    isXl,
  };
};
export default useCssBreakpoints;
