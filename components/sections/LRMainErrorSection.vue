<template>
  <div class="s-LRMainErrorSection lr-section-page">
    <div>
      <h1 class="section-h1">{{ $t('main_error_title') }} :(</h1>
      <h2>{{ $t('main_error_subtitle') }}</h2>
    </div>
  </div>
  <div class="lr-section-page"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.s-LRMainErrorSection {
  display: flex;
  align-items: flex-end;
  justify-content: center;

  div {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-bottom: 7rem;
  }
  h2 {
    letter-spacing: 0.3rem;
    padding-inline: 8rem;
  }
}
</style>
