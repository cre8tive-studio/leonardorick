<template>
  <ClientOnly>
    <div
      v-if="user && subscription"
      class="lr-profile lr-form-container lr-section-page"
    >
      <h1 class="lr-text--body-2 mb-6">{{ $t('profile') }}</h1>
      <div class="container flex flex-col items-center gap-4 mb-12">
        <LRSubscriptionBadge class="mb-2" />
        <div
          class="lr-text-input disabled !w-fit"
          type="text"
        >
          {{ user.email }}
        </div>

        <LRManageSubscriptionButton />
      </div>
      <div class="money-target-container w-full flex flex-col items-center">
        <h2 class="mb-8 lr-text--body-1">{{ $t('profile_money_target_title') }}</h2>
        <LRMoneyTarget class="money-target" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const router = useRouter();
const store = useAppStore();

const { user, subscription } = toRefs(store);
const { localeRoute } = store;

if (!user.value) {
  router.replace(localeRoute('index'));
}
</script>

<style scoped lang="scss">
.money-target-container {
  max-width: 500px;
  text-align: center;
}
</style>
