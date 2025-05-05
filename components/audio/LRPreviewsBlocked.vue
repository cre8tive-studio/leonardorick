<template>
  <div class="previews-blocked">
    <div class="content">
      <SvgoLock />
      <div class="text-center">
        <h3 class="lr-text--body-1">{{ $t('exclusive_access_for_supporters') }}</h3>
        <p class="description">{{ $t('reenable_subscription_regain_access') }}</p>
      </div>
      <LRManageSubscriptionButton />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'join-supporters-clicked'): void;
}
defineEmits<Emits>();
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

    svg {
      width: 40px;
      height: 40px;
    }

    button {
      cursor: none;
    }
  }

  .description {
    color: $secondary-dark-text;
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
