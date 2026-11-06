import { landPath, MAP_HEIGHT, MAP_WIDTH, ports } from '../data/mapData';
import type { RegionId } from '../data/routes';

const hubByRegion: Record<RegionId, string> = {
  'north-america': 'new-york',
  europe: 'rotterdam',
  asia: 'shanghai',
  'middle-east': 'dubai',
  'south-america': 'sao-paulo',
  africa: 'durban',
  oceania: 'sydney',
};

export default function MiniRouteMap({ origin, destination }: { origin: RegionId; destination: RegionId }) {
  const from = ports.find((port) => port.id === hubByRegion[origin]) ?? ports[0];
  const to = ports.find((port) => port.id === hubByRegion[destination]) ?? ports[1];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const offset = Math.min(90, dist * 0.16);
  const cx = mx + (-dy / dist) * offset;
  const cy = my + (dx / dist) * offset;
  const d = `M${from.x} ${from.y} Q${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <div className="route-preview">
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d={landPath} className="route-preview__land" fill="none" />
        <path d={d} className="route-preview__route" />
        <circle cx={from.x} cy={from.y} r="5" className="route-preview__dot" />
        <circle cx={to.x} cy={to.y} r="5" className="route-preview__dot" />
      </svg>
      <span className="route-preview__label"><span className="gold-dot" /> Lane preview</span>
      <span className="route-preview__lane">{from.name} → {to.name}</span>
    </div>
  );
}
