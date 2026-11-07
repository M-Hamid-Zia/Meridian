import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, transitionToId } from '../lib/motion';
import WorldMap from './WorldMap';
import { ArrowRight } from './Icons';
import { ports } from '../data/mapData';

// Simplified region list shown on small screens instead of the map.
const regionList: { region: string; cities: string }[] = (() => {
  const grouped = new Map<string, string[]>();
  for (const port of ports) {
    if (port.type !== 'office') continue;
    const list = grouped.get(port.region) ?? [];
    list.push(port.name);
    grouped.set(port.region, list);
  }
  return [...grouped.entries()].map(([region, cities]) => ({ region, cities: cities.join(' · ') }));
})();

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
        .from('.hero__lead, .hero__actions', { opacity: 0, y: 18, duration: 1, stagger: 0.1 }, 0.3)
        .from('.hero__map-bg', { opacity: 0, scale: 1.05, duration: 1.8 }, 0.25)
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
      gsap.to('.map__svg', {
        scale: 1.07,
        transformOrigin: '62% 45%',
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.hero__map-bg', {
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
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__map-bg">
        <WorldMap variant="hero" />
      </div>

      <div className="hero__inner">
        <div className="hero__main">
          <div className="hero__copy">
            <h1 className="hero__title" id="hero-title">
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
                Ocean, air and customs across 140+ countries, with one named specialist.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
                  <span>Request a quote</span>
                  <ArrowRight className="btn__arrow" />
                </a>
                <a className="text-link text-link--light" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
                  Speak to a specialist
                  <ArrowRight className="text-link__icon" />
                </a>
              </div>
            </div>
          </div>


          <div className="hero__regions">
            <span className="label label--gold">Owned offices by region</span>
            <ul className="hero__regions-grid">
              {regionList.map(({ region, cities }) => (
                <li key={region}>
                  <span className="hero__regions-name">{region}</span>
                  <span className="hero__regions-cities">{cities}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
