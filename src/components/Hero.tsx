import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion';
import WorldMap from './WorldMap';
import { ArrowRight } from './Icons';

const facts = [
  { value: '38', label: 'Years operating' },
  { value: '140+', label: 'Countries' },
  { value: '2.1M', label: 'Shipments cleared' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set('[data-hero-line] .line__inner', { yPercent: 0, opacity: 1, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set('[data-hero-line] .line__inner', { yPercent: 108, opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('[data-hero-line] .line__inner', {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.11,
        delay: 0.15,
      })
        .from('.hero__eyebrow > *', { opacity: 0, y: 12, duration: 0.9, stagger: 0.08 }, 0.1)
        .from('.hero__lead, .hero__actions', { opacity: 0, y: 18, duration: 1, stagger: 0.1 }, 0.55)
        .from('.hero__meta', { opacity: 0, y: 16, duration: 1 }, 0.8)
        .from('.hero__map-frame', { opacity: 0, scale: 1.04, duration: 1.6 }, 0.25)
        .fromTo('.map__land', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.5)
        .fromTo('.map__route', { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.07 }, 0.8)
        .fromTo(
          '.route-mask',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' },
          0.9,
        )
        .from('.port', { opacity: 0, scale: 0.4, transformOrigin: 'center', duration: 0.8, stagger: 0.012 }, 1.1);

      // Parallax: map drifts slower than the copy as the hero leaves.
      gsap.to('.hero__map-frame', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.hero__copy', {
        yPercent: -12,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__ambient" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__top">
          <div className="hero__eyebrow">
            <span className="label label--gold">Freight forwarding &amp; trade management</span>
            <span className="hero__rule" />
            <span className="label">Since 1988</span>
          </div>
          <p className="hero__stamp">
            <span className="hero__stamp-dot" />
            Route desk live · Rotterdam
          </p>
        </div>

        <div className="hero__main">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span className="line" data-hero-line>
                <span className="line__inner">Every route,</span>
              </span>
              <span className="line" data-hero-line>
                <span className="line__inner">
                  <em>accounted</em> for.
                </span>
              </span>
            </h1>

            <div className="hero__lead-row">
              <p className="hero__lead">
                End-to-end freight and trade management across 140+ countries. Sea, air and land —
                under one accountable partner.
              </p>
              <div className="hero__actions">
                <button className="btn btn--primary" type="button" onClick={() => scrollToId('contact')}>
                  Request a quote
                  <ArrowRight className="btn__arrow" />
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => scrollToId('routes')}>
                  Open the route desk
                  <ArrowRight className="btn__arrow" />
                </button>
              </div>
            </div>
          </div>

          <div className="hero__map">
            <div className="hero__map-frame">
              <WorldMap variant="hero" />
            </div>
            <div className="hero__map-caption">
              <span className="hero__map-index">01</span>
              <span className="label">Live network</span>
              <p>Rotterdam · Singapore · New York</p>
            </div>
          </div>
        </div>

        <div className="hero__meta">
          <div className="hero__facts">
            {facts.map((fact) => (
              <div key={fact.label} className="hero__fact">
                <strong data-count={fact.value}>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>

          <div className="hero__clients">
            <span className="label">Selected clients</span>
            <p>Automotive OEM · Pharma distribution · Industrial parts · Retail import</p>
            <span className="hero__note">Client names available under NDA.</span>
          </div>

          <button className="hero__scroll" type="button" onClick={() => scrollToId('routes')} aria-label="Scroll to the route desk">
            <span>Scroll</span>
            <span className="hero__scroll-line" />
          </button>
        </div>
      </div>
    </section>
  );
}
