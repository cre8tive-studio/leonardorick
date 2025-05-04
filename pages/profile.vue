<template>
  <div class="lr-form-container lr-section-page">
    <h1 class="lr-text--body-2 mb-6">{{ $t('profile') }}</h1>
    <div
      v-if="user"
      class="container flex flex-col items-center gap-4"
    >
      <div>
        <div
          class="lr-text-input disabled"
          type="text"
        >
          {{ user.email }}
        </div>
      </div>
      <button
        lr-cursor
        class="lr-button"
        @click="goToStripeClientPortal({ prefilled_email: user.email, locale: lang })"
      >
        {{ $t('manage_subscription') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import type { UserModel } from '~/types/user.model';

const { lang } = toRefs(useAppStore());
const { goToStripeClientPortal } = useStripe();
const { getUser } = useAppwrite();

const user = ref<UserModel | null>();

onMounted(async () => {
  user.value = await getUser();
});
</script>

<style scoped></style>
