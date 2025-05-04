<template>
  <template v-if="subscription && user">
    <button
      v-if="subscription.status === 'canceled'"
      lr-cursor
      class="lr-button"
      @click="shouldShowModal = true"
    >
      {{ $t('renew_subscription') }}
    </button>
    <button
      v-else
      lr-cursor
      class="lr-button"
      @click="goToStripeClientPortal({ prefilled_email: user.email, locale: lang })"
    >
      {{ $t('manage_subscription') }}
    </button>

    <LRModal
      height="500px"
      :should-show-modal="shouldShowModal"
      @close="shouldShowModal = false"
    >
      <div class="renew-subscription-modal">
        <h1 class="lr-text--body-2">{{ $t('modal.renew_subscription.title') }}</h1>
        <ol class="flex flex-col justify-center flex-1">
          <li>{{ $t('modal.renew_subscription.description.item_1') }}</li>
          <li>{{ $t('modal.renew_subscription.description.item_2') }}</li>
          <li>{{ $t('modal.renew_subscription.description.item_3') }}</li>
          <li>{{ $t('modal.renew_subscription.description.item_4') }}</li>
        </ol>
        <button
          lr-cursor
          class="lr-button"
          :disabled="isRenewingSubscription"
          @click="startclientRenewSubscription"
        >
          <LRCubeLoader v-if="isRenewingSubscription" />
          <template v-else>
            {{ $t('renew_subscription') }}
          </template>
        </button>
      </div>
    </LRModal>
  </template>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { useToasterStore } from '~/store/toaster';

const { t: $t } = useI18n();
const toast = useToasterStore();
const { goToStripeClientPortal, clientRenewSubscription } = useStripe();
const { getCurrentSession } = useAppwrite();
const { handleError } = useHandleError();

const { lang, user, subscription } = toRefs(useAppStore());

const shouldShowModal = ref(false);
const isRenewingSubscription = ref(false);

async function startclientRenewSubscription() {
  isRenewingSubscription.value = true;
  try {
    await clientRenewSubscription();
    await getCurrentSession(true);
    shouldShowModal.value = false;
    toast.success({ text: $t('success.subscription_renewed') });
  } catch (e) {
    handleError(e);
  }
  isRenewingSubscription.value = false;
}
</script>

<style scoped lang="scss">
.renew-subscription-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  :deep(.lr-cube-loader) {
    --cube-size: 22px;
    --color: #{$secondary-dark-bg};
  }

  :deep(.lr-button) {
    min-width: 140px;
  }

  h1 {
    text-align: center;
    text-transform: uppercase;
    color: $highlight;
    margin-bottom: 24px;
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
}
</style>
