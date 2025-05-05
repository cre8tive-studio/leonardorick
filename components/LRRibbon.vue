<!-- https://css-generators.com/ribbon-shapes/ -->
<template>
  <div
    class="ribbon"
    :class="type"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
type RibbonOptions = 'disabled' | 'featured';
interface Props {
  text: string;
  type: RibbonOptions;
}
const { text, type = 'featured' } = defineProps<Props>();
</script>

<style scoped lang="scss">
.ribbon {
  font-size: 20px; // also control the size of the ribbon
  font-weight: bold;
  color: $main-dark-text;
}
.ribbon {
  --f: 0.4rem; // control the folded part

  position: absolute;
  top: 0;
  left: 0;
  line-height: 1.8;
  padding-inline: 1lh;
  padding-bottom: var(--f);
  border-image: conic-gradient(#0008 0 0) 51% / var(--f);
  --size: 999px;
  clip-path: polygon(
    100% calc(100% - var(--f)),
    100% 100%,
    calc(100% - var(--f)) calc(100% - var(--f)),
    var(--f) calc(100% - var(--f)),
    0 100%,
    0 calc(100% - var(--f)),
    999px calc(100% - var(--f) - 999px),
    calc(100% - 999px) calc(100% - var(--f) - 999px)
  );
  transform: translate(calc((cos(45deg) - 1) * 100%), -100%) rotate(-45deg);
  transform-origin: 100% 100%;

  background-color: $secondary-dark-text;

  &.featured {
    background-color: $highlight; /* the main color  */
  }
}
</style>
