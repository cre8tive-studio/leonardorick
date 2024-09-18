import { gsap } from 'gsap';
import { useAnimationStore } from '~/store/animation';

const cursor = {
  x: -100,
  y: -100,
};
const cursorOuterOriginalState = {
  width: 48,
  height: 48,
};

let lastScrolledY = 0;
let lastScrolledX = 0;
let buttons = 0;
let lastTargetBox: DOMRect;

const elementsToFocus = new Set<HTMLElement>();

const useCursor = () => {
  const { cursorOuter, cursorInner, isCursorActivated: activated } = toRefs(useAnimationStore());
  const route = useRoute();

  function activate() {
    if (!cursorOuter.value) return;
    setCursorOuterOriginalState();

    activated.value = true;
  }

  watch(
    () => route.path,
    () => {
      if (!activated.value || !cursorOuter.value) return;
      gsap.to(cursorOuter.value, {
        duration: 0,
        x: lastTargetBox.x,
        y: lastTargetBox.y,
      });
    }
  );

  function setCursorOuterOriginalState() {
    if (!cursorOuter.value) return;
    const boundingClientRect = cursorOuter.value.getBoundingClientRect();
    cursorOuterOriginalState.width = boundingClientRect.width;
    cursorOuterOriginalState.height = boundingClientRect.height;
  }

  function scrollHandler(_e: Event) {
    cursor.y -= lastScrolledY;
    lastScrolledY = window.scrollY;
    cursor.y += lastScrolledY;

    cursor.x -= lastScrolledX;
    lastScrolledX = window.scrollX;
    cursor.x += lastScrolledX;
  }

  function mousemoveHandler(e: MouseEvent) {
    const el = e.target as HTMLElement;
    const attr = el.attributes.getNamedItem('lr-cursor');
    if (attr) {
      if (!elementsToFocus.has(el)) {
        elementsToFocus.add(el);
      }
    } else {
      animateCursorLeave();
    }

    updateCursorPosition(e);
    // handle click and drag not triggering pointerup
    // https://stackoverflow.com/a/48970682/10526869
    if (e.buttons !== buttons) {
      buttons = e.buttons;
      if (e.buttons === 0) {
        handlePointerUp();
      }
    }
  }

  function handlePointerUp(_e?: PointerEvent) {
    if (!cursorInner.value) return;
    gsap.to(cursorInner.value, { scale: 1, duration: 0.2 });
  }

  function handlePointerDown(_e: PointerEvent) {
    if (!cursorInner.value) return;
    gsap.to(cursorInner.value, { scale: 2.1, duration: 0.2 });
  }

  function updateCursorPosition(e: MouseEvent) {
    cursor.x = e.pageX;
    cursor.y = e.pageY;
  }

  function animateCursorEnter(targetEl: HTMLElement) {
    if (!activated.value || !cursorOuter.value || !targetEl) return;
    const targetBox = targetEl.getBoundingClientRect();
    lastTargetBox = targetBox;

    // ANIMATION 2;
    gsap.killTweensOf(cursorOuter.value);
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      x: targetBox.x + window.scrollX,
      y: targetBox.y + window.scrollY,
      width: targetBox.width,
      height: targetBox.height,
      opacity: 1,
      borderRadius: getComputedStyle(targetEl).borderRadius,
    });
  }

  function animateCursorLeave() {
    if (!activated.value || !cursorOuter.value) return;
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      width: cursorOuterOriginalState.width,
      height: cursorOuterOriginalState.width,
      borderRadius: '50%',
    });
  }

  function rafCallback() {
    if (!activated.value || !cursorOuter.value || !cursorInner.value) return;

    gsap.to(cursorInner.value, { x: cursor.x, y: cursor.y, duration: 0 });

    const elToFocus = shiftSet(elementsToFocus);
    if (elToFocus) {
      animateCursorEnter(elToFocus);
    }

    // ANIMATION 1;
    gsap.to(cursorOuter.value, {
      duration: 0.5,
      x: cursor.x - cursorOuterOriginalState.width / 2,
      y: cursor.y - cursorOuterOriginalState.height / 2,
    });
  }

  function shiftSet(set: Set<HTMLElement>) {
    for (const v of set) {
      set.delete(v);
      return v;
    }
  }

  return {
    activate,
    rafCallback,
    listeners: {
      mousemove: mousemoveHandler,
      pointerup: handlePointerUp,
      pointerdown: handlePointerDown,
      scroll: scrollHandler,
    },
  };
};
export default useCursor;
