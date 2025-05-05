<template>
  <ClientOnly>
    <teleport to="body">
      <transition name="modal">
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
}

const attrs = useAttrs();
const $emit = defineEmits<Emits>();
const { shouldShowModal, maxWidth = '80%', height = '75vh' } = defineProps<Props>();

const { enableScroll, disableScroll } = useAnimationStore();

const modalEl = ref<HTMLDivElement>();
const innerEl = ref<HTMLDivElement>();
const modalLenis = ref<Lenis>();
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

      if (isOpen) {
        // acts like onMounted
        if (!modalEl.value) return;
        modalEl.value.style.setProperty('--max-width', maxWidth);
        modalEl.value.style.setProperty('--height', height);
        disableScroll({ blockTogglingScroll: true });

        modalLenis.value = new Lenis({
          autoRaf: true,
          duration: 1.4,
          wrapper: innerEl.value,
          content: innerEl.value,
        });
      } else {
        // acts like onUnmounted
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
  padding-bottom: 6rem;

  background-color: rgba($main-dark-bg, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 100;
  transition: color 0.3s $default-ease;

  .header {
    width: var(--max-width);
    display: flex;
    justify-content: flex-end;
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

/* Transitions */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active,
.modal-leave-active {
  transition: 0.3s ease all;
}

@media (max-width: $md-breakpoint) {
  .modal {
    padding-inline: 16px;
    .inner {
      padding-inline: 32px;
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .modal {
    .header {
      width: 100%;
      justify-content: flex-start;
      margin-bottom: 0;
    }
    .inner {
      width: 100%;
      height: 70vh;
    }
  }
}
</style>
