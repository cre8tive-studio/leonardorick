<template>
  <template v-if="loaded">
    <div class="main">
      <h2>Home</h2>
      main page container
      <p class="pb-5">
        {{ $t('welcome') }}
      </p>
    </div>

    <div class="recommendations">
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.id"
        class="border border-gray-300 p-4 m-4"
      >
        <p>
          {{ recommendation.id }} -=- {{ recommendation.author?.name }} -=-
          {{ recommendation.author.description }}
        </p>
        <div>
          <ClientOnly>
            <NuxtImg
              v-if="recommendation.authorImage"
              :width="100"
              :height="100"
              :src="recommendation.authorImage"
            />
          </ClientOnly>
          <p>{{ recommendation.recommendation }}</p>
        </div>
      </div>

      <div
        v-for="quote in quotes"
        :key="quote.id"
      >
        {{ quote }}
      </div>
    </div>
  </template>
  <div v-else>loading...</div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const { loaded, recommendations, quotes } = toRefs(useAppStore());
</script>
<style scoped lang="scss">
.main {
  height: calc(100vh - $header-opened-height);
}
</style>
