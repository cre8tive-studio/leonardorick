<template>
  <div>
    <h2>Home</h2>
    <span>loading: {{ loading }}</span>
    <form>
      <select v-model="locale">
        <option value="en">en</option>
        <option value="pt-BR">Portuguese</option>
      </select>
      <p class="pb-5">
        {{ $t('welcome') }}
      </p>
    </form>
    <div>
      quotes:
      <div>
        {{ quotes }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import useLang from '~/hooks/use-lang';

const store = useAppStore();
const { locale } = useLang(() => store.initQuotes());
const { loading, quotes } = toRefs(store);

await store.initQuotes();
</script>
<style scoped></style>
