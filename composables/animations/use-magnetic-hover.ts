import { gsap } from 'gsap';
import { useAnimationStore } from '~/store/animation';
import { isAttrActivatedOnElement } from '~/utils/js-utilities';

interface MagneticChildReferenceModel {
  element: HTMLElement | SVGElement | null;
  shouldAnimateOut: boolean;
  shouldAnimatateIn: boolean;
}

// be careful with this because it was not developed in a way that allow multiple usages.
// I honestly just found this solution could reach what I want but this composible probably
// should only be used once

// ? be aware that with this solution, the only buttons that can work are the ones that are attached to the DOM before this function runs
// ? and is never removed. The buttons on other pages that are navigated after this activation will not have listeners set
const useMagneticHover = () => {
  const { isMagneticHoverActivated: activated } = toRefs(useAnimationStore());
  const magneticChildrenReferences = new WeakMap<Element, MagneticChildReferenceModel>();
  const lastHoveredEl = ref<HTMLElement | null>(null);
  const hoveredEls: HTMLElement[] = [];
  const wrappers: HTMLElement[] = [];
  let mouseEvent: MouseEvent;

  function registerElement(el: HTMLElement) {
    setChildrenReference(el);
  }

  function activate() {
    for (const el of document.querySelectorAll('[lr-magnetic-hover]')) {
      const element = el as HTMLElement;
      wrappers.push(element);
      setChildrenReference(element);
      setListeners(element);
    }
    activated.value = true;
  }

  onUnmounted(() => {
    for (const wrapper of wrappers) {
      removeListeners(wrapper);
    }
  });

  function handleCursorEnter(this: HTMLElement) {
    const self = this as HTMLElement;
    const ref = magneticChildrenReferences.get(self);
    if (ref && isAttrActivatedOnElement(self, 'lr-magnetic-hover')) {
      hoveredEls.push(self);
      lastHoveredEl.value = self;
      magneticChildrenReferences.set(self, { ...ref, shouldAnimatateIn: true, shouldAnimateOut: false });
    }
  }

  function handleCursorLeave(this: HTMLElement) {
    const self = this as HTMLElement;
    const ref = magneticChildrenReferences.get(self);

    hoveredEls.push(self);
    if (ref) {
      magneticChildrenReferences.set(self, { ...ref, shouldAnimatateIn: false, shouldAnimateOut: true });
    }
  }

  function handleCursorMove(this: HTMLElement, e: MouseEvent) {
    mouseEvent = e;
    const self = this as HTMLElement;
    const ref = magneticChildrenReferences.get(self);

    if (ref && isAttrActivatedOnElement(self, 'lr-magnetic-hover')) {
      lastHoveredEl.value = self;
      magneticChildrenReferences.set(self, { ...ref, shouldAnimatateIn: true, shouldAnimateOut: false });
    }
  }

  function rafCallback() {
    if (!activated.value || !(hoveredEls.length || lastHoveredEl.value)) return;

    const el = hoveredEls.pop() || lastHoveredEl.value;
    lastHoveredEl.value = null;

    if (!el || !mouseEvent) return;

    const ref = magneticChildrenReferences.get(el);
    if (!ref) return;

    const { element, shouldAnimatateIn, shouldAnimateOut } = ref;

    if (!element || !(shouldAnimatateIn || shouldAnimateOut)) return;

    const { offsetX, offsetY } = mouseEvent;
    const { offsetWidth: width, offsetHeight: height } = el;

    const MOTION_MOVE_STRENGTH = 10; // GSAP better
    // const MOTION_MOVE_STRENGTH = 25;
    const xMove = (offsetX / width) * (MOTION_MOVE_STRENGTH * 2) - MOTION_MOVE_STRENGTH;
    const yMove = (offsetY / height) * (MOTION_MOVE_STRENGTH * 2) - MOTION_MOVE_STRENGTH;

    if (shouldAnimateOut) {
      gsap.to(element, {
        duration: 0.2,
        transform: '',
        // color: COLORS.mainDarkText,
        onComplete: () => {
          magneticChildrenReferences.set(el, { ...ref, shouldAnimateOut: false });
        },
      });
      // motion was being buggy, be careful
      // animate(
      //   element,
      //   { transform: 'translate(0px, 0px) scale(1)', color: COLORS.mainDarkText },
      //   { easing: spring({ velocity: 400 }) }
      // ).finished.then(() => magneticChildrenReferences.set(el, { ...ref, shouldAnimateOut: false }));
    }

    if (shouldAnimatateIn) {
      gsap.to(element, {
        duration: 0.2,
        scale: 1.2,
        // color: COLORS.highlight3,
        transform: `translate(${xMove}px, ${yMove}px)`,
      });
      // motion was being buggy, be careful
      // animate(
      //   element,
      //   { transform: `translate(${xMove}px, ${yMove}px) scale(1.15)`, color: COLORS.highlight3 },

      //   { easing: spring({ velocity: 400 }) }
      // );
    }
  }
  function setChildrenReference(el: HTMLElement) {
    magneticChildrenReferences.set(el, {
      element: el.querySelector('svg'),
      shouldAnimatateIn: true,
      shouldAnimateOut: false,
    });
  }

  function setListeners(el: HTMLElement) {
    el.addEventListener('mouseenter', handleCursorEnter);
    el.addEventListener('mousemove', handleCursorMove);
    el.addEventListener('mouseleave', handleCursorLeave);
  }

  function removeListeners(el: HTMLElement) {
    el.removeEventListener('mouseenter', handleCursorEnter);
    el.removeEventListener('mousemove', handleCursorMove);
    el.removeEventListener('mouseleave', handleCursorLeave);
  }

  return {
    activate,
    rafCallback,
    registerElement,
    // this listeners should be used by
    // any element that wants to be magnetic
    listeneers: {
      mouseenter: handleCursorEnter,
      mousemove: handleCursorLeave,
      mouseleave: handleCursorMove,
    },
  };
};
export default useMagneticHover;
