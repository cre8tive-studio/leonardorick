<template>
  <div
    ref="container"
    class="wave-placeholder"
  >
    <span />
    <svg
      v-if="heights.length"
      class="wave-skeleton"
      :viewBox="`0 0 ${heights.length * STEP} ${MAX_HEIGHT}`"
      preserveAspectRatio="none"
    >
      <rect
        v-for="(h, i) in heights"
        :key="i"
        :x="i * STEP"
        :y="MAX_HEIGHT / 2 - h / 2"
        :width="BAR_WIDTH"
        :height="h"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
/* visual constants – tweak to taste */
const BAR_WIDTH = 3; // px
const GAP_WIDTH = 2; // px
const STEP = BAR_WIDTH + GAP_WIDTH; // one column
const MAX_HEIGHT = 100; // SVG viewBox height

const container = ref<HTMLElement | null>(null);
const heights = ref<number[]>([]);

function makeHeights(bars: number) {
  /* Example generator: random(20-90). Replace with your own logic */
  return Array.from({ length: bars }, () => Math.floor(20 + Math.random() * 60));
}

let ro: ResizeObserver | undefined;

onMounted(() => {
  if (!container.value) throw new Error('Container not availabel during mounting');
  const update = () => {
    if (!container.value) return;
    const widthPx = container.value.clientWidth;
    const bars = Math.max(1, Math.floor(widthPx / STEP));
    heights.value = makeHeights(bars);
  };

  update(); // initial
  ro = new ResizeObserver(update); // react to resize / breakpoint change

  ro.observe(container.value);
});

onUnmounted(() => ro?.disconnect());
</script>
<style scoped lang="scss">
.wave-placeholder {
  position: relative;
  /* tie into your existing custom properties in the parent wave component */
  width: 100%;
  height: var(--wave-container-height);

  display: flex; /* centers the SVG */
  align-items: center;
  justify-content: center;

  border-radius: 6px;
  //   overflow: hidden; /* rounds the bars too */
  opacity: 0.7;

  span {
    position: absolute;
    height: 100%;
    width: 4px;
    background-color: $dark-text-3;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  svg {
    fill: $dark-text-4;
    width: 100%;
    height: 100%;
  }
}
</style>
