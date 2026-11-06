import { useEffect } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';

/**
 * Magnetic pull for primary actions: the button eases toward the pointer and
 * snaps back with a spring when the pointer leaves. Desktop only.
 */
export function useMagnetic(selector = '.btn--primary, .hero__scroll, .nav__link') {
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!nodes.length) return;

    const cleanups: (() => void)[] = [];

    nodes.forEach((node) => {
      const strength = node.dataset.magnet ? Number(node.dataset.magnet) : 0.28;
      const xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength * 0.8);
      };
      const onLeave = () => {
        gsap.to(node, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      };

      node.addEventListener('pointermove', onMove);
      node.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        node.removeEventListener('pointermove', onMove);
        node.removeEventListener('pointerleave', onLeave);
        gsap.killTweensOf(node);
        gsap.set(node, { x: 0, y: 0 });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [selector]);
}
