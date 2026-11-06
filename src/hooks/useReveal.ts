import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion';

/**
 * Scroll reveal for a whole page. Anything marked with data-reveal is lifted into
 * place once, in document order, with an optional data-reveal-delay in seconds.
 * data-reveal="mask" wraps the element in a clipping band for image reveals.
 */
export function useReveal() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (prefersReducedMotion()) {
      gsap.set('[data-reveal], [data-line]', { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        const mode = el.dataset.reveal || 'up';
        const from: gsap.TweenVars = { opacity: 0, y: mode === 'up' || mode === 'fade' ? 22 : 0 };
        if (mode === 'mask') {
          from.clipPath = 'inset(0% 0% 100% 0%)';
          from.y = 0;
        }
        if (mode === 'scale') {
          from.scale = 1.06;
          from.y = 0;
        }
        gsap.from(el, {
          ...from,
          duration: mode === 'mask' ? 1.15 : 0.95,
          delay,
          ease: mode === 'mask' ? 'expo.out' : 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onStart: () => {
            el.style.willChange = 'transform, opacity';
          },
          onComplete: () => {
            el.style.willChange = '';
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const strength = Number(el.dataset.parallax ?? 12);
        gsap.fromTo(
          el,
          { yPercent: -strength / 2 },
          {
            yPercent: strength / 2,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const raw = el.dataset.count ?? '';
        const match = raw.match(/^([^\d]*)([\d.]+)([^\d]*)$/);
        if (!match) return;
        const [, prefix, value, suffix] = match;
        const target = Number(value);
        const decimals = value.includes('.') ? value.split('.')[1].length : 0;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);
}
