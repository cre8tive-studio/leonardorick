import { defineNuxtPlugin, useRouter } from '#app';
import { useAppStore } from '~/store';
import { useAnimationStore } from '~/store/animation';

/**
 * Used to smoothly navigate to the # (hash) relative element id when page is loading.
 * This seems to run only on page loading. The thing that makes <nuxtLink hash navigation smooth is the setup
 * donen in nuxt.config.ts: https://nuxt.com/docs/guide/recipes/custom-routing#scroll-behavior-for-hash-links
 */
export default defineNuxtPlugin(() => {
  const $router = useRouter();
  const { loaded } = toRefs(useAppStore());
  const { isScrollEnabled } = toRefs(useAnimationStore());

  $router.options.scrollBehavior = (to, _from, savedPosition) => {
    if (to.hash) {
      return new Promise((resolve) => {
        useWhenReady(
          loaded,
          () => {
            useWhenReady(isScrollEnabled, () => {
              const element = document.getElementById(to.hash.substring(1)); // Remove the '#' to get the element ID
              if (element) {
                resolve({
                  el: to.hash,
                  top: 30,
                  behavior: 'smooth',
                });
              } else {
                resolve({ top: 0 });
              }
            });
          },
          // we need to run on next tick because when isLRModelLoaded turns true, loaded will also become true,
          // but isScrollEnabled might be enabled yet. So in the next tick it will be disabled to we can run
          // hideOverlay(). Basically we are trying to ensure that isScrollEnabled has the right value before
          // trying to scroll to the hash
          { isNextTick: true }
        );
      });
    } else if (savedPosition) {
      return savedPosition;
    }

    return { top: 0 };
  };
});
