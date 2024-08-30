<template>
  <div class="s-LRCompetencesSection lr-section-page relative">
    <h2>Being a nerd for</h2>
    <p>{{ formattedYearsText }}</p>
    <p>{{ formattedMonthsText }}</p>
    <p>{{ formattedDaysText }}</p>
  </div>
</template>

<script setup lang="ts">
import { dateDifference } from '~/utils/js-utilities';
const $t = useNuxtApp().$i18n.t;

// date I started woking. 9 in the morning in brazil is 12 in GMT+0;
const initialDate = new Date('2018-07-01T12:00:00.000Z');
const now = new Date();

const { years, months, days } = dateDifference(initialDate, now);

const formattedYearsText = computed(() => `${years} ${$t('year', years).toLocaleLowerCase()}`);
const formattedMonthsText = computed(() => `${months} ${$t('month', months).toLocaleLowerCase()}`);
const formattedDaysText = computed(() => `${days} ${$t('day', days).toLocaleLowerCase()}`);
</script>

<style scoped lang="scss">
.s-LRCompetencesSection {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: $blue-3;
}
@media (min-width: $lg-breakpoint) {
  .s-LRCompetencesSection {
    h2 {
      font-size: 2rem;
    }
    p {
      font-size: 5rem;
      line-height: 5rem;
    }
  }
}
</style>
