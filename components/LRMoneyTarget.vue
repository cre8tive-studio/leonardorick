<template>
  <div
    v-if="settings"
    class="lr-money-target w-full px-12"
  >
    <div class="flex justify-between mb-2 mx-2">
      <div class="value">
        <span>{{ formatCurrency(settings.savedAmount) }}</span>
      </div>
      <div class="value">
        <div>{{ formatCurrency(settings.moneyTarget) }}</div>
      </div>
    </div>
    <div class="bar">
      <div
        ref="completedEl"
        class="completed"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { normalize } from '@leonardorick/utils';
import { gsap } from 'gsap';
import { useAppStore } from '~/store';

const { settings } = toRefs(useAppStore());

const completedEl = ref<HTMLDivElement>();

function formatCurrency(value: number) {
  if (!settings.value) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.value.currency,
  })
    .format(value)
    .replace(/^\D+/g, (match) => `${match} `);
}
onMounted(() => {
  if (!completedEl.value || !settings.value) return;
  gsap.to(completedEl.value, {
    width: `${normalize(settings.value.savedAmount, settings.value.moneyTarget, { max: 100 })}%`,
    duration: 1.6,
  });
});
</script>

<style scoped lang="scss">
.value {
  display: flex;
  gap: 4px;
}

.bar-container {
  width: 80%;
}

.bar,
.completed {
  height: 18px;
  border-radius: 24px;
}

.bar {
  width: 100%;
  background-color: $dark-text-3;
  .completed {
    width: 0%;
    background-color: $main-dark-text;
  }
}
</style>
