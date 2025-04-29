<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="shouldShowModal"
        class="modal"
        @click="close"
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
          class="inner"
          @click.stop
        >
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close'): void;
}
interface Props {
  shouldShowModal: boolean;
}

const $emit = defineEmits<Emits>();
const { shouldShowModal } = defineProps<Props>();

function close() {
  $emit('close');
}
</script>

<style scoped lang="scss">
.modal {
  color: $main-dark-text;
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;

  background-color: rgba($main-dark-bg, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  z-index: 100;

  .header {
    width: 100%;
    margin-right: 5%;
    margin-bottom: 55px;
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
  transition: color 0.3s $default-ease;
  .inner {
    height: 80vh;
    width: 80vw;

    border-radius: 25px;
    background-color: $main-dark-bg;
    box-shadow: $box-shadow-elevation-1;

    padding: 32px;
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

@media (max-width: $sm-breakpoint) {
  .modal {
    padding-inline: 16px;
    .header {
      justify-content: flex-start;
    }
    .inner {
      // width: 100vw;
      width: 100%;
      // margin-inline: 16px;
    }
  }
}
</style>
