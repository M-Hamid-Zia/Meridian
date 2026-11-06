import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

export const CURVE_EVENT = 'meridian:curve';

type CurveDetail = { run: () => void };

const HIDDEN = 100;
const COVERED = 0;
const GONE = -110;

/**
 * A curved swipe used as an in-page transition: the curve rises over the
 * viewport, the destination scrolls while the screen is covered, then the
 * curve slides away.
 *
 * The transform is written directly from a single progress object so it can
 * never desync from the stylesheet, and `reset()` guarantees the page is never
 * left behind a stuck curtain.
 */
export default function CurveSwipe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const busy = useRef(false);
  const state = useRef({ y: HIDDEN, bow: 7 });

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const paint = () => {
      const { y, bow } = state.current;
      root.style.transform = `translate3d(0, ${y}%, 0)`;
      path.setAttribute('d', `M0 0 L0 ${100 - bow} Q50 ${100 - bow * 1.9} 100 ${100 - bow} L100 0 Z`);
      root.dataset.active = busy.current || (y > GONE + 1 && y < HIDDEN - 1) ? 'true' : 'false';
    };

    const reset = (immediate = false) => {
      busy.current = false;
      if (immediate) {
        state.current.y = HIDDEN;
        state.current.bow = 7;
        paint();
        return;
      }
      gsap.to(state.current, {
        y: HIDDEN,
        bow: 7,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: paint,
        onComplete: () => {
          paint();
          root.dataset.active = 'false';
        },
      });
    };

    paint();

    const onCurve = (event: Event) => {
      const detail = (event as CustomEvent<CurveDetail>).detail;
      if (!detail) return;
      if (busy.current) return;

      if (prefersReducedMotion()) {
        detail.run();
        return;
      }

      busy.current = true;
      state.current.y = HIDDEN;
      state.current.bow = 7;
      paint();

      const tl = gsap.timeline({
        onComplete: () => reset(),
      });

      tl.to(state.current, { y: COVERED, bow: 9, duration: 0.66, ease: 'power3.inOut', onUpdate: paint })
        .add(() => {
          detail.run();
          root.dataset.active = 'true';
        })
        .to(state.current, { y: GONE, bow: 5, duration: 0.82, ease: 'power3.inOut', onUpdate: paint }, '+=0.08');

      // Safety net: never leave the curtain over the page.
      window.setTimeout(() => {
        if (busy.current) reset(true);
      }, 2600);
    };

    window.addEventListener(CURVE_EVENT, onCurve as EventListener);
    return () => {
      window.removeEventListener(CURVE_EVENT, onCurve as EventListener);
      reset(true);
    };
  }, []);

  return (
    <div className="curve" ref={rootRef} data-active="false" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={pathRef} d="M0 0 L0 93 Q50 88 100 93 L100 0 Z" />
      </svg>
    </div>
  );
}
