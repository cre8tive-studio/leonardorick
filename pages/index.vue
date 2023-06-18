<template>
  <div v-if="loaded">
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
  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '../utils/constants/languages';
import { QuotePerLangModel } from '../types/quote-per-lang.model';
import { useAppStore } from '~/store';

const store = useAppStore();
useLang();
const i18n = useI18n();

const { loaded, lang, recommendations, quotes } = toRefs(store);

const { $recommendations, $quotes } = useNuxtApp() as {
  $recommendations: Ref<QuotePerLangModel>;
  $quotes: Ref<QuotePerLangModel>;
};
recommendations.value = $recommendations.value;
quotes.value = $quotes.value;

LANGUAGES.forEach((language) => {
  i18n.setLocaleMessage(language, {
    ...i18n.getLocaleMessage(language),
    recommendations: recommendations.value?.[language] || [],
    quotes: quotes.value?.[language] || [],
  });
});
loaded.value = true;
</script>
<style scoped></style>
