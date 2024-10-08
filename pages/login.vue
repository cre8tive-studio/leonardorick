<template>
  <LRMainErrorSection
    title="error_title_empty_page"
    subtitle="error_subtitle_login"
  />
  <div v-if="false">
    <form @submit.prevent="handleSubmit">
      <div>
        <select v-model="loginType">
          <option value="login">{{ $t('login') }}</option>
          <option value="signup">{{ $t('signup') }}</option>
        </select>
      </div>
      <input
        v-model="email"
        type="text"
        placeholder="Email"
        autocomplete="username"
      />
      <input
        v-model="password"
        type="password"
        :placeholder="$t('password')"
        autocomplete="current-password"
      />
      <button
        :disabled="formDisabled"
        class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
        type="submit"
      >
        {{ $t(loginType) }}
      </button>
    </form>
    <div v-if="loginType === 'signup'">
      <h2>make sure you already have subscribed to enable signup</h2>
      <button
        class="p-4 bg-neutral-400"
        @click="goToStripe"
      >
        go to stripe to pay
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SettingsModel } from '../types/settings.model';
import { useAppStore } from '~/store';

const store = useAppStore();
const { auth, initSettings } = useAppwrite();
const { request } = useRequest();
const router = useRouter();
const { session: storedSession } = toRefs(store);

if (storedSession.value) {
  router.replace('/');
}

const email = ref('');
const password = ref('');
const loginType = ref<'login' | 'signup'>('login');

const formDisabled = computed(() => !email.value || !password.value);

const handleSubmit = async () => {
  const session = await getSession();
  if (session) {
    storedSession.value = session;
  } else {
    // todo: setup modal error
    console.error('unable to login or signup, check your password and email');
  }
};

const getSession = async () => {
  try {
    const { error, data } = await request<SettingsModel>(`/api/${loginType.value}`, {
      email: email.value,
      password: password.value,
    });

    if (error.value) {
      throw error.value;
    }

    initSettings(data.value);

    return await auth.createEmailSession(email.value, password.value);
  } catch (error) {
    // todo: setup modal error
    console.error(error);
  }
};

const goToStripe = () => {
  window.open(useRuntimeConfig().public.stripePaymentLink, '_blank');
};
</script>

<style scoped></style>
