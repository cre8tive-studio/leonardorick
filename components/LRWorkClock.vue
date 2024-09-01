<template>
  <div class="c-LRWorkClock relative">
    <h2>{{ $t('being_nerd_for') }}</h2>
    <p>{{ formattedYearsText }}</p>
    <p>{{ formattedMonthsText }}</p>
    <p>{{ formattedDaysText }}</p>
    <p>{{ formattedHoursText }}</p>
    <p>{{ formattedMinutesText }}</p>
    <p>{{ formattedSecondsText }}</p>
  </div>
</template>

<script setup lang="ts">
import { dateDifference } from '~/utils/js-utilities';
const $t = useNuxtApp().$i18n.t;

// date I started woking. 9 in the morning in brazil is 12 in GMT+0;
const initialDate = new Date('2018-07-01T12:00:00.000Z');
const years = ref(0);
const months = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const formattedYearsText = computed(() => getText(years.value, 'year'));
const formattedMonthsText = computed(() => getText(months.value, 'month'));
const formattedDaysText = computed(() => getText(days.value, 'day'));
const formattedHoursText = computed(() => getText(hours.value, 'hour'));
const formattedMinutesText = computed(() => getText(minutes.value, 'minute'));
const formattedSecondsText = computed(() => getText(seconds.value, 'second'));

onMounted(() => {
  updateDifference();
  const interval = setInterval(updateDifference, 1000);
  onUnmounted(() => clearInterval(interval));
});

function getText(value: number, label: string) {
  return value ? `${value} ${$t(label, value).toLocaleLowerCase()}` : '';
}

function updateDifference() {
  const now = new Date();
  const { years: y, months: m, days: d, hours: h, minutes: min, seconds: sec } = dateDifference(initialDate, now);
  years.value = y;
  months.value = m;
  days.value = d;
  hours.value = h;
  minutes.value = min;
  seconds.value = sec;
}
</script>

<style scoped lang="scss">
.c-LRWorkClock {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: $highlight;
}
@media (min-width: $lg-breakpoint) {
  .c-LRWorkClock {
    h2 {
      font-size: min(1vw, 4rem);
    }
    p {
      // font-size: 4rem;
      font-size: min(2.5vw, 6rem);
      line-height: min(2.5vw, 6rem);
    }
  }
}
</style>
