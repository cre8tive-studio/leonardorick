<template>
  <div class="previews-blocked">
    <div class="content">
      <SvgoLock />
      <h3 class="lr-text--body-1 relative">
        {{ $t('exclusive_access_for_supporters') }}
        <LRInfoIcon
          class="info-icon"
          @click="$emit('join-supporters-clicked')"
        />
      </h3>
      <div class="flex gap-6">
        <button
          lr-cursor
          class="lr-button"
          @click="$emit('join-supporters-clicked')"
        >
          {{ $t('join_supporters') }}
        </button>
        <NuxtLink
          lr-cursor
          class="lr-button lr-button-secondary"
          :to="localeRoute('login')"
        >
          {{ $t('login') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
interface Emits {
  (e: 'join-supporters-clicked'): void;
}
defineEmits<Emits>();

const { localeRoute } = useAppStore();
</script>

<style scoped lang="scss">
.previews-blocked {
  width: 100%;
  background-color: $main-dark-bg;
  box-shadow: $box-shadow-elevation-1;
  border-radius: 7px;
  border: 1px solid $dark-text-3;
  padding: 32px;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    .info-icon {
      height: 16px;
      width: 16px;
    }

    svg {
      width: 40px;
      height: 40px;
    }

    button {
      cursor: none;
    }
  }
}

@media (min-width: $md-breakpoint) {
  .previews-blocked .content svg {
    width: 60px;
    height: 60px;
  }
}

@media (min-width: $lg-breakpoint) {
  .previews-blocked .content svg {
    width: 80px;
    height: 80px;
  }
}
</style>
