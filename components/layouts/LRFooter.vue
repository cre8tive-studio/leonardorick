<template>
  <footer
    class="lr-section-bottom lr-overlaping-allow-hover c-LRFooter items-end display-none fixed bottom-0 hidden xl:flex"
  >
    <nav>
      <ul class="flex flex-col">
        <li
          v-for="(link, index) of links"
          :key="index"
          ref="lis"
          calss="main-hover-button"
          @mouseenter="handleMouseEnter"
          @mousemove="handleMousemove"
          @mouseleave="handleMouseleave"
        >
          <NuxtLink
            :to="link.link"
            target="_blank"
          >
            <component :is="link.svg" />
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { animate, spring } from 'motion';
import SvgoSpotify from '~/assets/icons/spotify.svg';
import SvgoGithub from '~/assets/icons/github.svg';
import SvgoLinkedin from '~/assets/icons/linkedin.svg';
import SvgoStackoverflow from '~/assets/icons/stackoverflow.svg';
import { COLORS } from '~/utils/constants/colors';
interface SvgReferenceModel {
  svg: SVGElement | null;
  shouldAnimateOut: boolean;
  shouldAnimatateIn: boolean;
}

const lastHoveredEl = ref<HTMLLIElement | null>(null);
const hoveredEls: HTMLLIElement[] = [];
const lis = ref<HTMLLIElement[]>();
const svgReferences = new WeakMap<HTMLLIElement, SvgReferenceModel>();
let mouseEvent: MouseEvent;

const links = [
  {
    link: 'https://spotify.com',
    svg: SvgoSpotify,
  },
  {
    link: 'https://github.com',
    svg: SvgoGithub,
  },
  {
    link: 'https://linkedin.com',
    svg: SvgoLinkedin,
  },
  {
    link: 'https://stackoverflow.com',
    svg: SvgoStackoverflow,
  },
];

function handleMouseEnter(e: MouseEvent) {
  const li = e.target as HTMLLIElement;
  const ref = svgReferences.get(li);
  lastHoveredEl.value = li;
  hoveredEls.push(li);
  if (ref) {
    svgReferences.set(li, { ...ref, shouldAnimatateIn: true, shouldAnimateOut: false });
  }
}

function handleMouseleave(e: MouseEvent) {
  const li = e.target as HTMLLIElement;
  const ref = svgReferences.get(li);
  hoveredEls.push(li);
  if (ref) {
    svgReferences.set(li, { ...ref, shouldAnimatateIn: false, shouldAnimateOut: true });
  }
}

function handleMousemove(e: MouseEvent) {
  const a = e.target as HTMLAnchorElement;
  const li = a.parentElement as HTMLLIElement;
  const ref = svgReferences.get(li);
  lastHoveredEl.value = li;
  if (ref) {
    svgReferences.set(li, { ...ref, shouldAnimatateIn: true, shouldAnimateOut: false });
  }
  mouseEvent = e;
}

onMounted(() => {
  animateMagnet();

  if (!lis.value) return;
  for (const li of lis.value) {
    svgReferences.set(li, { svg: li.querySelector('svg'), shouldAnimatateIn: true, shouldAnimateOut: false });
  }
});

function animateMagnet() {
  const li = hoveredEls.pop() || lastHoveredEl.value;
  if (!li || !mouseEvent) {
    requestAnimationFrame(animateMagnet);
    return;
  }

  const ref = svgReferences.get(li);
  if (!ref) {
    requestAnimationFrame(animateMagnet);
    return;
  }
  const { svg, shouldAnimatateIn, shouldAnimateOut } = ref;
  if (!svg) {
    requestAnimationFrame(animateMagnet);
    return;
  }

  const { offsetX, offsetY } = mouseEvent;
  const { offsetWidth: width, offsetHeight: height } = li;

  // const GSAP_MOVE_STRENGTH = 15;
  const MOTION_MOVE_STRENGTH = 30;
  const xMove = (offsetX / width) * (MOTION_MOVE_STRENGTH * 2) - MOTION_MOVE_STRENGTH;
  const yMove = (offsetY / height) * (MOTION_MOVE_STRENGTH * 2) - MOTION_MOVE_STRENGTH;

  if (shouldAnimateOut) {
    // gsap.to(svg, {
    //   duration: 0.2,
    //   transform: '',
    //   color: COLORS.mainDarkText,
    //   onComplete: () => {
    //     svgReferences.set(li, { ...ref, shouldAnimateOut: false });
    //   },
    // });
    animate(
      svg,
      { transform: 'translate(0px, 0px) scale(1)', color: COLORS.mainDarkText },
      { easing: spring({ velocity: 500 }) }
    ).finished.then(() => svgReferences.set(li, { ...ref, shouldAnimateOut: false }));
  }

  if (shouldAnimatateIn) {
    // gsap.to(svg, {
    //   duration: 0.2,
    //   scale: 1.2,
    //   color: COLORS.highlight3,
    //   transform: `translate(${xMove}px, ${yMove}px)`,
    // });
    animate(
      svg,
      { transform: `translate(${xMove}px, ${yMove}px) scale(1.2)`, color: COLORS.highlight3 },

      { easing: spring({ velocity: 500 }) }
    );
  }

  requestAnimationFrame(animateMagnet);
}
</script>

<style scoped lang="scss">
.c-LRFooter {
  min-width: $sides-xl-width;

  li {
    --size: 72px;
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 300ms ease;
      cursor: none;

      svg {
        height: 24px;
        width: 24px;
        pointer-events: none;
      }
    }
  }
}
</style>
