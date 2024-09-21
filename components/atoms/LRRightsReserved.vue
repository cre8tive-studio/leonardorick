<template>
  <div class="c-LRRightsReserved lr-section-page-paddings">© {{ currentYear }}, {{ $t('all_rights_reserved') }}.</div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
.c-LRRightsReserved {
  margin-top: 5vh;
  padding-bottom: 1rem;
  width: 100%;
  text-align: left;
  @extend .lr-text--label-1-half;
  color: $main-dark-text-hsl-dark;
}
</style>
