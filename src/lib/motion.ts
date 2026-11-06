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

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.15 });
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}
