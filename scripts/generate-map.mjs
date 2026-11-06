import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoGraticule10, geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/land-110m.json');
const land = feature(topo, topo.objects.land);

const W = 1200;
const H = 760;
const projection = geoNaturalEarth1().fitExtent([[18, 26], [W - 18, H - 26]], land);
const path = geoPath(projection);

const dots = [];
for (let lat = 82; lat >= -56; lat -= 1.8) {
  for (let lon = -180; lon <= 180; lon += 1.8) {
    if (!geoContains(land, [lon, lat])) continue;
    const p = projection([lon, lat]);
    if (!p) continue;
    dots.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)}h0`);
  }
}

const graticule = path(geoGraticule10()) || '';

const rawPorts = [
  // Owned offices
  { id: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', lon: 4.48, lat: 51.92, type: 'office', region: 'Europe', label: true },
  { id: 'london', name: 'London', country: 'United Kingdom', lon: -0.13, lat: 51.51, type: 'office', region: 'Europe' },
  { id: 'hamburg', name: 'Hamburg', country: 'Germany', lon: 9.99, lat: 53.55, type: 'office', region: 'Europe' },
  { id: 'new-york', name: 'New York', country: 'United States', lon: -74.0, lat: 40.71, type: 'office', region: 'North America', label: true },
  { id: 'chicago', name: 'Chicago', country: 'United States', lon: -87.63, lat: 41.88, type: 'office', region: 'North America' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', lon: -118.24, lat: 33.74, type: 'office', region: 'North America' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', lon: -46.63, lat: -23.55, type: 'office', region: 'South America' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lon: 55.27, lat: 25.2, type: 'office', region: 'Middle East', label: true },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lon: 72.88, lat: 19.08, type: 'office', region: 'Asia' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lon: 103.82, lat: 1.35, type: 'office', region: 'Asia', label: true },
  { id: 'shanghai', name: 'Shanghai', country: 'China', lon: 121.47, lat: 31.23, type: 'office', region: 'Asia', label: true },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lon: 151.21, lat: -33.87, type: 'office', region: 'Oceania', label: true },
  // Partner ports
  { id: 'antwerp', name: 'Antwerp', country: 'Belgium', lon: 4.4, lat: 51.22, type: 'partner', region: 'Europe' },
  { id: 'felixstowe', name: 'Felixstowe', country: 'United Kingdom', lon: 1.35, lat: 51.96, type: 'partner', region: 'Europe' },
  { id: 'algeciras', name: 'Algeciras', country: 'Spain', lon: -5.44, lat: 36.13, type: 'partner', region: 'Europe' },
  { id: 'savannah', name: 'Savannah', country: 'United States', lon: -81.1, lat: 32.08, type: 'partner', region: 'North America' },
  { id: 'houston', name: 'Houston', country: 'United States', lon: -95.37, lat: 29.76, type: 'partner', region: 'North America' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', lon: -123.12, lat: 49.28, type: 'partner', region: 'North America' },
  { id: 'manzanillo', name: 'Manzanillo', country: 'Mexico', lon: -104.32, lat: 19.05, type: 'partner', region: 'North America' },
  { id: 'santos', name: 'Santos', country: 'Brazil', lon: -46.33, lat: -23.96, type: 'partner', region: 'South America' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', lon: -58.38, lat: -34.6, type: 'partner', region: 'South America' },
  { id: 'callao', name: 'Callao', country: 'Peru', lon: -77.15, lat: -12.06, type: 'partner', region: 'South America' },
  { id: 'durban', name: 'Durban', country: 'South Africa', lon: 31.02, lat: -29.86, type: 'partner', region: 'Africa' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lon: 3.39, lat: 6.45, type: 'partner', region: 'Africa' },
  { id: 'mombasa', name: 'Mombasa', country: 'Kenya', lon: 39.67, lat: -4.04, type: 'partner', region: 'Africa' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lon: 31.24, lat: 30.04, type: 'partner', region: 'Africa' },
  { id: 'jebel-ali', name: 'Jebel Ali', country: 'UAE', lon: 55.06, lat: 25.01, type: 'partner', region: 'Middle East' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', lon: 46.72, lat: 24.71, type: 'partner', region: 'Middle East' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', lon: 67.01, lat: 24.86, type: 'partner', region: 'Asia' },
  { id: 'chennai', name: 'Chennai', country: 'India', lon: 80.27, lat: 13.08, type: 'partner', region: 'Asia' },
  { id: 'colombo', name: 'Colombo', country: 'Sri Lanka', lon: 79.86, lat: 6.93, type: 'partner', region: 'Asia' },
  { id: 'port-klang', name: 'Port Klang', country: 'Malaysia', lon: 101.36, lat: 3.0, type: 'partner', region: 'Asia' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', lon: 106.85, lat: -6.21, type: 'partner', region: 'Asia' },
  { id: 'manila', name: 'Manila', country: 'Philippines', lon: 120.98, lat: 14.6, type: 'partner', region: 'Asia' },
  { id: 'busan', name: 'Busan', country: 'South Korea', lon: 129.04, lat: 35.18, type: 'partner', region: 'Asia' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lon: 139.69, lat: 35.69, type: 'partner', region: 'Asia' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lon: 144.96, lat: -37.81, type: 'partner', region: 'Oceania' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', lon: 174.76, lat: -36.85, type: 'partner', region: 'Oceania' },
];

const ports = rawPorts.map((p) => {
  const xy = projection([p.lon, p.lat]);
  return { ...p, x: Number(xy[0].toFixed(2)), y: Number(xy[1].toFixed(2)) };
});
const byId = Object.fromEntries(ports.map((p) => [p.id, p]));

const routeDefs = [
  ['rotterdam', 'new-york'],
  ['rotterdam', 'singapore'],
  ['dubai', 'mombasa'],
  ['santos', 'rotterdam'],
  ['mumbai', 'felixstowe'],
  ['sydney', 'singapore'],
  ['busan', 'singapore'],
];

const routes = routeDefs.map(([fromId, toId], index) => {
  const a = byId[fromId];
  const b = byId[toId];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const offset = Math.min(110, dist * 0.18) * (index % 2 === 0 ? 1 : -1);
  const cx = mx + (-dy / (dist || 1)) * offset;
  const cy = my + (dx / (dist || 1)) * offset;
  return {
    id: `route-${index}`,
    from: fromId,
    to: toId,
    d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
  };
});

const out = `// Generated by scripts/generate-map.mjs. Do not edit by hand.
export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};
export const landPath = ${JSON.stringify(dots.join(''))};
export const graticulePath = ${JSON.stringify(graticule)};
export type MapPort = {
  id: string;
  name: string;
  country: string;
  lon: number;
  lat: number;
  type: 'office' | 'partner';
  region: string;
  label?: boolean;
  x: number;
  y: number;
};
export const ports: MapPort[] = ${JSON.stringify(ports, null, 2)};
export type MapRoute = { id: string; from: string; to: string; d: string };
export const routes: MapRoute[] = ${JSON.stringify(routes, null, 2)};
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/mapData.ts', out);
console.log(`Wrote src/data/mapData.ts: ${dots.length} dots, ${ports.length} ports, ${routes.length} routes`);
