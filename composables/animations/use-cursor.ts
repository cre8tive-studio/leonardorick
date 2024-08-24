import { animate } from 'motion';
import { useAnimationStore } from '~/store/animation';
// todo implement stuck state
// eslint-disable-next-line no-autofix/prefer-const
let isStuck = false;

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

const useCursor = () => {
  const { cursorOuter, cursorInner, cursorActivated: activated } = toRefs(useAnimationStore());

  function activate() {
    if (!cursorOuter.value || !cursorInner.value) return;

    document.body.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('scroll', scrollHandler);
    //   window.addEventListener('scroll', () => updateCursorPosition());
    const boundingClientRect = cursorOuter.value.getBoundingClientRect();
    cursorOuterOriginalState.width = boundingClientRect.width;
    cursorOuterOriginalState.height = boundingClientRect.height;

    document.body.addEventListener('pointerdown', () => {
      if (!cursorInner.value) return;

      animate(cursorInner.value, { scale: 2.1 }, { duration: 0.2 });
    });
    document.body.addEventListener('pointerup', () => {
      if (!cursorInner.value) return;

      animate(cursorInner.value, { scale: 1 }, { duration: 0.2 });
    });

    activated.value = true;
  }

  function scrollHandler(_e: Event) {
    cursor.y -= lastScrolledY;
    lastScrolledY = window.scrollY;
    cursor.y += lastScrolledY;

    cursor.x -= lastScrolledX;
    lastScrolledX = window.scrollX;
    cursor.x += lastScrolledX;
  }

  function updateCursorPosition(e: MouseEvent) {
    cursor.x = e.pageX;
    cursor.y = e.pageY;
  }

  function handleCursorEnter(_e: MouseEvent) {
    // todo: implement something. This functions are exposed to manipulate
    // todo: cursor border based on hovering another elements
    // if (!activated.value || !cursorOuter.value) return;
    // const outer = cursorOuter.value;
    // const targetEl = e.currentTarget as HTMLElement;
    // const targetBox = targetEl.getBoundingClientRect();
    // const computedStyle = getComputedStyle(targetEl);
    // // console.log('targetEl.style.borderRadius', getComputedStyle(targetEl).borderRadius);
    // if (!targetBox) return;
    // console.log(targetBox.left);
    // outer.style.x = `${targetBox.left}px`;
    // outer.style.y = `${targetBox.top + window.scrollY}px`;
    // outer.style.borderRadius = computedStyle.borderRadius;
    // isStuck = true;
    // gsap.to(cursorOuter.value, {
    //   duration: 0.2,
    //   x: targetBox.left,
    //   y: targetBox.top + window.scrollY,
    //   width: targetBox.width,
    //   height: targetBox.width,
    //   borderRadius: getComputedStyle(targetEl).borderRadius,
    //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // });
  }

  function handleCursorLeave(_e: MouseEvent) {
    // todo: implement something. This functions are exposed to manipulate
    // todo: cursor border based on hovering another elements
    // if (!activated.value || !cursorOuter.value) return;
    // isStuck = false;
    // console.log(cursorOuterOriginalState);
    // gsap.to(cursorOuter.value, {
    //   duration: 0.2,
    //   width: cursorOuterOriginalState.width,
    //   height: cursorOuterOriginalState.width,
    //   borderRadius: '50%',
    //   backgroundColor: 'transparent',
    // });
  }

  function rafCallback() {
    if (!activated.value || !cursorOuter.value || !cursorInner.value) return;

    animate(cursorInner.value, { x: cursor.x, y: cursor.y }, { duration: 0 });

    if (!isStuck) {
      animate(
        cursorOuter.value,
        {
          x: cursor.x - cursorOuterOriginalState.width / 2,
          y: cursor.y - cursorOuterOriginalState.height / 2,
        },
        { duration: 0.12 }
      );
    }
  }

  return {
    activate,
    rafCallback,
    handleCursorEnter,
    handleCursorLeave,
  };
};
export default useCursor;
