declare global {
  interface Window {
    __meridianScrollTop?: () => void;
    __meridianScrollTo?: (y: number) => void;
  }
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

/** Smooth, inertia-led scrolling. Disabled under reduced motion. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.15,
  });

  lenis.on('scroll', ScrollTrigger.update);
  // Keep in-page hash links (e.g. reloading on #contact) aligned with Lenis.
  const syncFromHash = () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (target) lenis?.scrollTo(target as HTMLElement, { immediate: true });
  };
  window.requestAnimationFrame(() => window.setTimeout(syncFromHash, 60));
  (window as unknown as { __meridianScrollTop?: () => void }).__meridianScrollTop = () => {
    lenis?.scrollTo(0, { duration: 1.1 });
  };
  (window as unknown as { __meridianScrollTo?: (y: number) => void }).__meridianScrollTo = (y: number) => {
    lenis?.scrollTo(y, { immediate: true });
  };

  const raf = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Jumps straight to a section without animation (used under the curve swipe). */
export function jumpToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, immediate: true });
    return;
  }
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.15 });
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Runs a navigation behind the curved swipe transition. The curve only appears
 * when the move is long enough to be worth it, so nearby sections still feel direct.
 */
export function transitionToId(id: string) {
  const el = document.getElementById(id);
  if (!el || prefersReducedMotion()) {
    jumpToId(id);
    return;
  }
  const distance = Math.abs(el.getBoundingClientRect().top);
  if (distance < window.innerHeight * 0.6) {
    scrollToId(id);
    return;
  }
  window.dispatchEvent(new CustomEvent('meridian:curve', { detail: { run: () => jumpToId(id) } }));
}
