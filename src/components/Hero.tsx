import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import WorldMap from './WorldMap';
import { ArrowRight } from './Icons';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-eyebrow, .hero-title, .hero-rule, .hero-lead, .hero-actions', {
        opacity: 0,
        y: 14,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.075,
        delay: 0.12,
        ease: 'power2.out',
      });
      gsap.fromTo('.hero-rule', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.1,
        delay: 0.55,
        ease: 'power2.inOut',
      });
      gsap.fromTo('.map__land', { opacity: 0 }, {
        opacity: 1,
        duration: 1.2,
        delay: 0.1,
        ease: 'power2.out',
      });
      gsap.fromTo('.map__route', { opacity: 0 }, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.4,
        ease: 'power2.out',
      });
      gsap.fromTo('.route-mask', { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.12,
        delay: 0.5,
        ease: 'power2.inOut',
      });
      gsap.fromTo('.hero-trust', { opacity: 0, y: 10 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.7,
        ease: 'power2.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap hero__wrap">
        <div className="hero__text">
          <div className="hero__eyebrow">
            <span>Freight forwarding &amp; trade management</span>
            <span className="gold-dot" />
            <span className="hero__since">Since 1988</span>
          </div>
          <h1 className="hero__title">
            Every route,
            <br />
            <em>accounted for.</em>
          </h1>
          <div className="hero-rule" />
          <p className="hero__lead">
            End-to-end freight and trade management across 140+ countries. Sea, air, and land — under one accountable partner.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Request a Quote
              <ArrowRight className="btn__arrow" />
            </a>
            <a className="link link--hero" href="#contact">
              or speak to a route specialist
              <ArrowRight className="link__arrow" />
            </a>
          </div>
        </div>

        <div className="hero__map">
          <WorldMap variant="hero" />
        </div>
      </div>

      <div className="wrap hero__foot">
        <div className="hero-trust">
          <div className="hero-trust__clients">
            <span className="label">Selected clients</span>
            <p>Automotive OEM · Pharma distribution · Industrial parts · Retail import</p>
            <span className="hero-trust__note">Client names available under NDA.</span>
          </div>
          <div className="hero-trust__facts">
            <div><strong>38</strong><span>years operating</span></div>
            <div><strong>140+</strong><span>countries</span></div>
            <div><strong>2.1M</strong><span>shipments cleared</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
