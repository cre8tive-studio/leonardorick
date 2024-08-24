<template>
  <div
    ref="cursorOuterRef"
    class="cursor cursor--large"
  ></div>
  <div
    ref="cursorInnerRef"
    class="cursor cursor--small"
  ></div>
</template>

<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';

const { cursorOuter, cursorInner } = toRefs(useAnimationStore());
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
  &--large {
    // tweak to perfect align large ball
    left: -2.5px;
    top: -2.5px;
    --size: 42px; // this value overrites use-cursor cursorOuterOriginalState
    border: 3px solid $highlight;
  }
  &--small {
    // tweak to perfect align middle ball
    left: -7.24px;
    top: -7.24px;
    --size: 10px;
    background: $highlight;
    transform: translate(-50%, -50%);
  }
}
</style>
