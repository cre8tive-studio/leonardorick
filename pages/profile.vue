<template>
  <div>Profile page!</div>
  <p>edit your subscription</p>
  <button
    class="p-4 bg-neutral-400"
    @click="goToClientPortal"
  >
    go to stripe client portal to manage your subscriptions
  </button>
  <p>your going to be redirected</p>
</template>

<script setup lang="ts">
const { sripeClientPortalLink } = useRuntimeConfig().public;
const goToClientPortal = () => {
  window.open(sripeClientPortalLink, '_blank');
};
</script>

<style scoped></style>
