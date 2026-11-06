import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Page-load curtain: a paper panel with a counter that lifts away to reveal the
 * hero. Runs once, is skipped under reduced motion, and never blocks input.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      setGone(true);
      return;
    }

    const el = root.current;
    if (!el) return;
    document.body.style.overflow = 'hidden';

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setGone(true);
        onDone();
      },
    });

    tl.from('.intro__word', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 })
      .to(
        counter,
        {
          v: 100,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        },
        0.15,
      )
      .to('.intro__word', { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.04 }, 0.95)
      .to('.intro__rule', { scaleX: 1, duration: 0.8, ease: 'expo.inOut' }, 0.85)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 1.25);

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__label">Meridian</span>
        <p className="intro__title">
          <span className="intro__line">
            <span className="intro__word">Freight,&nbsp;</span>
          </span>
          <span className="intro__line">
            <span className="intro__word"><em>accounted for.</em></span>
          </span>
        </p>
        <div className="intro__foot">
          <span className="intro__rule" />
          <span className="intro__count">
            <span ref={countRef}>000</span>
            <em>%</em>
          </span>
        </div>
      </div>
    </div>
  );
}
