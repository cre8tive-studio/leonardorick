<template>
  <div class="c-LRColorfulTile">
    <div
      aria-hidden="true"
      class="squares-container flex flex-wrap"
    >
      <div
        v-for="index in 800"
        :key="index"
        class="square"
      ></div>
    </div>
    <div
      aria-hidden="true"
      class="quotes-gradient-background"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
// todo move to a component
// https://codepen.io/Hyperplexed/pen/RwzGKwy
.c-LRColorfulTile {
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
    top: -26%;
    left: -28%;
    height: 1600px;
    width: 3341px;

    background-color: rgba($main-dark-bg, 0.7);
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
      &:hover {
        transition-duration: 0ms;
        &:nth-child(4n) {
          background-color: $blue-2;
        }
        &:nth-child(4n + 1) {
          background-color: $blue-3;
        }
        &:nth-child(4n + 2) {
          background-color: $blue-4;
        }
        &:nth-child(4n + 3) {
          background-color: $blue-5;
        }

        &:nth-child(7n) {
          background-color: $blue-2;
        }

        &:nth-child(7n + 3) {
          background-color: $blue-3;
        }

        &:nth-child(7n + 5) {
          background-color: $blue-4;
        }

        &:nth-child(7n + 6) {
          background-color: $blue-5;
        }

        &:nth-child(11n + 1) {
          background-color: $blue-5;
        }

        &:nth-child(11n + 4) {
          background-color: $blue-2;
        }

        &:nth-child(11n + 7) {
          background-color: $blue-3;
        }

        &:nth-child(11n + 10) {
          background-color: $blue-4;
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
    background: $main-dark-bg;
    pointer-events: none;
    background: linear-gradient(0deg, $main-dark-bg 5%, rgba(#fff, 0) 50%, $main-dark-bg 95%);
  }
}
</style>
