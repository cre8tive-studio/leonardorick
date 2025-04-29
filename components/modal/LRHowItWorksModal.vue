<template>
  <LRModal
    :should-show-modal="shouldShowModal"
    @close="close"
  >
    <h1>how it works</h1>
    <p>
      Previews are a special treat for those who contribute and help support my work. Your generosity makes it possible
      for me to produce more Songs with great quality, and in return, you’ll unlock exclusive content and early previews
      of my songs.
    </p>
    <ol>
      <li>You subscribe as a supporter for a Symbolic price.</li>
      <li>You unlock 15 seconds of all the songs I’ve ever wrote.</li>
      <li>Each month subscribed you unlock a Demo, a full song Just Voice & Guitar, that I’m planning to produce.</li>
      <li>You are able to vote on The songs you’ve liked.</li>
      <li>the most voted Song is the one I’m going to produce next.</li>
    </ol>
    <div>
      <button>Donate</button>
      <button>Subscribe</button>
    </div>
    <LRMoneyTarget />
  </LRModal>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close'): void;
}

interface Props {
  shouldShowModal: boolean;
}

const $emit = defineEmits<Emits>();
const { shouldShowModal } = defineProps<Props>();

function close() {
  $emit('close');
}
</script>

<style scoped></style>
