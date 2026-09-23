export const BREAKPOINT_OPTIONS = ['sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const;
export type BreakpointOptions = (typeof BREAKPOINT_OPTIONS)[number];

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
      { point: 1536, ref: isXxl, name: 'xxl' },
      { point: 1800, ref: isXxxl, name: 'xxxl' },
    ] as const;
    const queries = breakpoints.map(({ point, ref, name }) => ({
      match: window.matchMedia(`screen and (min-width: ${point}px)`),
      ref,
      name,
    }));

    const updateMatches = () => {
      current.value = 'sm';
      for (const { ref, match, name } of queries) {
        ref.value = match.matches;
        if (match.matches) current.value = name;
      }
    };
    onNuxtReady(() => {
      updateMatches();
      queries.forEach(({ match }) => match.addEventListener('change', updateMatches));
    });

    // runs only if build inside a component and not as a provider
    if (getCurrentInstance()) {
      onUnmounted(() => {
        queries.forEach(({ match }) => match.removeEventListener('change', updateMatches));
      });
    }
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
