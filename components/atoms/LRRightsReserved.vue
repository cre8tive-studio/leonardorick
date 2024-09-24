<template>
  <div class="c-LRRightsReserved lr-section-page-paddings">© {{ currentYear }}, {{ $t('all_rights_reserved') }}.</div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
.c-LRRightsReserved {
  margin-top: 3vh;
  padding-bottom: 1rem;
  width: 100% !important;
  text-align: left;
  @extend .lr-text--label-0-half;
  color: $main-dark-text-hsl-dark;
}
@media screen and (max-width: $lg-breakpoint) {
  .c-LRRightsReserved {
    text-align: center;
  }
}
</style>
