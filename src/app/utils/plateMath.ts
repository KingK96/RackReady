import type { PlateInventory } from "./rackState";

export function calculatePerSide(params: {
  barWeight: number;
  targetTotal: number;
  inventory: PlateInventory; // total plates count (both sides)
  denoms?: number[];
}) {
  const { barWeight, targetTotal, inventory } = params;
  const denoms = (params.denoms ?? Object.keys(inventory).map(Number)).sort((a, b) => b - a);

  const target = Math.max(barWeight, Math.round(targetTotal / 5) * 5); // lb totals change in 5s
  const neededTotal = Math.max(0, target - barWeight);
  const neededPerSide = neededTotal / 2;

  let remaining = neededPerSide;
  const perSide: number[] = [];

  for (const d of denoms) {
    const pairsAvailable = Math.floor((inventory[d] ?? 0) / 2);
    if (!pairsAvailable) continue;

    const pairsByWeight = Math.floor(remaining / d);
    const pairsToUse = Math.min(pairsAvailable, pairsByWeight);
    for (let i = 0; i < pairsToUse; i++) perSide.push(d);
    remaining -= pairsToUse * d;

    if (remaining <= 1e-9) break;
  }

  const achievableTotal = barWeight + (neededPerSide - remaining) * 2;
  const exact = achievableTotal === target;

  return { targetRounded: target, achievableTotal, perSide, exact };
}

export function diffPerSide(prev: number[], next: number[]) {
  const count = (arr: number[]) =>
    arr.reduce<Record<number, number>>((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});

  const a = count(prev);
  const b = count(next);

  const all = new Set([...Object.keys(a), ...Object.keys(b)].map(Number));
  const add: { denom: number; count: number }[] = [];
  const remove: { denom: number; count: number }[] = [];

  for (const denom of Array.from(all).sort((x, y) => y - x)) {
    const delta = (b[denom] ?? 0) - (a[denom] ?? 0);
    if (delta > 0) add.push({ denom, count: delta });
    if (delta < 0) remove.push({ denom, count: Math.abs(delta) });
  }
  return { add, remove };
}