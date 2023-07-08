<template>
  <div></div>
  <!-- <div v-if="loaded">
    <h2>Home</h2>
    <span>loaded: {{ loaded }}</span>
    <form>
      <select v-model="lang">
        <option value="en">{{ $t('english') }}</option>
        <option value="pt-BR">{{ $t('portuguese') }}</option>
      </select>
      <p class="pb-5">
        {{ $t('welcome') }}
      </p>
    </form>
    <div
      v-for="(recommendation, index) in recommendations[lang]"
      :key="recommendation.id"
      class="pb-6"
    >
      {{ $t(`recommendations[${index}].value`) }} - Recommendation: {{ recommendation.author }}
    </div>
    <div
      v-for="(quote, index) in quotes[lang]"
      :key="quote.id"
      class="pb-6"
    >
      {{ $t(`quotes[${index}].value`) }} - {{ quote.author }}
    </div>
  </div> -->
  <div>
    <div
      v-for="recommendation in recommendations"
      :key="recommendation.id"
    >
      {{ recommendation }}
    </div>
  </div>
</template>

<script setup lang="ts">
// import { LANGUAGES } from '../utils/constants/languages';
import type { QuotePerLangModel } from '../types/quote.model';
import type { RecommendationModel } from '../types/recommendation-model';
import { useAppStore } from '~/store';

const store = useAppStore();
// todo: uncommend when i18n is ready
// useLang();
// const i18n = useI18n();

const { loaded, /* lang  */ recommendations /* quotes */ } = toRefs(store);

const { $recommendations /* $quotes */ } = useNuxtApp() as {
  $recommendations: Ref<RecommendationModel[]>;
  $quotes: Ref<QuotePerLangModel>;
};
recommendations.value = $recommendations.value;
// console.log(JSON.parse(JSON.stringify(recommendations.value)));
// quotes.value = $quotes.value;

// todo: see how deal with this when i18n is ready
// LANGUAGES.forEach((language) => {
//   i18n.setLocaleMessage(language, {
//     ...i18n.getLocaleMessage(language),
//     recommendations: recommendations.value?.[language] || [],
//     quotes: quotes.value?.[language] || [],
//   });
// });
loaded.value = true;
</script>
<style scoped></style>
