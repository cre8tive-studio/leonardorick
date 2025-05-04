<template>
  <LRBadge
    :text="current.text"
    :status="current.status"
  />
</template>

<script setup lang="ts">
import type Stripe from 'stripe';
import type { BadgeProps } from './LRBadge.vue';
import { useAppStore } from '~/store';

const { t: $t } = useI18n();
const { subscription, lang } = toRefs(useAppStore());

type SubscriptionBadgeStatus = Extract<Stripe.Subscription.Status, 'active' | 'past_due' | 'canceled'>;

const content: Record<SubscriptionBadgeStatus, BadgeProps> = {
  active: {
    text: $t('subscription.active'),
    status: 'success',
  },
  past_due: {
    text: $t('subscription.past_due'),
    status: 'warning',
  },
  canceled: {
    text: $t('subscription.canceled'),
    status: 'error',
  },
};

const current = computed<BadgeProps>(() => {
  if (subscription.value?.cancel_at) {
    const formattedDate = new Date(subscription.value.cancel_at * 1000).toLocaleDateString(lang.value, {
      day: 'numeric',
      month: 'short',
    });
    return { text: $t('cancel_at', { date: `${formattedDate}` }), status: 'warning' };
  }

  if (subscription.value && isHandledStatus(subscription.value.status)) {
    return content[subscription.value.status];
  }

  return content.canceled;
});

function isHandledStatus(status: Stripe.Subscription.Status): status is SubscriptionBadgeStatus {
  return Object.prototype.hasOwnProperty.call(content, status);
}
</script>

<style scoped lang="scss"></style>
