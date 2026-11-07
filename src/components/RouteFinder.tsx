import { useMemo, useRef, useState } from 'react';
import { ArrowRight } from './Icons';
import { transitionToId } from '../lib/motion';
import { emitGuide } from '../lib/guide';
import { cargoTypes, getLane, regions, type CargoId, type RegionId } from '../data/routes';

/**
 * Lane finder for the route-desk banner: an ink console with dark selects,
 * laid over the harbor image under the heading and intro.
 */
export default function RouteFinder() {
  const [origin, setOrigin] = useState<RegionId>('europe');
  const [destination, setDestination] = useState<RegionId>('north-america');
  const [cargo, setCargo] = useState<CargoId>('general');
  const hinted = useRef(false);

  const noteInteraction = () => {
    if (hinted.current) return;
    hinted.current = true;
    emitGuide({
      text: 'Live estimate. A named specialist confirms in writing.',
      cta: { label: 'Ask the desk', targetId: 'contact' },
      effect: 'think',
    });
  };

  const lane = useMemo(() => getLane(origin, destination, cargo), [origin, destination, cargo]);

  return (
    <div className="lane-finder" data-reveal>
      <div className="lane-finder__grid">
        <label className="field field--dark">
          <span className="field__label">From</span>
          <span className="select-wrap select-wrap--dark">
            <select value={origin} onChange={(event) => { setOrigin(event.target.value as RegionId); noteInteraction(); }} aria-label="Origin region">
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.label}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="field field--dark">
          <span className="field__label">To</span>
          <span className="select-wrap select-wrap--dark">
            <select value={destination} onChange={(event) => { setDestination(event.target.value as RegionId); noteInteraction(); }} aria-label="Destination region">
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.label}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="field field--dark">
          <span className="field__label">Cargo</span>
          <span className="select-wrap select-wrap--dark">
            <select value={cargo} onChange={(event) => { setCargo(event.target.value as CargoId); noteInteraction(); }} aria-label="Cargo type">
              {cargoTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <div className="lane-finder__result" aria-live="polite">
        <div className="lane-finder__lane">
          <span className="label lane-finder__route">
            <span className="lane-finder__pulse" aria-hidden="true" />
            {lane.laneLabel}
          </span>
          <strong className="lane-finder__mode">
            <span className="lane-finder__mode-name">{lane.recommended.mode}</span>
            <span className="lane-finder__mode-transit">{lane.recommended.transit}</span>
          </strong>
          <span className="lane-finder__note">{lane.specialistNote}</span>
        </div>
        <a className="text-link text-link--light" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
          Request a quote
          <ArrowRight className="text-link__icon" />
        </a>
      </div>
    </div>
  );
}
