<template>
  <ClientOnly>
    <teleport to="body">
      <transition name="transition-fade">
        <div
          v-if="shouldShowModal"
          ref="modalEl"
          class="modal"
        >
          <div class="header">
            <div
              lr-cursor
              class="close"
              @click="close"
            >
              <fa icon="close" />
            </div>
          </div>
          <div
            ref="innerEl"
            class="inner"
            v-bind="attrs"
            @click.stop
          >
            <slot></slot>
          </div>
        </div>
      </transition>
    </teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import Lenis from 'lenis';
import { useAnimationStore } from '~/store/animation';

interface Emits {
  (e: 'close'): void;
}
interface Props {
  shouldShowModal: boolean;
  maxWidth?: string;
  height?: string;
  enableModalScroll?: boolean;
}

const attrs = useAttrs();
const $emit = defineEmits<Emits>();
const { shouldShowModal, maxWidth = '80%', height = '75vh', enableModalScroll = true } = defineProps<Props>();

const { enableScroll, disableScroll } = useAnimationStore();

const modalEl = ref<HTMLDivElement>();
const innerEl = ref<HTMLDivElement>();
const modalLenis = ref<Lenis>();
const mounted = ref(false);
// on mounted here is only the first time the modal opens, that's why
// we need this logic around watching shouldShowModal. This solution
// consider a modal that migiht be opened right on the first screen
// and that's why we need {immediate: true}
onMounted(() => {
  watch(
    () => shouldShowModal,
    async (isOpen) => {
      if (!import.meta.client) return;
      await nextTick();

      // acts like onMounted
      if (isOpen) {
        if (!modalEl.value) return;
        modalEl.value.style.setProperty('--max-width', maxWidth);
        modalEl.value.style.setProperty('--height', height);
        disableScroll({ blockTogglingScroll: true });

        if (enableModalScroll) {
          modalLenis.value = new Lenis({
            autoRaf: true,
            duration: 1.4,
            wrapper: innerEl.value,
            content: innerEl.value,
          });
        }
        mounted.value = true;
        // acts like onUnmounted
      } else if (mounted.value) {
        enableScroll({ blockTogglingScroll: false });
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  if (!modalLenis.value) return;
  modalLenis.value.destroy();
  enableScroll({ blockTogglingScroll: false });
});

function close() {
  $emit('close');
}
</script>

<style scoped lang="scss">
.modal {
  --max-width: 80%;
  --height: 75vh;
  color: $main-dark-text;
  position: fixed; // if you someday try to change this approach, please test opening the modal after scrolling
  top: 0;
  left: 0;
  height: auto;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 8.4rem;

  background-color: rgba($main-dark-bg, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 100;
  transition: color 0.3s $default-ease;

  .header {
    width: var(--max-width);
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;

    .close {
      height: 64px;
      width: 64px;
      padding: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: none;

      &:hover {
        svg {
          color: $highlight;
        }
      }

      svg {
        height: 80%;
        width: 80%;
        pointer-events: none;
        transition: color 0.3s $default-ease;
      }
    }
  }

  .inner {
    height: var(--height);
    width: var(--max-width);
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    border-radius: 25px;
    background-color: $main-dark-bg;
    box-shadow: $box-shadow-elevation-1;

    padding: 32px 64px;
  }
}
// for some reason this is not working from animations.scss so I'm copying here
.transition-fade-enter-from,
.transition-fade-leave-to {
  opacity: 0;
}
.transition-fade-enter-active,
.transition-fade-leave-active {
  transition: all 0.3s $default-ease;
}

@media (max-width: $md-breakpoint) {
  .modal {
    padding-inline: 16px;
    .inner {
      padding-top: 16px;
      padding-inline: 32px;
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .modal {
    .header {
      width: 100%;
      margin-bottom: 0;
    }

    .inner {
      width: 100%;
      height: 80vh;
      padding-inline: 16px;
    }
  }
}
</style>
