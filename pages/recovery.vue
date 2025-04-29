<template>
  <ClientOnly>
    <div class="lr-form-container lr-section-page">
      <h1 class="lr-text--body-2 mb-6">{{ $t('password_recovery') }}</h1>
      <div class="container">
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-col items-end">
            <!-- ? this is for chrome to do not complain  -->
            <input
              type="text"
              name="email"
              value="..."
              autocomplete="username email"
              style="display: none"
            />
            <!-- ? this is for chrome to do not complain  -->
            <input
              v-model="password"
              lr-cursor
              class="text-input mb-4"
              type="password"
              :placeholder="$t('password')"
              autocomplete="current-password"
            />
            <input
              v-model="confirmPassword"
              lr-cursor
              class="text-input mb-4"
              type="password"
              :placeholder="$t('confirm_password')"
              autocomplete="current-password"
            />
          </div>
          <button
            :disabled="formDisabled"
            lr-cursor
            class="lr-button lr-button-secondary"
            type="submit"
          >
            {{ $t('update') }}
          </button>
        </form>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { AppwriteException } from 'appwrite';
import { useToasterStore } from '~/store/toaster';
import { useAppStore } from '~/store';

const router = useRouter();
const route = useRoute();
const { t: $t } = useI18n();

const store = useAppStore();
const toast = useToasterStore();

const { auth } = useAppwrite();
const { handleError } = useHandleError();

const { localeRoute } = store;

const { userId, secret } = route.query;
const formDisabled = computed(() => !password.value || !confirmPassword.value);
const password = ref('');
const confirmPassword = ref('');

onMounted(() => {
  if (!userId || !secret) {
    linkExpiredAction();
  }
});

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    toast.error({ text: $t('password_mismatch') });
    return;
  }

  if (!userId || !secret) {
    linkExpiredAction();
    return;
  }

  try {
    await auth.updateRecovery(userId.toLocaleString(), secret.toLocaleString(), password.value);
    localStorageClientSetItem('forgot-password-expires-at', '0');
    router.replace(localeRoute('login', { clean: true }));
    toast.success({ text: $t('success.password_updated') });
  } catch (e) {
    if (e instanceof AppwriteException && e.type === 'user_invalid_token') {
      linkExpiredAction();
      return;
    }

    handleError(e);
  }
}

function linkExpiredAction() {
  toast.error({ text: $t('link_expired') });
  router.replace(localeRoute('login', { clean: true }));
}
</script>

<style scoped lang="scss"></style>
