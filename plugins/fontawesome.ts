// https://docs.fontawesome.com/web/use-with/vue/use-with#nuxt
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

export default defineNuxtPlugin((nuxtApp) => {
  library.add(fas, far);
  config.autoAddCss = false;
  nuxtApp.vueApp.component('fa', FontAwesomeIcon);
});
