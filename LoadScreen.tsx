import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarbellDisplay } from '../components/BarbellDisplay';
import { PlateRack, PlateType } from '../components/PlateRack';
import { Menu, ArrowRight } from 'lucide-react';
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

export function LoadScreen() {
  const navigate = useNavigate();
  const barWeight = 45;

  const [targetWeight, setTargetWeight] = useState(225);
  const [loadedPlates, setLoadedPlates] = useState<LoadedPlate[]>([
    { weight: 45, color: PLATE_COLORS[45], width: PLATE_WIDTHS[45] },
    { weight: 45, color: PLATE_COLORS[45], width: PLATE_WIDTHS[45] },
  ]);

  const [availablePlates, setAvailablePlates] = useState<PlateType[]>([
    { weight: 45, color: PLATE_COLORS[45], count: 3, width: PLATE_WIDTHS[45] },
    { weight: 25, color: PLATE_COLORS[25], count: 4, width: PLATE_WIDTHS[25] },
    { weight: 10, color: PLATE_COLORS[10], count: 4, width: PLATE_WIDTHS[10] },
    { weight: 5, color: PLATE_COLORS[5], count: 4, width: PLATE_WIDTHS[5] },
    { weight: 2.5, color: PLATE_COLORS[2.5], count: 4, width: PLATE_WIDTHS[2.5] },
  ]);

  const currentWeight = barWeight + (loadedPlates.reduce((sum, plate) => sum + plate.weight, 0) * 2);

  const handleGoToTransition = () => {
    const state = getRackState();

    const currentPerSide = loadedPlates.map((p) => p.weight);

    const calc = calculatePerSide({
      barWeight,
      targetTotal: targetWeight,
      inventory: state.inventory,
    });

    setRackState({
      currentTotal: currentWeight,
      targetTotal: targetWeight,
      currentPerSide,
      targetPerSide: calc.perSide,
    });

    navigate('/transition');
  };

  const handlePlateSelect = (plate: PlateType) => {
    if (plate.count <= 0) return;

    setLoadedPlates([...loadedPlates, { weight: plate.weight, color: plate.color, width: plate.width }]);

    setAvailablePlates(availablePlates.map(p =>
      p.weight === plate.weight ? { ...p, count: Math.max(0, p.count - 1) } : p
    ));
  };

  const handleClearBar = () => {
    const returned: Record<number, number> = {};
    loadedPlates.forEach(p => (returned[p.weight] = (returned[p.weight] ?? 0) + 1));

    setAvailablePlates(prev =>
      prev.map(p => ({ ...p, count: p.count + (returned[p.weight] ?? 0) }))
    );

    setLoadedPlates([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold">
              RR
            </div>
            <div>
              <div className="text-xl font-semibold leading-none">RackReady</div>
              <div className="text-xs text-zinc-400 mt-1">Strength workflow prototype</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/rack')}
              className="px-4 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 transition-colors text-sm"
            >
              Rack View
            </button>
            <button
              className="p-2 rounded-lg hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Workout</div>
              <div className="text-2xl font-semibold mt-1">Squat</div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Target</div>
                <div className="flex items-center gap-2">
                  <input
                    className="w-32 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
                    inputMode="numeric"
                  />
                  <span className="text-zinc-400">lb</span>

                  <div className="flex items-center gap-2 ml-auto">
                    {[-10, -5, 5, 10].map((d) => (
                      <button
                        key={d}
                        className="text-sm px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:bg-zinc-900"
                        onClick={() => setTargetWeight((w) => Math.max(0, w + d))}
                      >
                        {d > 0 ? `+${d}` : d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGoToTransition}
                  className="mt-5 w-full bg-white text-zinc-900 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Transition <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Set</div>
              <div className="mt-2 text-sm text-zinc-300">
                Use Transition to see exactly what to add/remove for the next set.
              </div>

              <button
                onClick={() => navigate('/transition')}
                className="mt-5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all text-base font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Next Set
                <ArrowRight className="w-5 h-5" />
              </button>

              {currentWeight !== targetWeight && (
                <p className="text-center text-xs text-zinc-500 mt-2">
                  Match target weight to continue
                </p>
              )}
            </div>
          </aside>

          {/* Right: Visuals + Rack */}
          <main className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800">
                <p className="text-xs uppercase tracking-wider text-zinc-400">Target Weight</p>
                <p className="text-5xl font-bold mt-2">
                  {targetWeight}
                  <span className="text-2xl text-zinc-400 ml-2">lb</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
                <p className="text-xs uppercase tracking-wider text-blue-100">Current Weight</p>
                <p className="text-5xl font-bold mt-2">
                  {currentWeight}
                  <span className="text-2xl text-blue-200 ml-2">lb</span>
                </p>
                <p className="text-sm text-blue-100 mt-2">
                  {currentWeight < targetWeight && `${targetWeight - currentWeight} lb to go`}
                  {currentWeight === targetWeight && '✓ Target reached!'}
                  {currentWeight > targetWeight && `${currentWeight - targetWeight} lb over`}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400">Barbell</div>
                  <div className="text-sm text-zinc-500 mt-1">
                    Per side: {loadedPlates.reduce((sum, p) => sum + p.weight, 0)} lb • Bar: {barWeight} lb
                  </div>
                </div>
              </div>
              <BarbellDisplay loadedPlates={loadedPlates} />
            </div>

            <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-wider text-zinc-400">Plate Rack</div>
                <div className="text-xs text-zinc-500">Tap plates to load/unload</div>
              </div>

              <PlateRack plates={availablePlates} onPlateSelect={handlePlateSelect} />

              {loadedPlates.length > 0 && (
                <button
                  onClick={handleClearBar}
                  className="mt-4 w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 transition-colors text-sm"
                >
                  Clear Bar
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}