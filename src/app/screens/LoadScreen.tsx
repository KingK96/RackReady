import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarbellDisplay } from '../components/BarbellDisplay';
import { PlateRack, PlateType } from '../components/PlateRack';
import { ChevronLeft, Menu, ArrowRight } from 'lucide-react';
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
  const [targetWeight, setTargetWeight] = useState(225);
  const [loadedPlates, setLoadedPlates] = useState<LoadedPlate[]>([
    { weight: 45, color: PLATE_COLORS[45], width: PLATE_WIDTHS[45] },
    { weight: 45, color: PLATE_COLORS[45], width: PLATE_WIDTHS[45] },
  ]);

  const WORKOUTS = ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row"] as const;
type Workout = (typeof WORKOUTS)[number];

const [workout, setWorkout] = useState<Workout>("Squat");



  const [availablePlates, setAvailablePlates] = useState<PlateType[]>([
    { weight: 45, color: PLATE_COLORS[45], count: 3, width: PLATE_WIDTHS[45] },
    { weight: 25, color: PLATE_COLORS[25], count: 4, width: PLATE_WIDTHS[25] },
    { weight: 10, color: PLATE_COLORS[10], count: 4, width: PLATE_WIDTHS[10] },
    { weight: 5, color: PLATE_COLORS[5], count: 4, width: PLATE_WIDTHS[5] },
    { weight: 2.5, color: PLATE_COLORS[2.5], count: 4, width: PLATE_WIDTHS[2.5] },
  ]);

  const barWeight = 45;
  const currentWeight = barWeight + (loadedPlates.reduce((sum, plate) => sum + plate.weight, 0) * 2);

  const handleGoToTransition = () => {
  const state = getRackState();

  // current per side from loadedPlates
  const currentPerSide = loadedPlates.map((p) => p.weight);

  const calc = calculatePerSide({
    barWeight,
    targetTotal: targetWeight,
    inventory: state.inventory,
  });

  setRackState({
    barWeight,
    currentTotal: currentWeight,
    targetTotal: targetWeight,
    currentPerSide,
    targetPerSide: calc.perSide,
    workout
  });

  navigate("/transition");
};

  const handlePlateSelect = (plate: PlateType) => {
    if (plate.count > 0) {
      setLoadedPlates([...loadedPlates, {
        weight: plate.weight,
        color: plate.color,
        width: plate.width,
      }]);

      setAvailablePlates(availablePlates.map(p =>
        p.weight === plate.weight ? { ...p, count: p.count - 1 } : p
      ));
    }
  };

  const handleClearBar = () => {
    const plateCount: Record<number, number> = {};
    loadedPlates.forEach(plate => {
      plateCount[plate.weight] = (plateCount[plate.weight] || 0) + 1;
    });

    setAvailablePlates(availablePlates.map(p => ({
      ...p,
      count: p.count + (plateCount[p.weight] || 0),
    })));

    setLoadedPlates([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-[430px] mx-auto min-h-screen bg-zinc-900 flex flex-col">
        <header className="px-5 py-4 border-b border-zinc-800">
  {/* Row 1: Back + Title + Menu */}
  <div className="flex items-center justify-between">
    <button
      onClick={() => navigate("/")}
      className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors"
      aria-label="Back"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>

    <div className="flex flex-col items-center">
  <select
    value={workout}
    onChange={(e) => setWorkout(e.target.value as Workout)}
    className="bg-transparent text-white text-lg font-semibold text-center outline-none"
  >
    {WORKOUTS.map((w) => (
      <option key={w} value={w} className="bg-zinc-900">
        {w}
      </option>
    ))}
  </select>
</div>

    <button
      className="p-2 -mr-2 hover:bg-zinc-800 rounded-lg transition-colors"
      aria-label="Menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  </div>

  {/* Row 2: Target controls + Transition */}
  <div className="mt-4 flex items-center gap-3">
    <div className="flex items-end gap-2 flex-1 min-w-0">
      <div className="min-w-[52px]">
        <div className="text-xs text-zinc-400 mb-1">Target</div>
        <div className="flex items-center gap-2">
          <input
            className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
            value={targetWeight}
            onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
            inputMode="numeric"
          />
          <span className="text-zinc-400 shrink-0">lb</span>
        </div>
      </div>

      <button
        className="text-sm px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 shrink-0"
        onClick={() => setTargetWeight((w) => w + 10)}
      >
        +10
      </button>
    </div>

    <button
      onClick={handleGoToTransition}
      className="bg-white text-zinc-900 font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-2 shrink-0"
    >
      Transition <ArrowRight size={18} />
    </button>
  </div>
</header>

        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-zinc-400">Target Weight</p>
              <p className="text-5xl font-bold">
                {targetWeight}
                <span className="text-2xl text-zinc-400 ml-2">lb</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-blue-100">Current Weight</p>
              <p className="text-5xl font-bold">
                {currentWeight}
                <span className="text-2xl text-blue-200 ml-2">lb</span>
              </p>
              <p className="text-sm text-blue-100">
                {currentWeight < targetWeight && `${targetWeight - currentWeight} lb to go`}
                {currentWeight === targetWeight && '✓ Target reached!'}
                {currentWeight > targetWeight && `${currentWeight - targetWeight} lb over`}
              </p>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700 overflow-x-auto">
            <BarbellDisplay loadedPlates={loadedPlates} />
            <div className="text-center mt-4 space-y-1">
              <p className="text-xs text-zinc-500">Per side: {loadedPlates.reduce((sum, p) => sum + p.weight, 0)} lb</p>
              <p className="text-xs text-zinc-500">Bar: {barWeight} lb</p>
            </div>
          </div>

          <PlateRack plates={availablePlates} onPlateSelect={handlePlateSelect} />

          {loadedPlates.length > 0 && (
            <button
              onClick={handleClearBar}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-sm"
            >
              Clear Bar
            </button>
          )}
        </main>

        <div className="p-5 border-t border-zinc-800 bg-zinc-900 space-y-2">
          <button
            onClick={() => navigate('/transition')}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all text-lg font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Next Set
            <ArrowRight className="w-5 h-5" />
          </button>
          {currentWeight !== targetWeight && (
            <p className="text-center text-xs text-zinc-500">
              Match target weight to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
