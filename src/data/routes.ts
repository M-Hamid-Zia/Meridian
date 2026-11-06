export type RegionId =
  | 'north-america'
  | 'europe'
  | 'asia'
  | 'middle-east'
  | 'south-america'
  | 'africa'
  | 'oceania';

export type CargoId = 'general' | 'temperature' | 'high-value' | 'automotive' | 'project';

export type Region = {
  id: RegionId;
  label: string;
  short: string;
  ports: string;
  hub: string;
};

export type CargoType = {
  id: CargoId;
  label: string;
  short: string;
};

export const regions: Region[] = [
  { id: 'north-america', label: 'North America', short: 'N. America', ports: 'New York / Savannah / Los Angeles', hub: 'New York' },
  { id: 'europe', label: 'Europe', short: 'Europe', ports: 'Rotterdam / Hamburg / Felixstowe', hub: 'Rotterdam' },
  { id: 'asia', label: 'Asia', short: 'Asia', ports: 'Shanghai / Singapore / Busan', hub: 'Shanghai' },
  { id: 'middle-east', label: 'Middle East', short: 'Middle East', ports: 'Jebel Ali / Riyadh', hub: 'Jebel Ali' },
  { id: 'south-america', label: 'South America', short: 'S. America', ports: 'Santos / Buenos Aires / Callao', hub: 'Santos' },
  { id: 'africa', label: 'Africa', short: 'Africa', ports: 'Durban / Lagos / Mombasa', hub: 'Durban' },
  { id: 'oceania', label: 'Oceania', short: 'Oceania', ports: 'Sydney / Melbourne / Auckland', hub: 'Sydney' },
];

export const cargoTypes: CargoType[] = [
  { id: 'general', label: 'General cargo', short: 'General' },
  { id: 'temperature', label: 'Temperature-controlled', short: 'Reefer' },
  { id: 'high-value', label: 'High-value / electronics', short: 'High-value' },
  { id: 'automotive', label: 'Automotive parts', short: 'Automotive' },
  { id: 'project', label: 'Project / oversized', short: 'Project' },
];

export type Mode = 'Ocean FCL' | 'Ocean LCL' | 'Air' | 'Rail' | 'Road';

export type RouteOption = {
  mode: Mode;
  transit: string;
  frequency: string;
  note: string;
  recommended?: boolean;
};

export type LaneResult = {
  origin: Region;
  destination: Region;
  cargo: CargoType;
  laneLabel: string;
  options: RouteOption[];
  recommended: RouteOption;
  specialistNote: string;
};

const ocean: Record<RegionId, Record<RegionId, [number, number]>> = {
  'north-america': {
    'north-america': [1, 4],
    europe: [12, 16],
    asia: [18, 26],
    'middle-east': [20, 26],
    'south-america': [10, 16],
    africa: [18, 24],
    oceania: [22, 28],
  },
  europe: {
    'north-america': [12, 16],
    europe: [1, 4],
    asia: [24, 30],
    'middle-east': [12, 18],
    'south-america': [14, 20],
    africa: [10, 16],
    oceania: [26, 32],
  },
  asia: {
    'north-america': [18, 26],
    europe: [24, 30],
    asia: [1, 5],
    'middle-east': [10, 16],
    'south-america': [24, 30],
    africa: [16, 22],
    oceania: [12, 18],
  },
  'middle-east': {
    'north-america': [20, 26],
    europe: [12, 18],
    asia: [10, 16],
    'middle-east': [1, 4],
    'south-america': [20, 26],
    africa: [8, 14],
    oceania: [16, 22],
  },
  'south-america': {
    'north-america': [10, 16],
    europe: [14, 20],
    asia: [24, 30],
    'middle-east': [20, 26],
    'south-america': [1, 5],
    africa: [12, 18],
    oceania: [20, 26],
  },
  africa: {
    'north-america': [18, 24],
    europe: [10, 16],
    asia: [16, 22],
    'middle-east': [8, 14],
    'south-america': [12, 18],
    africa: [1, 5],
    oceania: [18, 24],
  },
  oceania: {
    'north-america': [22, 28],
    europe: [26, 32],
    asia: [12, 18],
    'middle-east': [16, 22],
    'south-america': [20, 26],
    africa: [18, 24],
    oceania: [1, 5],
  },
};

const air: Record<RegionId, Record<RegionId, [number, number]>> = {
  'north-america': {
    'north-america': [1, 2],
    europe: [2, 4],
    asia: [3, 5],
    'middle-east': [3, 5],
    'south-america': [2, 4],
    africa: [3, 5],
    oceania: [4, 6],
  },
  europe: {
    'north-america': [2, 4],
    europe: [1, 2],
    asia: [2, 4],
    'middle-east': [2, 3],
    'south-america': [3, 5],
    africa: [2, 4],
    oceania: [4, 6],
  },
  asia: {
    'north-america': [3, 5],
    europe: [2, 4],
    asia: [1, 3],
    'middle-east': [2, 3],
    'south-america': [4, 6],
    africa: [3, 5],
    oceania: [3, 5],
  },
  'middle-east': {
    'north-america': [3, 5],
    europe: [2, 3],
    asia: [2, 3],
    'middle-east': [1, 2],
    'south-america': [4, 6],
    africa: [2, 4],
    oceania: [4, 6],
  },
  'south-america': {
    'north-america': [2, 4],
    europe: [3, 5],
    asia: [4, 6],
    'middle-east': [4, 6],
    'south-america': [1, 3],
    africa: [4, 6],
    oceania: [5, 7],
  },
  africa: {
    'north-america': [3, 5],
    europe: [2, 4],
    asia: [3, 5],
    'middle-east': [2, 4],
    'south-america': [4, 6],
    africa: [1, 3],
    oceania: [4, 6],
  },
  oceania: {
    'north-america': [4, 6],
    europe: [4, 6],
    asia: [3, 5],
    'middle-east': [4, 6],
    'south-america': [5, 7],
    africa: [4, 6],
    oceania: [1, 3],
  },
};

const railAvailable = (a: RegionId, b: RegionId) => {
  const pair = new Set([a, b]);
  return (
    (pair.has('europe') && pair.has('asia')) ||
    (pair.has('europe') && pair.has('middle-east')) ||
    (pair.has('asia') && pair.has('middle-east'))
  );
};

const railDays = (a: RegionId, b: RegionId): [number, number] => {
  const pair = new Set([a, b]);
  if (pair.has('europe') && pair.has('asia')) return [16, 22];
  if (pair.has('europe') && pair.has('middle-east')) return [10, 14];
  if (pair.has('asia') && pair.has('middle-east')) return [8, 12];
  return [12, 18];
};

const addDays = ([min, max]: [number, number], extra: number): [number, number] => [min + extra, max + extra];

const cargoExtra: Record<CargoId, number> = {
  general: 0,
  temperature: 1,
  'high-value': 0,
  automotive: 1,
  project: 4,
};

const frequency = (mode: Mode, a: RegionId, b: RegionId) => {
  if (mode === 'Air') return a === b ? 'Daily' : 'Daily / next-flight-out';
  if (mode === 'Road') return 'Daily';
  if (mode === 'Rail') return 'Weekly';
  if (a === b) return 'Daily';
  return a === 'europe' || b === 'europe' ? '2 sailings / week' : 'Weekly';
};

const modeNote = (mode: Mode, cargo: CargoType) => {
  if (mode === 'Air') {
    if (cargo.id === 'temperature') return 'Reefer air, 2–8°C or frozen. Door-to-door, 48-hour wheel-to-wheel on 12 corridors.';
    if (cargo.id === 'project') return 'Charter or freighter, outsize. Door-to-door, 48-hour wheel-to-wheel on 12 corridors.';
    if (cargo.id === 'high-value') return 'Secure air, screened and sealed. Door-to-door, 48-hour wheel-to-wheel on 12 corridors.';
    if (cargo.id === 'automotive') return 'AOG or line-down parts. Door-to-door, 48-hour wheel-to-wheel on 12 corridors.';
    return 'Door-to-door, 48-hour wheel-to-wheel on 12 corridors.';
  }
  if (mode === 'Road') {
    if (cargo.id === 'temperature') return 'Reefer road, 2–8°C or frozen. FTL or LTL, 2–6 pallets or a full trailer.';
    return 'FTL or LTL, 2–6 pallets or a full trailer.';
  }
  if (mode === 'Rail') {
    if (cargo.id === 'temperature') return 'Reefer wagon on request. Block train or wagon; customs pre-clearance included.';
    return 'Block train or wagon; customs pre-clearance included.';
  }
  if (mode === 'Ocean LCL') {
    if (cargo.id === 'temperature') return 'Reefer LCL on request. Consolidated, 1–3 CBM minimum. Delivery quoted separately.';
    return 'Consolidated, 1–3 CBM minimum. Delivery quoted separately.';
  }
  if (cargo.id === 'temperature') return 'Reefer FCL, 2–8°C or frozen. Port-to-port; customs and delivery quoted separately.';
  if (cargo.id === 'project') return 'Flat rack or breakbulk; lift and route survey. Port-to-port; customs and delivery quoted separately.';
  if (cargo.id === 'high-value') return 'Secure FCL, screened and sealed. Port-to-port; customs and delivery quoted separately.';
  if (cargo.id === 'automotive') return 'JIT delivery and line-side sequencing. Port-to-port; customs and delivery quoted separately.';
  return 'FCL/LCL, 40+ carrier contracts. Port-to-port; customs and delivery quoted separately.';
};

const recommendedMode = (cargo: CargoId, a: RegionId, b: RegionId): Mode => {
  if (a === b) return cargo === 'high-value' ? 'Air' : 'Road';
  if (cargo === 'high-value') return 'Air';
  if (cargo === 'temperature') return 'Ocean FCL';
  if (cargo === 'project') return 'Ocean FCL';
  if (cargo === 'automotive') return railAvailable(a, b) ? 'Rail' : 'Ocean FCL';
  return 'Ocean FCL';
};

export function getLane(originId: RegionId, destinationId: RegionId, cargoId: CargoId): LaneResult {
  const origin = regions.find((r) => r.id === originId) ?? regions[1];
  const destination = regions.find((r) => r.id === destinationId) ?? regions[0];
  const cargo = cargoTypes.find((c) => c.id === cargoId) ?? cargoTypes[0];
  const same = origin.id === destination.id;
  const extra = cargoExtra[cargo.id];
  const options: RouteOption[] = [];

  if (same) {
    const road = addDays([1, 4], extra);
    options.push({
      mode: 'Road',
      transit: `${road[0]}–${road[1]} days`,
      frequency: 'Daily',
      note: modeNote('Road', cargo),
    });
    const airDays = addDays(air[origin.id][destination.id], extra);
    options.push({
      mode: 'Air',
      transit: `${airDays[0]}–${airDays[1]} days`,
      frequency: 'Daily',
      note: modeNote('Air', cargo),
    });
  } else {
    const fcl = addDays(ocean[origin.id][destination.id], extra);
    options.push({
      mode: 'Ocean FCL',
      transit: `${fcl[0]}–${fcl[1]} days`,
      frequency: frequency('Ocean FCL', origin.id, destination.id),
      note: modeNote('Ocean FCL', cargo),
    });
    const lcl = addDays(ocean[origin.id][destination.id], extra + 5);
    options.push({
      mode: 'Ocean LCL',
      transit: `${lcl[0]}–${lcl[1]} days`,
      frequency: frequency('Ocean LCL', origin.id, destination.id),
      note: modeNote('Ocean LCL', cargo),
    });
    const airDays = addDays(air[origin.id][destination.id], extra);
    options.push({
      mode: 'Air',
      transit: `${airDays[0]}–${airDays[1]} days`,
      frequency: frequency('Air', origin.id, destination.id),
      note: modeNote('Air', cargo),
    });
    if (railAvailable(origin.id, destination.id)) {
      const rail = addDays(railDays(origin.id, destination.id), extra);
      options.push({
        mode: 'Rail',
        transit: `${rail[0]}–${rail[1]} days`,
        frequency: 'Weekly',
        note: modeNote('Rail', cargo),
      });
    }
  }

  const recMode = recommendedMode(cargo.id, origin.id, destination.id);
  const recommended = options.find((o) => o.mode === recMode) ?? options[0];
  options.forEach((o) => {
    o.recommended = o.mode === recommended.mode;
  });

  const specialistNote = same
    ? `Road and air options from ${origin.hub}. A specialist confirms pickup windows and delivery slots.`
    : `Weekly capacity from ${origin.hub} to ${destination.hub}. A specialist confirms the sailing schedule, equipment and customs route.`;

  return {
    origin,
    destination,
    cargo,
    laneLabel: `${origin.hub} → ${destination.hub}`,
    options,
    recommended,
    specialistNote,
  };
}

export const defaultLane = getLane('europe', 'north-america', 'general');
