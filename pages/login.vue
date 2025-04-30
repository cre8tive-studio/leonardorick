<template>
  <ClientOnly>
    <div class="login lr-form-container lr-section-page">
      <h1 class="lr-text--body-2 mb-6">{{ $t(loginType) }}</h1>
      <div class="container">
        <form @submit.prevent="handleSubmit">
          <input
            v-if="loginType === 'signup'"
            v-model="name"
            maxlength="30"
            lr-cursor
            class="text-input"
            type="text"
            :placeholder="$t('name')"
          />
          <input
            v-model="email"
            lr-cursor
            class="text-input"
            type="text"
            placeholder="Email"
            autocomplete="username"
          />
          <div class="flex flex-col items-end">
            <input
              v-model="password"
              lr-cursor
              class="text-input mb-4"
              type="password"
              :placeholder="$t('password')"
              autocomplete="current-password"
            />
            <div v-if="loginType === 'login'">
              <p
                lr-cursor
                class="forgot-password"
                :class="{ disabled: forgotPasswordDisabled }"
                @click="forgotPasswordStart"
              >
                <span>{{ $t('forgot_password') }}</span>
                <span
                  v-if="forgotPasswordDisabled"
                  class="forgot-password-timer"
                >
                  {{ timer }}
                </span>
              </p>
            </div>
          </div>
          <button
            :disabled="formDisabled"
            lr-cursor
            class="lr-button lr-button-secondary"
            type="submit"
          >
            {{ $t(loginType) }}
          </button>
        </form>
        <p
          v-if="loginType === 'login'"
          class="pb-12"
        >
          {{ $t('dont_have_account_sign_up') }}
          <a
            class="lr-anchor"
            lr-cursor
            @click="changeLoginType"
          >
            {{ $t('signup') }}
          </a>
        </p>
        <div v-else>
          <p class="pb-12">
            {{ $t('already_have_an_account') }}
            <a
              class="lr-anchor"
              lr-cursor
              @click="changeLoginType"
            >
              {{ $t('login') }}
            </a>
          </p>
          <div class="stripe">
            <i18n-t
              tag="p"
              keypath="make_sure_already_subscribed_signup"
            >
              <template #subscribedLink>
                <a
                  class="lr-anchor"
                  lr-cursor
                  @click="goToStripe"
                >
                  {{ $t('subscribed') }}
                </a>
              </template>
            </i18n-t>
            <div
              class="info"
              lr-cursor
              @click="shouldShowModal = true"
            >
              <fa
                lr-cursor
                icon="circle-info"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
  <LRHowItWorksModal
    v-if="shouldShowModal"
    :should-show-modal="shouldShowModal"
    @close="shouldShowModal = false"
  />
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import type { SettingsModel } from '../types/settings.model';
import { useToasterStore } from '~/store/toaster';
import { useAppStore } from '~/store';
import LRHowItWorksModal from '~/components/modal/LRHowItWorksModal.vue';

type LoginType = 'login' | 'signup';

const router = useRouter();
const store = useAppStore();
const { t: $t } = useI18n();

const { auth, initSettings } = useAppwrite();
const { safeBack } = useSafeBack();
const { localeRoute } = store;
const { session: storedSession } = toRefs(store);
const toast = useToasterStore();
const { handleError } = useHandleError();

const forgotPasswordExpiresAt = useLocalStorage('forgot-password-expires-at', 0);
const forgotPasswordDisabled = computed(() => forgotPasswordExpiresAt.value > 1);
const now = ref(Date.now());
const timer = computed(() => {
  const diff = forgotPasswordExpiresAt.value - now.value;
  return diff > 0 ? formatTimeHmm(diff) : '0:00';
});

const formDisabled = computed(() => (loginType.value === 'signup' && !name.value) || !email.value || !password.value);

const email = ref('');
const password = ref('');
const name = ref('');
const loginType = ref<LoginType>('login');
const interval = ref<NodeJS.Timeout>();
const shouldShowModal = ref(false);

const INVERTED_LOGIN_TYPE: Record<LoginType, LoginType> = {
  login: 'signup',
  signup: 'login',
};

if (storedSession.value) {
  router.replace(localeRoute('index'));
}

onMounted(() => {
  if (forgotPasswordExpiresAt.value) {
    createTimerCountDown();
  }
});

onUnmounted(() => {
  clearInterval(interval.value);
});

async function forgotPasswordStart() {
  if (forgotPasswordExpiresAt.value) return;

  if (!email.value) {
    toast.error({ text: $t('error.please_fill_email') });
    return;
  }

  try {
    await auth.createRecovery(email.value, localeRoute('recovery').resolve());
    toast.success({ text: $t('success.recover_password') });

    startForgotPasswordCooldown(180);
  } catch (e) {
    handleError(e);
  }
}

function startForgotPasswordCooldown(seconds: number) {
  now.value = Date.now();
  forgotPasswordExpiresAt.value = now.value + seconds * 1000;

  clearInterval(interval.value);
  createTimerCountDown();
}

function createTimerCountDown() {
  interval.value = setInterval(() => {
    now.value = Date.now();
    if (now.value >= forgotPasswordExpiresAt.value) {
      clearInterval(interval.value);
      forgotPasswordExpiresAt.value = 0;
    }
  }, 1000);
}

function changeLoginType() {
  loginType.value = INVERTED_LOGIN_TYPE[loginType.value];
}

async function handleSubmit() {
  const session = await getSession();
  if (!session) {
    return;
  }
  storedSession.value = session;
  safeBack();
}

async function getSession() {
  try {
    const data = await $fetch<SettingsModel>(`/api/${loginType.value}`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
      },
    });

    initSettings(data);
    return await auth.createEmailPasswordSession(email.value, password.value);
  } catch (e) {
    handleError(e);
  }
}

function goToStripe() {
  window.open(useRuntimeConfig().public.stripePaymentLink, '_blank');
}
</script>

<style scoped lang="scss">
.login {
  p.forgot-password {
    text-align: right;
    text-decoration: underline;
    display: flex;
    gap: 8px;
    cursor: none;
    color: $secondary-dark-text;
    transition: color 0.3s $default-ease;

    > * {
      pointer-events: none;
    }
    &:hover:not(:disabled) {
      color: $main-dark-text;
    }
    &.disabled {
      pointer-events: none;
      color: $secondary-dark-text;
    }
  }

  .forgot-password-timer {
    font-size: 14px;
  }

  .stripe {
    text-align: center;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .info {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: none;
    border-radius: 50%;

    svg {
      pointer-events: none;
      border-radius: 50%;
    }
  }
}
</style>
