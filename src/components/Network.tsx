import { useEffect, useRef, useState } from 'react';
import { ports } from '../data/mapData';
import WorldMap from './WorldMap';
import { gsap, prefersReducedMotion, ScrollTrigger, transitionToId } from '../lib/motion';
import { ArrowRight } from './Icons';

const offices = ports.filter((port) => port.type === 'office');

export default function Network() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return;

    const paint = (progress: number) => {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.max(0.02, progress)})`;
      }
      const cards = track.querySelectorAll('[data-card]').length || 1;
      setActive(Math.min(cards - 1, Math.round(progress * (cards - 1))));
    };

    const mm = gsap.matchMedia();

    // Pinned scrub on every screen (reduced motion falls back to the swipe rail).
    if (!prefersReducedMotion()) {
      mm.add('(min-width: 0px)', () => {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance() + window.innerHeight * 0.35}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => paint(self.progress),
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          ScrollTrigger.refresh();
        };
      });
    }

    // Native swipe rail: small screens, and reduced motion at any width.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const onScroll = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        paint(max > 0 ? viewport.scrollLeft / max : 1);
      };
      viewport.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => viewport.removeEventListener('scroll', onScroll);
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="network" id="network" ref={sectionRef}>
      <div className="network__fixed">
        <div className="wrap">
          <div className="section-head network__head">
            <div className="section-head__title">
              <span className="eyebrow">
                <span className="eyebrow__num">04</span> Network
              </span>
              <h2>
                One accountable <span className="accent">contract</span><span className="accent">.</span>
              </h2>
            </div>
            <div className="section-head__intro">
              <p>
                Owned offices in the ports that matter, partner agents in the ports that do not.
                The office that quotes the lane owns the file.
              </p>
            </div>
          </div>
        </div>

        <div className="network__viewport" ref={viewportRef}>
          <div className="network__track" ref={trackRef}>
            <article className="hub hub--intro" data-card>
              <span className="hub__index">01 / 13</span>
              <p className="hub__statement">
                12 owned offices. 60+ partner agents. <em>One accountable contract.</em>
              </p>
              <p className="hub__copy">
                We do not hand your cargo to a stranger. Partner agents work to our document and
                escalation path.
              </p>
              <a className="btn btn--primary" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
                <span>Request a quote</span>
                <ArrowRight className="btn__arrow" />
              </a>
            </article>

            {offices.map((office, index) => (
              <article className="hub" key={office.id} data-card>
                <div className="hub__top">
                  <span className="hub__index">
                    {String(index + 2).padStart(2, '0')} / 13
                  </span>
                  <span className="hub__type">Owned</span>
                </div>
                <h3 className="hub__name">{office.name}</h3>
                <p className="hub__country">{office.country}</p>
                <dl className="hub__meta">
                  <div>
                    <dt>Hub</dt>
                    <dd>{office.region}</dd>
                  </div>
                  <div>
                    <dt>Coverage</dt>
                    <dd>Sea · Air · Road</dd>
                  </div>
                  <div>
                    <dt>Desk hours</dt>
                    <dd>24 / 7</dd>
                  </div>
                </dl>
                <span className="hub__arrow" aria-hidden="true">
                  <ArrowRight className="icon-20" />
                </span>
              </article>
            ))}

            <article className="hub hub--map" data-card>
              <div className="hub__map">
                <WorldMap variant="network" />
              </div>
              <div className="hub__map-caption">
                <span className="label">Meridian network</span>
                <p>Hover a pin for the hub name. Partner ports are small dots.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="wrap">
          <div className="network__foot">
            <div className="network__progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>
            <span className="label network__counter">
              {String(active + 1).padStart(2, '0')} / {String(offices.length + 2).padStart(2, '0')}
            </span>
          </div>
        </div>
        <span className="network__index" aria-hidden="true">Network</span>
      </div>
    </section>
  );
}
