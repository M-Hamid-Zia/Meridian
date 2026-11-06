import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { cargoTypes, getLane, regions, type CargoId, type RegionId } from '../data/routes';
import type { QuotePrefill, RoutePreset } from '../App';
import { ArrowRight, ModeIcon } from './Icons';
import MiniRouteMap from './MiniRouteMap';

type Props = {
  preset: RoutePreset | null;
  onRequestQuote: (prefill: Omit<QuotePrefill, 'nonce'>) => void;
};

export default function RouteSelector({ preset, onRequestQuote }: Props) {
  const [origin, setOrigin] = useState<RegionId>(preset?.origin ?? 'europe');
  const [destination, setDestination] = useState<RegionId>(preset?.destination ?? 'north-america');
  const [cargo, setCargo] = useState<CargoId>(preset?.cargo ?? 'general');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preset) return;
    if (preset.origin) setOrigin(preset.origin);
    if (preset.destination) setDestination(preset.destination);
    if (preset.cargo) setCargo(preset.cargo);
  }, [preset]);

  const lane = useMemo(() => getLane(origin, destination, cargo), [origin, destination, cargo]);

  useEffect(() => {
    if (!resultRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(resultRef.current, { opacity: 0, y: 8 }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
    return () => {
      tween.kill();
    };
  }, [lane]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resultRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    if (reduce) return;
    gsap.fromTo(resultRef.current, { opacity: 0.35, y: 6 }, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  return (
    <section className="section routes" id="routes">
      <div className="wrap">
        <div className="section-head routes__head">
          <div className="section-head__title">
            <span className="eyebrow">01 / Route selector</span>
            <h2>Find your trade lane.</h2>
          </div>
          <div className="section-head__intro">
            <p>Choose an origin, a destination and the cargo. We will show the modes, transit windows and the specialist who owns the lane.</p>
            <span className="micro-note">Indicative transit times. A specialist confirms the schedule.</span>
          </div>
        </div>

        <div className="routes-photo">
          <img
            src="/images/route-port.webp"
            alt="Container cranes and cargo ships at a deep-water port"
            width="1200"
            height="400"
            loading="lazy"
            decoding="async"
          />
        </div>

        <form className="route-panel" onSubmit={submit}>
          <div className="route-panel__bar">
            <span className="label label--gold">Route selector</span>
            <span className="route-panel__step">01 / 03</span>
          </div>

          <div className="route-panel__fields">
            <label className="field">
              <span className="field__label">Where is it going?</span>
              <span className="select-wrap">
                <select value={origin} onChange={(event) => setOrigin(event.target.value as RegionId)}>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">{regions.find((region) => region.id === origin)?.ports}</span>
            </label>

            <span className="route-panel__arrow" aria-hidden="true">→</span>

            <label className="field">
              <span className="field__label">Destination region</span>
              <span className="select-wrap">
                <select value={destination} onChange={(event) => setDestination(event.target.value as RegionId)}>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">{regions.find((region) => region.id === destination)?.ports}</span>
            </label>

            <label className="field">
              <span className="field__label">Cargo type</span>
              <span className="select-wrap">
                <select value={cargo} onChange={(event) => setCargo(event.target.value as CargoId)}>
                  {cargoTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </span>
              <span className="field__hint">Equipment and handling are confirmed by the route desk.</span>
            </label>

            <button className="btn btn--primary route-panel__submit" type="submit">
              See your route options
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
                onClick={() => onRequestQuote({
                  origin: lane.origin.label,
                  destination: lane.destination.label,
                  cargo: lane.cargo.label,
                  note: `${lane.laneLabel} · ${lane.recommended.mode} · ${lane.recommended.transit}`,
                })}
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
