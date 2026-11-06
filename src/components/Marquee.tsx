import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

type Props = {
  items: string[];
  /** Speed in seconds for a full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
};

/**
 * Infinite, seamless marquee. Duplicates the content and loops xPercent; slows
 * down on hover so the words stay readable.
 */
export default function Marquee({ items, duration = 26, reverse = false, className = '', separator = '✳' }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const track = el.querySelector<HTMLElement>('.marquee__track');
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: reverse ? 50 : -50,
      duration,
      ease: 'none',
      repeat: -1,
    });

    const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.5 });
    const speed = () => gsap.to(tween, { timeScale: 1, duration: 0.5 });
    el.addEventListener('pointerenter', slow);
    el.addEventListener('pointerleave', speed);

    return () => {
      el.removeEventListener('pointerenter', slow);
      el.removeEventListener('pointerleave', speed);
      tween.kill();
    };
  }, [duration, reverse]);

  const row = (key: string) => (
    <div className="marquee__row" key={key} aria-hidden={key === 'b'}>
      {items.map((item, index) => (
        <span className="marquee__item" key={`${key}-${index}`}>
          {item}
          <span className="marquee__sep" aria-hidden="true">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`.trim()} ref={root}>
      <div className="marquee__track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
