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
    >
      {{ $t(`recommendations[${index}].value`) }}
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const i18n = useI18n();
const store = useAppStore();
const { loaded, recommendations, lang } = toRefs(store);

useLang();

// todo:  deal better with loaded.value when calling other apis
await store.initRecommendations().then((res) => {
  if (res.value) {
    Object.entries(res.value).forEach(([key, recommendations]) => {
      i18n.setLocaleMessage(key, {
        ...i18n.getLocaleMessage(key),
        recommendations,
      });
    });
  }
});
loaded.value = true;
</script>
<style scoped></style>
