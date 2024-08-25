<template>
  <template v-if="isDesktop">
    <div
      ref="cursorOuterRef"
      class="cursor cursor--large"
    />
    <div
      ref="cursorInnerRef"
      class="cursor cursor--small"
    />
  </template>
</template>

<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';

const { cursorOuter, cursorInner } = toRefs(useAnimationStore());
const { isDesktop } = useDevice();
const cursorOuterRef = ref<HTMLDivElement>();
const cursorInnerRef = ref<HTMLDivElement>();

onMounted(() => {
  cursorOuter.value = cursorOuterRef.value;
  cursorInner.value = cursorInnerRef.value;
});
</script>
<style scoped lang="scss">
.cursor {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0.7;
  &--large {
    // tweak to perfect align large ball
    left: -2.5px;
    top: -2.5px;
    --size: 48px; // this value overrites use-cursor cursorOuterOriginalState
    border: 3px solid $highlight;
  }
  &--small {
    // tweak to perfect align middle ball
    left: -1.9px;
    top: -1.9px;
    --size: 16px;
    background: $highlight;
    transform: translate(-50%, -50%);
  }
}
</style>
