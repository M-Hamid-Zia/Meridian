import { useState } from 'react';
import { graticulePath, landPath, MAP_HEIGHT, MAP_WIDTH, ports, routes, type MapPort } from '../data/mapData';

type Props = {
  variant?: 'hero' | 'network';
  className?: string;
};

export default function WorldMap({ variant = 'hero', className = '' }: Props) {
  const [hovered, setHovered] = useState<MapPort | null>(null);
  const isHero = variant === 'hero';

  return (
    <div className={`map map--${variant} ${className}`.trim()}>
      <svg
        className="map__svg"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="World map showing Meridian offices and partner ports"
      >
        <defs>
          {isHero && routes.map((route) => (
            <mask
              key={route.id}
              id={`reveal-${route.id}`}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
            >
              <path
                d={route.d}
                pathLength={1}
                className="route-mask"
                fill="none"
                stroke="#fff"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </mask>
          ))}
        </defs>

        <path d={graticulePath} className="map__graticule" fill="none" />
        <path d={landPath} className="map__land" fill="none" />

        {isHero && (
          <g className="map__routes" aria-hidden="true">
            {routes.map((route) => (
              <path
                key={route.id}
                d={route.d}
                className="map__route"
                fill="none"
                mask={`url(#reveal-${route.id})`}
              />
            ))}
          </g>
        )}

        <g className="map__ports">
          {ports.map((port) => {
            const isOffice = port.type === 'office';
            const showLabel = isOffice && port.label;
            const labelOnLeft = port.x > MAP_WIDTH - 150;
            return (
              <g
                key={port.id}
                className={`port port--${port.type}`}
                transform={`translate(${port.x} ${port.y})`}
                tabIndex={isOffice ? 0 : undefined}
                role={isOffice ? 'img' : undefined}
                aria-label={isOffice ? `${port.name}, ${port.country}, owned office` : undefined}
                onMouseEnter={() => setHovered(port)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(port)}
                onBlur={() => setHovered(null)}
              >
                {isOffice ? (
                  <>
                    <circle className="port__ring" r="7.5" />
                    <circle className="port__dot" r="3.1" />
                  </>
                ) : (
                  <circle className="port__dot port__dot--partner" r="1.8" />
                )}
                {showLabel && (
                  <text
                    className="port__label"
                    x={labelOnLeft ? -11 : 11}
                    y="3.5"
                    textAnchor={labelOnLeft ? 'end' : 'start'}
                  >
                    {port.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {hovered && (
          <g className="map-tooltip" transform={`translate(${hovered.x} ${hovered.y})`} pointerEvents="none">
            <path d="M0 0V-10" className="map-tooltip__line" />
            <rect
              x="10"
              y="-42"
              width={Math.max(112, hovered.name.length * 7 + 26)}
              height="32"
              rx="2"
              className="map-tooltip__box"
            />
            <text x="20" y="-28" className="map-tooltip__name">{hovered.name}</text>
            <text x="20" y="-17" className="map-tooltip__type">
              {hovered.type === 'office' ? 'Owned office' : 'Partner port'} · {hovered.country}
            </text>
          </g>
        )}
      </svg>

      {isHero ? (
        <>
          <div className="map__overlay map__overlay--top">
            <span className="label label--gold">Meridian network</span>
            <span className="map__overlay-line" />
            <span className="map__overlay-meta">140+ countries</span>
          </div>
          <div className="map__overlay map__overlay--bottom">
            <span>12 owned offices</span>
            <span className="map__overlay-dot" />
            <span>60+ partner agents</span>
          </div>
        </>
      ) : (
        <div className="map__legend">
          <span><i className="legend-dot legend-dot--office" /> Owned office</span>
          <span><i className="legend-dot legend-dot--partner" /> Partner port</span>
        </div>
      )}
    </div>
  );
}
