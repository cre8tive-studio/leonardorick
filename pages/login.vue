<template>
  <div>
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
      <p>stripe checkout button</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, ID } from '../utils/auth';
import { useAppStore } from '~/store';

const store = useAppStore();
const { sessionId } = toRefs(store);
const router = useRouter();
const auth = getAuth();

const email = ref('');
const password = ref('');
const loginType = ref<'login' | 'signup'>('login');

const formDisabled = computed(() => !loginType.value || !email.value || !password.value);

const loginTypeFunctionMap: Record<
  'login' | 'signup',
  {
    method: 'createEmailSession' | 'create';
    props: (string | Ref<string>)[];
  }
> = {
  login: {
    method: 'createEmailSession',
    props: [email, password],
  },
  signup: {
    method: 'create',
    props: [ID.unique(), email, password],
  },
};

const handleSubmit = async () => {
  try {
    const props = loginTypeFunctionMap[loginType.value].props.map((prop) =>
      typeof prop === 'object' ? prop.value : prop
    ) as [string, string, string]; // we need to convert to a tuple so we can spread later
    const session = await auth[loginTypeFunctionMap[loginType.value].method](...props);
    sessionId.value = session.$id;
    router.replace('/');
  } catch (error) {
    // todo: setup modal error
    console.error('error', error);
  }
};
if (sessionId.value) {
  // redirect to home page
  router.replace('/');
}
</script>

<style scoped></style>
