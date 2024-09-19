<template>
  <div
    ref="self"
    class="c-LRColorfulTile"
  >
    <div class="background-fade-tile fade-top" />
    <div class="main-container">
      <div
        aria-hidden="true"
        class="squares-container flex flex-wrap"
      >
        <div
          v-for="index in 850"
          :key="index"
          :id="`${index}`"
          class="square"
        ></div>
      </div>
      <div
        aria-hidden="true"
        class="quotes-gradient-background"
      />
    </div>
    <div class="background-fade-tile fade-bottom" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  colors: string[];
  backgroundColor: string;
}

const { colors, backgroundColor } = defineProps<Props>();
const self = ref<HTMLDivElement>();

onMounted(() => {
  if (self.value) {
    self.value.style.setProperty('--tiles-background-color', backgroundColor);
    for (const [index, color] of colors.entries()) {
      self.value.style.setProperty(`--tiles-color-${index + 1}`, color);
    }
  }
});
</script>

<style scoped lang="scss">
// todo move to a component
// https://codepen.io/Hyperplexed/pen/RwzGKwy
.c-LRColorfulTile {
  .main-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;

    perspective: 1900px;
    overflow: hidden;

    .squares-container {
      position: relative;
      top: -23%;
      left: -20%;
      height: 1600px;
      width: 3341px;

      background-color: color-mix(in srgb, var(--tiles-background-color) 70%, transparent);
      opacity: 0.7;

      transform: rotateX(45deg) rotateY(-8deg) rotateZ(20deg) scale(1.25);

      &:after,
      &:before {
        content: '';
        position: absolute;
        inset: 0px;
        pointer-events: none;
      }

      &:before {
        background-image: url('~/assets/icons/plus-pattern-center.webp');
        // adjust this values to
        background-size: 160px;
        background-repeat: repeat;
        opacity: 0.14;
      }
      .square {
        position: relative;
        min-width: 5rem;
        height: 5rem;
        border: 1px solid rgba($main-dark-text, 0.25);

        transition-duration: 1500ms;
        &:hover,
        &.hovered {
          transition-duration: 0ms;
          &:nth-child(4n) {
            background-color: var(--tiles-color-2);
          }
          &:nth-child(4n + 1) {
            background-color: var(--tiles-color-3);
          }
          &:nth-child(4n + 2) {
            background-color: var(--tiles-color-4);
          }
          &:nth-child(4n + 3) {
            background-color: var(--tiles-color-5);
          }

          &:nth-child(7n) {
            background-color: var(--tiles-color-2);
          }

          &:nth-child(7n + 3) {
            background-color: var(--tiles-color-3);
          }

          &:nth-child(7n + 5) {
            background-color: var(--tiles-color-4);
          }

          &:nth-child(7n + 6) {
            background-color: var(--tiles-color-5);
          }

          &:nth-child(11n + 1) {
            background-color: var(--tiles-color-5);
          }

          &:nth-child(11n + 4) {
            background-color: var(--tiles-color-2);
          }

          &:nth-child(11n + 7) {
            background-color: var(--tiles-color-3);
          }

          &:nth-child(11n + 10) {
            background-color: var(--tiles-color-4);
          }
        }
      }
    }

    .quotes-gradient-background {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      background: linear-gradient(
        0deg,
        var(--tiles-background-color) 5%,
        rgba(#000, 0) 50%,
        var(--tiles-background-color) 95%
      );
    }
  }
}
.background-fade-tile {
  position: absolute;
  left: 0;
  pointer-events: none;
  background: $main-dark-bg;
  height: 100%;
  width: 100%;
  &.fade-top {
    top: -100%;
    background: linear-gradient(0deg, var(--tiles-background-color) 0%, rgba(#000, 0) 25%);
  }
  &.fade-bottom {
    top: 100%;
    background: linear-gradient(180deg, var(--tiles-background-color) 0%, rgba(#000, 0) 25%);
  }
}
</style>
