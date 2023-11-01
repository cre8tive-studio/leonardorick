<template>
  <div v-if="loaded">
    <h2>Home</h2>
    <p class="pb-5">
      {{ $t('welcome') }}
    </p>

    <div>
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

      <br />

      <div
        v-for="quote in quotes"
        :key="quote.id"
      >
        {{ quote }}
      </div>
    </div>
  </div>
  <div v-else>loading...</div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const { loaded, recommendations, quotes } = toRefs(useAppStore());
</script>
<style scoped></style>
