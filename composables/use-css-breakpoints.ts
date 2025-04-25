export type BreakpointOptions = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

const useCssBreakpoints = () => {
  const isSm = ref(true);
  const isMd = ref(true);
  const isLg = ref(true); // keep true to avoid hydration mistamtch as default is big screens
  const isXl = ref(true);
  const isXxl = ref(true);
  const isXxxl = ref(true);

  const current = ref<BreakpointOptions>();

  if (import.meta.client) {
    const breakpoints = [
      { point: 640, ref: isSm, name: 'sm' },
      { point: 768, ref: isMd, name: 'md' },
      { point: 1024, ref: isLg, name: 'lg' },
      { point: 1280, ref: isXl, name: 'xl' },
      { point: 1536, ref: isXxxl, name: 'xxl' },
      { point: 1800, ref: isXxxl, name: 'xxxl' },
    ];
    const queries = breakpoints.map(({ point, ref, name }, index) => {
      const match = window.matchMedia(`screen and (min-width: ${point}px)`);

      const handler = (e: MediaQueryListEvent) => {
        ref.value = e.matches;
        if (ref.value) {
          current.value = name as BreakpointOptions;
        } else {
          current.value = breakpoints[index > 1 ? index - 1 : index]?.name as BreakpointOptions;
        }
      };

      ref.value = match.matches;
      if (ref.value) {
        current.value = name as BreakpointOptions;
      }
      match.addEventListener('change', handler);

      return { handler, match };
    });

    onUnmounted(() => {
      queries.forEach(({ handler, match }) => match.removeEventListener('change', handler));
    });
  }
  return {
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    isXxxl,
    current,
  };
};
export default useCssBreakpoints;
