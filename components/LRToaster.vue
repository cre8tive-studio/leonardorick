<template>
  <teleport to="body">
    <transition name="toast">
      <div
        v-if="toasts.length"
        class="toaster__wrapper"
      >
        <transition-group
          name="toast"
          tag="ul"
        >
          <li
            v-for="toast in toasts"
            :key="toast.text"
            :class="['toaster__inner', toastClassMap[toast.status]]"
          >
            <fa :icon="toastIconMap[toast.status]" />

            <span class="toaster__inner-text">
              {{ toast.text }}
            </span>
          </li>
        </transition-group>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { type TToastStatus, useToasterStore } from '~/store/toaster';

const toastClassMap: Record<TToastStatus, string> = {
  warning: 'warning',
  error: 'error',
  success: 'success',
};

const toastIconMap: Record<TToastStatus, [string, string]> = {
  error: ['far', 'circle-xmark'],
  warning: ['fas', 'triangle-exclamation'],
  success: ['fas', 'check'],
};

const { toasts } = toRefs(useToasterStore());
</script>

<style scoped lang="scss">
.toaster {
  &__wrapper {
    position: fixed;
    bottom: 3%;
    right: 5%;
    z-index: 900;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__inner {
    --color: $primary-dark-text;
    display: flex;
    align-items: center;
    gap: 1rem;

    margin-bottom: 12px;
    border-radius: 12px;
    padding: 1.2rem 2rem;

    font-size: 14px;
    min-width: 300px;

    background: var(--background);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(7.6px);
    -webkit-backdrop-filter: blur(7.6px);
    border: 1px solid var(--border-color);

    color: var(--color);
    overflow: hidden;
    position: relative;

    transition: all 0.3s ease;

    svg {
      width: 20px;
      height: 20px;
      fill: var(--color);
      flex-shrink: 0;
    }

    &-text {
      color: var(--color);
    }

    &.success {
      --color: #00b74c; // Bright green
      --background: rgba(0, 164, 27, 0.22);
      --border-color: rgba(1, 164, 28, 0.48);
    }

    &.warning {
      --color: #ff9100; // Orange
      --background: rgba(164, 127, 0, 0.13);
      --border-color: rgba(164, 127, 0, 0.48);
    }

    &.error {
      --color: #ff5252; // Bright red
      --background: rgba(164, 0, 0, 0.19);
      --border-color: rgba(154, 0, 0, 0.48);
    }
  }
}

/* Transitions */
.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.toast-enter-active,
.toast-leave-active {
  transition: 0.3s ease all;
}
</style>
