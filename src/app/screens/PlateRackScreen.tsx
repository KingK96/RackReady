import { useState } from 'react';
import { useNavigate } from 'react-router';
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
const state = getRackState();
const [targetWeight, setTargetWeight] = useState<number>(state.targetTotal ?? 225);

export function PlateRackScreen() {
  const navigate = useNavigate();
  const barWeight = 45;
  
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

  // convert perSide array to pairsLoaded counts
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
      <div className="max-w-[430px] mx-auto min-h-screen bg-zinc-900 flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <button className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">Plate Rack</h1>
            <p className="text-xs text-zinc-400">Build your load</p>
          </div>
          <button className="p-2 -mr-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-zinc-800 px-5 py-6">
          <p className="text-xs uppercase tracking-wider text-zinc-400 text-center mb-4">Current Load</p>
          <CompactBarbell loadedPlates={loadedPlates} totalWeight={totalWeight} />
        </div>

            <div className="px-5 pt-4 flex gap-2 items-center">
      <input
        className="w-28 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
        value={targetWeight}
        onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
        inputMode="numeric"
      />
      <button
        onClick={handleSuggestLoad}
        className="flex-1 bg-white text-zinc-900 font-medium py-2 rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles size={16} /> Suggest Load
      </button>
    </div>

        <main className="flex-1 overflow-y-auto px-5 py-6">
          <PlateGrid 
            plates={plateInventory}
            onAdd={handleAddPlate}
            onRemove={handleRemovePlate}
          />
        </main>

        <div className="p-5 border-t border-zinc-800 bg-zinc-900 space-y-2">
          <button 
            onClick={() => navigate('/load')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-98 transition-all text-lg font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Load Target Weight
          </button>
          <button className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Suggest Load
          </button>
        </div>
      </div>
    </div>
  );
}
