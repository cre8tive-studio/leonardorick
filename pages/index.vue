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
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '../utils/constants/languages';
import { useAppStore } from '~/store';

const i18n = useI18n();
const store = useAppStore();
const { loaded, lang, recommendations, quotes } = toRefs(store);

useLang();

await Promise.all([store.initRecommendations(), store.initQuotes()]).then(([qt, rc]) => {
  LANGUAGES.forEach((language) => {
    i18n.setLocaleMessage(language, {
      ...i18n.getLocaleMessage(language),
      recommendations: rc.value?.[language] || [],
      quotes: qt.value?.[language] || [],
    });
  });
});

loaded.value = true;
</script>
<style scoped></style>
