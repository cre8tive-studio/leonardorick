<template>
  <LRModal
    :should-show-modal="shouldShowModal"
    max-width="70%"
    @close="$emit('close')"
  >
    <div class="how-it-works-modal">
      <h1 class="lr-text--body-2">{{ $t('modal.how_it_works.title') }}</h1>
      <div class="main-description mb-4">
        <fa icon="music" />
        <p>{{ $t('modal.how_it_works.main_description_1') }}</p>
      </div>

      <div class="main-description mb-8">
        <fa icon="money-bill-wave" />
        <p>{{ $t('modal.how_it_works.main_description_2') }}</p>
      </div>

      <button
        class="lr-anchor"
        lr-cursor
        @click="showLearnMoreContent = !showLearnMoreContent"
      >
        {{ $t('learn_more') }}
      </button>

      <transition name="open">
        <div v-if="showLearnMoreContent">
          <ol>
            <li>{{ $t('modal.how_it_works.know_more.item_1') }}</li>
            <li>{{ $t('modal.how_it_works.know_more.item_2') }}</li>
            <li>{{ $t('modal.how_it_works.know_more.item_3') }}</li>
            <li>{{ $t('modal.how_it_works.know_more.item_4') }}</li>
            <li>{{ $t('modal.how_it_works.know_more.item_5') }}</li>
          </ol>
        </div>
      </transition>
      <div class="flex gap-4 justify-center mb-8">
        <button
          lr-cursor
          class="lr-button"
          :disabled="true"
        >
          {{ $t('donate') }}
        </button>
        <button
          lr-cursor
          class="lr-button lr-button-secondary"
          @click="showSubscribeContent = !showSubscribeContent"
        >
          {{ $t('subscribe') }}
        </button>
      </div>
      <transition name="open">
        <form
          v-if="showSubscribeContent"
          class="flex flex-col items-center mb-8"
          @submit.prevent="continueSubscription"
        >
          <div class="flex gap-4 mb-4">
            <input
              v-model="email"
              lr-cursor
              class="lr-text-input"
              type="text"
              placeholder="Email"
              autocomplete="username"
            />
            <input
              v-model="confirmEmail"
              lr-cursor
              class="lr-text-input"
              type="text"
              :placeholder="$t('confirm_email')"
              autocomplete="username"
            />
          </div>
          <button
            lr-cursor
            class="lr-button lr-button-secondary w-full"
            type="submit"
          >
            {{ $t('continue') }}
          </button>
        </form>
      </transition>
      <LRMoneyTarget class="money-target" />
    </div>
  </LRModal>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { useToasterStore } from '~/store/toaster';

interface Emits {
  (e: 'close'): void;
}

interface Props {
  shouldShowModal: boolean;
}

const $emit = defineEmits<Emits>();
const { shouldShowModal } = defineProps<Props>();

const { t: $t } = useI18n();
const { goToStripeSubscriptionPage } = useStripe();

const toast = useToasterStore();
const { lang } = toRefs(useAppStore());

const showLearnMoreContent = ref(false);
const showSubscribeContent = ref(false);

const email = ref('');
const confirmEmail = ref('');

function continueSubscription() {
  if (!email.value.trim() || !confirmEmail.value.trim()) {
    toast.error({ text: $t('error.please_fill_email') });
    return;
  }

  if (email.value.trim() !== confirmEmail.value.trim()) {
    toast.error({ text: $t('error.match_email') });
    return;
  }

  if (!validateEmail(email.value)) {
    toast.error({ text: $t('error.general_argument_invalid_email') });
    return;
  }

  goToStripeSubscriptionPage({ prefilled_email: email.value.trim(), locale: lang.value });
  cleanForm();
}

function cleanForm() {
  email.value = '';
  confirmEmail.value = '';
}
</script>

<style scoped lang="scss">
.how-it-works-modal {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    text-align: center;
    text-transform: uppercase;
    color: $highlight;
    margin-bottom: 24px;
  }

  .main-description {
    width: 100%;
    display: flex;
    gap: 32px;
    align-items: center;

    svg {
      width: 32px;
      height: 32px;
      color: $highlight;
    }
  }

  ol {
    counter-reset: list-counter;
    margin-bottom: 32px;

    li {
      counter-increment: list-counter;
      margin-bottom: 12px;
      position: relative;
      padding-left: 24px;

      &::before {
        content: counter(list-counter) '.';
        position: absolute;
        left: 0;
        color: $highlight;
        font-weight: bold;
      }
    }
  }

  .lr-anchor {
    margin-bottom: 32px;
  }

  .money-target {
    width: 100%;
    padding-inline: 1rem;
  }

  .open-enter-from,
  .open-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .open-enter-to,
  .open-leave-from {
    // increaess this value if the content increaes, it can be bigger than
    // the actual height that it will not affect it
    max-height: 1000px;
    opacity: 1;
  }

  .open-enter-active,
  .open-leave-active {
    transition: max-height 0.3s $default-ease, opacity 0.3s $default-ease;
  }
}
@media (min-width: $sm-breakpoint) {
  .how-it-works-modal .money-target {
    width: 80%;
    padding-inline: 3rem;
  }
}
</style>
