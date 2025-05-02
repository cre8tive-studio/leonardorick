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
            class="lr-text-input"
            type="text"
            :placeholder="$t('name')"
          />
          <input
            v-model="email"
            :disabled="emailDisabled"
            lr-cursor
            class="lr-text-input"
            type="text"
            placeholder="Email"
            autocomplete="username"
          />
          <div class="flex flex-col items-end">
            <div class="w-full relative password-wrapper mb-4">
              <input
                v-model="password"
                lr-cursor
                class="lr-text-input"
                :type="passowrdType"
                :placeholder="$t('password')"
                autocomplete="current-password"
              />
              <div
                lr-cursor
                class="icon-wrapper"
                @click="showPassword"
              >
                <fa :icon="showPasswordIcon" />
              </div>
            </div>
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
          <div
            v-if="!checkoutId"
            class="stripe"
          >
            <i18n-t
              tag="p"
              keypath="make_sure_already_subscribed_signup"
            >
              <template #subscribedLink>
                <a
                  class="lr-anchor"
                  lr-cursor
                  @click="shouldShowModal = true"
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
const route = useRoute();
const store = useAppStore();
const { t: $t } = useI18n();

const { auth, initSettings } = useAppwrite();
const { localeRoute } = store;
const { session: storedSession } = toRefs(store);
const toast = useToasterStore();
const { handleError } = useHandleError();
const { clientGetCheckoutValid } = useStripe();

const forgotPasswordExpiresAt = useLocalStorage('forgot-password-expires-at', 0);
const forgotPasswordDisabled = computed(() => forgotPasswordExpiresAt.value > 1);
const now = ref(Date.now());
const timer = computed(() => {
  const diff = forgotPasswordExpiresAt.value - now.value;
  return diff > 0 ? formatTimeHmm(diff) : '0:00';
});

const formDisabled = computed(
  () => (loginType.value === 'signup' && !name.value.trim()) || !email.value.trim() || !password.value.trim()
);

const email = ref('');
const password = ref('');
const name = ref('');
const loginType = ref<LoginType>('login');
const interval = ref<NodeJS.Timeout>();
const shouldShowModal = ref(false);
const checkoutId = ref('');

const emailDisabled = ref(false);
const showPasswordIcon = ref<'eye' | 'eye-slash'>('eye-slash');
const passowrdType = ref<'password' | 'text'>('password');

const INVERTED_LOGIN_TYPE: Record<LoginType, LoginType> = {
  login: 'signup',
  signup: 'login',
};

if (storedSession.value) {
  router.replace(localeRoute('index'));
}

onMounted(() => {
  validateCheckout();
  if (forgotPasswordExpiresAt.value) {
    createTimerCountDown();
  }
});

onUnmounted(() => {
  clearInterval(interval.value);
});

function showPassword() {
  showPasswordIcon.value = showPasswordIcon.value === 'eye' ? 'eye-slash' : 'eye';
  passowrdType.value = passowrdType.value === 'password' ? 'text' : 'password';
}

async function validateCheckout() {
  if (route.query.stripe_checkout_id) {
    checkoutId.value = route.query.stripe_checkout_id as string;
    loginType.value = 'signup';
    try {
      const { email: customerEmail, name: customerName } = await clientGetCheckoutValid(checkoutId.value);
      email.value = customerEmail;
      if (email.value) {
        emailDisabled.value = true;
      }

      name.value = customerName;
      toast.success({ text: $t('success.payment_succeeded_start') });
    } catch {
      toast.error({ text: $t('error.generic_payment') });
      const { stripe_checkout_id: _s, ...rest } = route.query;
      router.replace({ query: rest });
    }
  }
}

async function forgotPasswordStart() {
  if (forgotPasswordExpiresAt.value) return;

  if (!email.value.trim()) {
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
  router.replace(localeRoute('music', { query: { login: loginType.value } }));
}

async function getSession() {
  try {
    const data = await $fetch<SettingsModel>(`/api/${loginType.value}`, {
      method: 'POST',
      body: {
        email: email.value.trim(),
        password: password.value,
        name: name.value.trim(),
      },
    });

    initSettings(data);
    return await auth.createEmailPasswordSession(email.value, password.value);
  } catch (e) {
    handleError(e);
  }
}
</script>

<style scoped lang="scss">
.login {
  .password-wrapper {
    .icon-wrapper {
      height: 28px;
      width: 28px;
      position: absolute;
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: none;
    }
    svg {
      height: 60%;
      width: 60%;
      pointer-events: none;
      color: $secondary-dark-bg;
      opacity: 0.5;
      transition: opacity 0.3s $default-ease;

      &:hover,
      &[data-icon='eye'] {
        opacity: 1;
      }
    }
  }

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
