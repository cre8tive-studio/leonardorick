<template>
  <div class="s-LRQuotesSection lr-section-page">
    <h1><span>“</span>{{ selectedQuote?.quote }}<span class="right">”</span></h1>
    <div class="flex items-center justify-center gap-2">
      <h2>{{ selectedQuote?.author }}</h2>
      <h3 v-if="selectedQuote?.label">{{ selectedQuote.label }}</h3>
    </div>
  </div>
  <div
    id="container"
    class="wtf"
  >
    <span id="text1"></span>
    <span id="text2"></span>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { useAppStore } from '~/store';
import type { QuoteModel } from '~/types/quote.model';

const { quotes } = toRefs(useAppStore());
const selectedQuote = ref<QuoteModel | undefined>(quotes.value[0]);

let quotesClone = [...quotes.value];
function selectRandomQuote() {
  const maxIndex = quotesClone.length - 1;

  const quote = quotesClone[Math.round(Math.random() * maxIndex)];
  const index = quotesClone.findIndex((q) => q.id === quote?.id);
  // if the random quote is the same as before, we don't want to show it
  if (quote?.id === selectedQuote.value?.id) {
    // if it's the last quote, we show the first one
    if (index === maxIndex) {
      selectedQuote.value = quotesClone[0];
    } else {
      // if not, we just show the next one
      selectedQuote.value = quotesClone[index + 1];
    }
  } else {
    selectedQuote.value = quote;
  }

  // using a clone we ensure to show every single quote before repeaitng.
  // the logic is simple, if shown, remove, if the list is empty fill it
  // again with all quotes.
  quotesClone.splice(index, 1);
  if (quotesClone.length === 0) {
    quotesClone = [...quotes.value];
  }
  // a big quote. Uncomment below and comment splice so
  // you can test if things fit properly on the screen
  // selectedQuote.value = quotesClone[9];
}
selectRandomQuote();

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.s-LRQuotesSection',
      once: true,
      start: 'top center',
    },
    repeat: -1,
    // might be needed if scrollTrigger is removed. but for now,
    // just delaying the animation repetition worked well.
    // repeatDelay: 7
  });
  tl.to('.s-LRQuotesSection', {
    opacity: 0,
    repeat: 1,
    yoyo: true,
    delay: 6,
    duration: 3,
    onRepeat: () => {
      selectRandomQuote();
    },
  });
});
</script>

<style scoped lang="scss">
.s-LRQuotesSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4rem;

  h1 {
    font-size: min(7vw, 7rem);
    line-height: min(7vw, 7rem);
    letter-spacing: 0.3rem;
    font-weight: 500;
    span {
      color: $highlight;
      // transform: scale(2.5);
      display: inline-block;
      white-space: nowrap;

      position: relative;
      font-size: min(12vw, 12rem);
      line-height: min(3vw, 3rem);

      // tricky to not brak line on the span. I want the quote to allways be on the
      // side of the last word so making the span 0 width makes it happen. TO fix the height
      // we force the line height to be lower
      // // It was not enough
      &:not(.right) {
        top: 28px;
        left: -5px;
      }
      &.right {
        width: 0;
        left: -5px;
        top: 42px;
      }
    }
  }
  h2 {
    font-size: 1.5rem;
    font-style: italic;
  }

  h3 {
    position: relative;
    top: 0.25rem;
    color: $main-dark-text-dark;
  }
}
</style>
