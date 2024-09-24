<template>
  <div class="c-LRWorkClock">
    <h2>{{ $t('being_nerd_for') }}</h2>
    <p
      v-for="(paragraph, index) in paragraphsText"
      :key="index"
      ref="paragraphs"
    >
      {{ paragraph }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { useAppStore } from '~/store';
import { DEFAULTS } from '~/utils/constants/defaults';
import { dateDifference } from '~/utils/js-utilities';
interface Props {
  containersQuery: string;
  shouldPin: boolean;
}
interface Emits {
  (e: 'set-container-height', count: number, max: number): void;
}

const { personalInfo } = toRefs(useAppStore());
const { t: $t } = useI18n();
const $emit = defineEmits<Emits>();
const { containersQuery, shouldPin } = defineProps<Props>();

const paragraphs = ref<HTMLParagraphElement[]>();

// date I started woking. 9 in the morning in brazil is 12 in GMT+0;
const initialDate = new Date(personalInfo.value?.startWorkingDate || DEFAULTS.startWorkingDate);
const years = ref(0);
const months = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const formattedYearsText = computed(() => getText(years.value, 'year'));
const formattedMonthsText = computed(() => getText(months.value, 'month'));
const formattedDaysText = computed(() => getText(days.value, 'day'));
const formattedHoursText = computed(() => getText(hours.value, 'hour'));
const formattedMinutesText = computed(() => getText(minutes.value, 'minute'));
const formattedSecondsText = computed(() => getText(seconds.value, 'second'));

const paragraphsText = ref([
  formattedYearsText,
  formattedMonthsText,
  formattedDaysText,
  formattedHoursText,
  formattedMinutesText,
  formattedSecondsText,
]);

const paragraphsLength = computed(() => paragraphs.value?.length || 0);

const scaleOffset = [0, 0.35, 0.38, 0.44, 0.48, 0.52];
let initialized = false;
const scrollTriggers: ScrollTrigger[] = [];

onMounted(async () => {
  updateDifference();
  const interval = setInterval(updateDifference, 1000);
  onUnmounted(() => clearInterval(interval));
  setContainerHeight();
});

onUnmounted(() => {
  for (const trigger of scrollTriggers) {
    trigger.kill(true);
  }
});

async function setAnimateWordsEntering() {
  await nextTick();
  const containers = Array.from(document.querySelectorAll(containersQuery));

  for (const [index, p] of getValidParagraphs().entries()) {
    gsap.killTweensOf(p);
    gsap.set(p, { scale: 1 - (scaleOffset[index] || 0.1) });

    if (!containers || !containers[index] || !shouldPin) continue;

    const tween = gsap.fromTo(
      p,
      {
        translateY: '100cqh',
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: containers[index],
          // for the first one, we enter a little bit later, for the rest, they need to
          // overlap a bit so the user don't loose to much time on it
          start: `${!index ? 'top-=20%' : 'top-=40%'} ${!index ? 'top' : 'center'}`,
          end: 'bottom center',
          scrub: true,
        },
        translateY: `${1 * (index + 1) - index ** 1.7}cqh`,
        opacity: 1,
      }
    );
    if (tween.scrollTrigger) {
      scrollTriggers.push(tween.scrollTrigger);
    }
  }
}

function getText(value: number, label: string) {
  return value || label === 'second' ? getFormattedValueAndLabel(value, label) : '';
}

function getFormattedValueAndLabel(value: number, label: string) {
  return `${value} ${$t(label, value).toLocaleLowerCase()}`;
}

function updateDifference() {
  const now = new Date();
  const { years: y, months: m, days: d, hours: h, minutes: min, seconds: sec } = dateDifference(initialDate, now);

  if (initialized && numberOfPhrasesChanged(y, m, d, h, min)) {
    setContainerHeight();
  }
  years.value = y;
  months.value = m;
  days.value = d;
  hours.value = h;
  minutes.value = min;
  seconds.value = sec;
  initialized = true;
}

/**
 * we don't track changes on seconds, since they change everytime. each 60 seconds second will be 0 seconds
 * and the 'number of phrases' will be changed. So we leave seconds out of the calculation and reanimate everything
 * only when other thing change. Keep in mind that if we add somehthing after (below) seconds to animate as well,
 * it will leave space to the seconds always. But that's probably what we want
 */
function numberOfPhrasesChanged(y: number, m: number, d: number, h: number, min: number) {
  return (
    partOfDateChangedFromOrToZero(years.value, y) ||
    partOfDateChangedFromOrToZero(months.value, m) ||
    partOfDateChangedFromOrToZero(days.value, d) ||
    partOfDateChangedFromOrToZero(hours.value, h) ||
    partOfDateChangedFromOrToZero(minutes.value, min)
  );
}

function getValidParagraphs() {
  return paragraphs.value?.filter((p) => p.innerText) || [];
}
function partOfDateChangedFromOrToZero(ref: number, newV: number) {
  return (!ref && newV) || (ref && !newV);
}

async function setContainerHeight() {
  await nextTick();
  if (!paragraphs.value) return;
  $emit('set-container-height', getValidParagraphs().length, paragraphsLength.value);
  setAnimateWordsEntering();
}
</script>

<style scoped lang="scss">
.c-LRWorkClock {
  min-width: 375px;
  container-type: size; // this allow us to use cqh and cqw unit sizes
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: $highlight;
  position: relative;
  height: clamp(15rem, 25vw, 40rem);
  margin-bottom: abs(calc(13rem - clamp(0rem, 15vw, 13rem)));

  h2 {
    font-size: clamp(1rem, 1vw, 3rem);
    white-space: nowrap;
  }
  p {
    white-space: nowrap;
    font-size: clamp(2rem, 3.5vw, 6rem);
    line-height: clamp(2rem, 3.5vw, 6rem);
  }
}
</style>
