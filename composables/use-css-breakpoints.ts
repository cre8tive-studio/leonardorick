const useCssBreakpoints = () => {
  const isLg = ref(true);
  if (import.meta.client) {
    const query = window.matchMedia('screen and (min-width: 1024px)');
    isLg.value = query.matches;
    const handler = (e: MediaQueryListEvent) => {
      isLg.value = e.matches;
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
    isLg,
  };
};
export default useCssBreakpoints;
