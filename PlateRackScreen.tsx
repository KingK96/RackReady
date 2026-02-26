import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlateGrid, PlateInfo } from '../components/PlateGrid';
import { CompactBarbell } from '../components/CompactBarbell';
import { ChevronLeft, Menu, Sparkles, Target } from 'lucide-react';
import { getRackState, setRackState } from "../utils/rackState";
import { calculatePerSide } from "../utils/plateMath";

const PLATE_COLORS = {
  45: '#E74C3C',
  25: '#3498DB',
  10: '#F1C40F',
  5: '#2ECC71',
  2.5: '#95A5A6',
};

const PLATE_WIDTHS = {
  45: 50,
  25: 42,
  10: 34,
  5: 28,
  2.5: 24,
};

interface LoadedPlate {
  weight: number;
  color: string;
  width: number;
}

export function PlateRackScreen() {
  const navigate = useNavigate();
  const state = getRackState();
  const [targetWeight, setTargetWeight] = useState<number>(state.targetTotal ?? 225);

  const barWeight = state.barWeight ?? 45;

  const [plateInventory, setPlateInventory] = useState<PlateInfo[]>([
    { weight: 45, color: PLATE_COLORS[45], count: 4, pairsLoaded: 1 },
    { weight: 25, color: PLATE_COLORS[25], count: 4, pairsLoaded: 1 },
    { weight: 10, color: PLATE_COLORS[10], count: 4, pairsLoaded: 0 },
    { weight: 5, color: PLATE_COLORS[5], count: 4, pairsLoaded: 0 },
    { weight: 2.5, color: PLATE_COLORS[2.5], count: 4, pairsLoaded: 0 },
  ]);

  const handleAddPlate = (weight: number) => {
    setPlateInventory(plateInventory.map(plate =>
      plate.weight === weight
        ? { ...plate, pairsLoaded: plate.pairsLoaded + 1 }
        : plate
    ));
  };

  const handleRemovePlate = (weight: number) => {
    setPlateInventory(plateInventory.map(plate =>
      plate.weight === weight
        ? { ...plate, pairsLoaded: Math.max(0, plate.pairsLoaded - 1) }
        : plate
    ));
  };

  const loadedPlates: LoadedPlate[] = [];
  plateInventory.forEach(plate => {
    for (let i = 0; i < plate.pairsLoaded; i++) {
      loadedPlates.push({
        weight: plate.weight,
        color: plate.color,
        width: PLATE_WIDTHS[plate.weight as keyof typeof PLATE_WIDTHS],
      });
    }
  });

  const handleSuggestLoad = () => {
    const inv: Record<number, number> = {};
    plateInventory.forEach((p) => (inv[p.weight] = p.count));

    const calc = calculatePerSide({
      barWeight,
      targetTotal: targetWeight,
      inventory: inv,
    });

    const counts: Record<number, number> = {};
    calc.perSide.forEach((w) => (counts[w] = (counts[w] ?? 0) + 1));

    setPlateInventory((prev) =>
      prev.map((p) => ({ ...p, pairsLoaded: counts[p.weight] ?? 0 }))
    );

    setRackState({
      targetTotal: targetWeight,
      targetPerSide: calc.perSide,
    });
  };

  const totalWeight = barWeight + (loadedPlates.reduce((sum, plate) => sum + plate.weight, 0) * 2);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        <header className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold">
              RR
            </div>
            <div>
              <div className="text-xl font-semibold leading-none">RackReady</div>
              <div className="text-xs text-zinc-400 mt-1">Rack inventory & load planning</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/load')}
              className="px-4 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 transition-colors text-sm flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              className="p-2 rounded-lg hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Target</div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  className="w-36 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
                  inputMode="numeric"
                />
                <span className="text-zinc-400">lb</span>
              </div>

              <button
                onClick={handleSuggestLoad}
                className="mt-5 w-full py-3 rounded-xl bg-white text-zinc-900 font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Suggest Load
              </button>

              <div className="mt-4 text-xs text-zinc-500">
                Uses current rack inventory to suggest the closest achievable load.
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-wider text-zinc-400">Inventory</div>
                <div className="text-xs text-zinc-500">Tap + / − to adjust</div>
              </div>

              <PlateGrid
                  plates={plateInventory}
                  onAdd={handleAddPlate}
                  onRemove={handleRemovePlate}
                />
            </div>
          </aside>

          {/* Right: visuals */}
          <main className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Target className="w-5 h-5" />
                  <div className="text-xs uppercase tracking-wider text-zinc-400">Target</div>
                </div>
                <div className="text-4xl font-bold mt-2">
                  {targetWeight}
                  <span className="text-xl text-zinc-400 ml-2">lb</span>
                </div>
              </div>

              <div className="rounded-2xl bg-blue-600/10 border border-blue-600/30 p-6">
                <div className="text-xs uppercase tracking-wider text-blue-200">Loaded</div>
                <div className="text-4xl font-bold mt-2 text-blue-200">
                  {totalWeight}
                  <span className="text-xl text-blue-200/80 ml-2">lb</span>
                </div>
                <div className="text-sm text-zinc-300 mt-2">
                  Bar: {barWeight} lb • Per side: {loadedPlates.reduce((s, p) => s + p.weight, 0)} lb
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-wider text-zinc-400">Barbell Preview</div>
                <div className="text-xs text-zinc-500">Compact view</div>
              </div>
              <CompactBarbell loadedPlates={loadedPlates} totalWeight={totalWeight} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}