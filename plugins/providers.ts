export type CssBreakpoints = ReturnType<typeof useCssBreakpoints>;

export const PROVIDERS = {
  cssBreakpoints: 'cssBreakpoints',
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide(PROVIDERS.cssBreakpoints, useCssBreakpoints());
});

export function useInjectCssBreakpoints(): CssBreakpoints {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$cssBreakpoints;
}
