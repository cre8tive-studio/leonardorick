import { /* FloatingVue  */ vTooltip } from 'floating-vue';
import { defineNuxtPlugin } from '#app';
import 'floating-vue/dist/style.css'; // 0.8 kB CSS

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.vueApp.use(FloatingVue, {
  //   themes: {
  //     tooltip: {
  //       delay: {
  //         hide: 10000000,
  //       },
  //     },
  //   },
  // });
  nuxtApp.vueApp.directive('tooltip', vTooltip);
});
