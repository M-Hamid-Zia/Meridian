import { useEffect, useMemo, useRef, useState } from 'react';
import { cargoTypes, getLane, regions, type CargoId, type RegionId } from '../data/routes';
import type { QuotePrefill, RoutePreset } from '../App';
import { ArrowRight, ModeIcon } from './Icons';
import MiniRouteMap from './MiniRouteMap';
import { gsap, prefersReducedMotion } from '../lib/motion';

type Props = {
  preset: RoutePreset | null;
  onRequestQuote: (prefill: Omit<QuotePrefill, 'nonce'>) => void;
};

export default function RouteSelector({ preset, onRequestQuote }: Props) {
  const [origin, setOrigin] = useState<RegionId>(preset?.origin ?? 'europe');
  const [destination, setDestination] = useState<RegionId>(preset?.destination ?? 'north-america');
  const [cargo, setCargo] = useState<CargoId>(preset?.cargo ?? 'general');
  const [step, setStep] = useState(1);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preset) return;
    if (preset.origin) setOrigin(preset.origin);
    if (preset.destination) setDestination(preset.destination);
    if (preset.cargo) setCargo(preset.cargo);
  }, [preset]);

  const lane = useMemo(() => getLane(origin, destination, cargo), [origin, destination, cargo]);

  useEffect(() => {
    if (!resultRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.route-option', {
        opacity: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.from('.route-result__lane > *', {
        opacity: 0,
        y: 8,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        overwrite: true,
      });
    }, resultRef);
    return () => ctx.revert();
  }, [lane]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(3);
    resultRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section className="section routes" id="routes">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow" data-reveal>
              <span className="eyebrow__num">01</span> Route desk
            </span>
            <h2 data-reveal data-reveal-delay={0.05}>
              Find your trade lane<span className="accent">.</span>
            </h2>
          </div>
          <div className="section-head__intro" data-reveal data-reveal-delay={0.12}>
            <p>
              Choose an origin, a destination and the cargo. We show the modes, the transit windows
              and the specialist who owns the lane.
            </p>
            <span className="micro-note">Indicative transit times. A specialist confirms the schedule.</span>
          </div>
        </div>

        <div className="routes__media" data-reveal="mask">
          <img
            src="/images/route-port.webp"
            alt="Container cranes at a deep-water port at dusk"
            width="1200"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <span className="routes__media-tag">Rotterdam · 51.9° N, 4.5° E</span>
        </div>

        <form className="route-panel" onSubmit={submit} data-reveal data-reveal-delay={0.06}>
          <div className="route-panel__bar">
            <span className="label label--dark">Lane calculator</span>
            <span className="route-panel__steps" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`route-panel__step${step >= n ? ' is-on' : ''}`}>
                  0{n}
                </span>
              ))}
            </span>
          </div>

          <div className="route-panel__fields">
            <label className="field">
              <span className="field__label">Origin</span>
              <span className="select-wrap">
                <select
                  value={origin}
                  onChange={(event) => {
                    setOrigin(event.target.value as RegionId);
                    setStep(2);
                  }}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">{regions.find((region) => region.id === origin)?.ports}</span>
            </label>

            <span className="route-panel__arrow" aria-hidden="true">→</span>

            <label className="field">
              <span className="field__label">Destination</span>
              <span className="select-wrap">
                <select
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value as RegionId);
                    setStep(2);
                  }}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">{regions.find((region) => region.id === destination)?.ports}</span>
            </label>

            <label className="field">
              <span className="field__label">Cargo</span>
              <span className="select-wrap">
                <select
                  value={cargo}
                  onChange={(event) => {
                    setCargo(event.target.value as CargoId);
                    setStep(2);
                  }}
                >
                  {cargoTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">Equipment and handling confirmed by the desk.</span>
            </label>

            <button className="btn btn--primary route-panel__submit" type="submit">
              Show options
              <ArrowRight className="btn__arrow" />
            </button>
          </div>

          <MiniRouteMap origin={origin} destination={destination} />

          <div className="route-result" ref={resultRef} aria-live="polite">
            <div className="route-result__head">
              <div className="route-result__lane">
                <span className="route-result__city">{lane.origin.hub}</span>
                <span className="route-result__line">
                  <span className="route-result__dot" />
                  <span className="route-result__dash" />
                  <span className="route-result__mode">{lane.recommended.mode}</span>
                  <span className="route-result__dash" />
                  <span className="route-result__dot" />
                </span>
                <span className="route-result__city">{lane.destination.hub}</span>
              </div>
              <span className="route-result__badge">{lane.cargo.short}</span>
            </div>

            <div className="route-options">
              {lane.options.map((option) => (
                <div className={`route-option${option.recommended ? ' route-option--recommended' : ''}`} key={option.mode}>
                  <div className="route-option__mode">
                    <ModeIcon mode={option.mode} className="icon-20" />
                    <div>
                      <strong>{option.mode}</strong>
                      <span>{option.frequency}</span>
                    </div>
                  </div>
                  <div className="route-option__transit">{option.transit}</div>
                  <p className="route-option__note">{option.note}</p>
                  {option.recommended && <span className="route-option__tag">Recommended</span>}
                </div>
              ))}
            </div>

            <div className="route-result__foot">
              <p>{lane.specialistNote}</p>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() =>
                  onRequestQuote({
                    origin: lane.origin.label,
                    destination: lane.destination.label,
                    cargo: lane.cargo.label,
                    note: `${lane.laneLabel} · ${lane.recommended.mode} · ${lane.recommended.transit}`,
                  })
                }
              >
                Talk to a specialist
                <ArrowRight className="btn__arrow" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
