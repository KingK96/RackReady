export type Unit = "lb";

export type PlateInventory = Record<number, number>; // denom -> total count (both sides combined)

export type RackReadyState = {
  unit: Unit;
  barWeight: number;
  currentTotal: number;
  targetTotal: number;
  inventory: PlateInventory;
  currentPerSide: number[];
  targetPerSide: number[];
};

const KEY = "rackready:v1";

const defaultState: RackReadyState = {
  unit: "lb",
  barWeight: 45,
  currentTotal: 185,
  targetTotal: 225,
  inventory: { 45: 8, 25: 4, 10: 4, 5: 4, 2.5: 4 },
  currentPerSide: [45, 25],
  targetPerSide: [45, 45],
};

export function getRackState(): RackReadyState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function setRackState(patch: Partial<RackReadyState>) {
  const next = { ...getRackState(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}