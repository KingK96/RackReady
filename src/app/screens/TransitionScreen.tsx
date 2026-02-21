import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TransitionBarbell } from '../components/TransitionBarbell';
import { ChevronLeft, Menu, ArrowRight, Plus, Check } from 'lucide-react';
import { getRackState, setRackState } from "../utils/rackState";
import { diffPerSide, calculatePerSide } from "../utils/plateMath";
import { StepDrawer } from "../components/StepDrawer";

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
  isNew?: boolean;
}

export function TransitionScreen() {
  const navigate = useNavigate();
  const state = getRackState();
  const workout = state.workout ?? "Squat";
const barWeight = state.barWeight;
const currentWeight = state.currentTotal;
const targetWeight = state.targetTotal;
const [setNumber, setSetNumber] = useState<number>(state.setNumber ?? 1);
const [setTotal, setSetTotal] = useState<number>(state.setTotal ?? 4);
const [navOpen, setNavOpen] = useState(false);
const currentPerSide = state.currentPerSide ?? [];
const targetCalc = calculatePerSide({
  barWeight,
  targetTotal: targetWeight,
  inventory: state.inventory,
});
const targetPerSide = targetCalc.perSide;

const transition = diffPerSide(currentPerSide, targetPerSide);

  const currentPlates: LoadedPlate[] = currentPerSide.map((w) => ({
  weight: w,
  color: PLATE_COLORS[w as keyof typeof PLATE_COLORS],
  width: PLATE_WIDTHS[w as keyof typeof PLATE_WIDTHS],
}));

const targetPlates: LoadedPlate[] = targetPerSide.map((w, idx) => ({
  weight: w,
  color: PLATE_COLORS[w as keyof typeof PLATE_COLORS],
  width: PLATE_WIDTHS[w as keyof typeof PLATE_WIDTHS],
  // mark plates that are newly added compared to current
  isNew: idx >= currentPerSide.length,
}));

const handleApply = () => {
  setRackState({
    currentTotal: targetCalc.achievableTotal,
    currentPerSide: targetPerSide,
  });
  navigate("/load"); // or wherever your next flow is
};
  const difference = targetWeight - currentWeight;
  const platesPerSide = difference / 2;

  const nextStep =
  transition.remove.length > 0
    ? { action: "Remove", denom: transition.remove[0].denom, count: transition.remove[0].count }
    : transition.add.length > 0
    ? { action: "Add", denom: transition.add[0].denom, count: transition.add[0].count }
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-[430px] mx-auto min-h-screen bg-zinc-900 flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <button 
            onClick={() => navigate('/load')}
            className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">{workout}</h1>
            <p className="text-xs text-zinc-400">
              Set {setNumber} of {setTotal}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
  <button
    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
    onClick={() => {
      const next = Math.max(1, setNumber - 1);
      setSetNumber(next);
      setRackState({ setNumber: next, setTotal });
    }}
  >
    Prev
  </button>

  <button
    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
    onClick={() => {
      const next = Math.min(setTotal, setNumber + 1);
      setSetNumber(next);
      setRackState({ setNumber: next, setTotal });
    }}
  >
    Next
  </button>

  <div className="ml-2 flex items-center gap-2">
    <span className="text-xs text-zinc-400">Total</span>
    <input
      className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-white text-sm"
      value={setTotal}
      onChange={(e) => {
        const v = Math.max(1, Number(e.target.value || 1));
        setSetTotal(v);
        // keep setNumber valid
        const clamped = Math.min(v, setNumber);
        if (clamped !== setNumber) setSetNumber(clamped);
        setRackState({ setNumber: clamped, setTotal: v });
      }}
      inputMode="numeric"
    />
  </div>
</div>
            <button
    className="p-2 -mr-2 hover:bg-zinc-800 rounded-lg transition-colors"
    aria-label="Menu"
    onClick={() => setNavOpen(true)}
  >
    <Menu className="w-6 h-6" />
  </button>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Current</p>
                <p className="text-3xl font-bold">{currentWeight}</p>
                <p className="text-xs text-zinc-500 mt-1">lb</p>
              </div>
              
              <div className="flex items-center justify-center px-4">
                <ArrowRight className="w-6 h-6 text-blue-500" />
              </div>

              <div className="text-center flex-1">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Target</p>
                <p className="text-3xl font-bold text-blue-400">{targetWeight}</p>
                <p className="text-xs text-zinc-500 mt-1">lb</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-700">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Plus className="w-5 h-5" />
                <span className="text-lg font-semibold">{difference} lb total</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-600/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">
                  {nextStep
                    ? `${nextStep.action} ${nextStep.count} × ${nextStep.denom} lb plate${nextStep.count > 1 ? "s" : ""} to each side`
                    : "No plate change needed"}
                </p>
              </div>
            </div>
          </div>

                {transition.add.map((x) => (
        <div key={`add-${x.denom}`} className="flex items-center gap-2">
          <Plus size={16} /> Add {x.count} × {x.denom} (each side)
        </div>
      ))}
      {transition.remove.map((x) => (
        <div key={`rm-${x.denom}`} className="flex items-center gap-2 text-zinc-300">
          Remove {x.count} × {x.denom} (each side)
        </div>
      ))}

          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-wider text-zinc-400">Visual Guide</h2>
            
            <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700">
              <TransitionBarbell 
                loadedPlates={currentPlates}
                label="Current"
                weight={targetCalc.achievableTotal}
                compact
              />
            </div>

            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-2xl p-5 border-2 border-blue-600/50">
              <TransitionBarbell 
                loadedPlates={targetPlates}
                label="After Change"
                weight={targetWeight}
                compact
              />
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-3 h-3 rounded-sm bg-blue-500 ring-2 ring-blue-500/50"></div>
                  <span>New plates highlighted</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="p-5 border-t border-zinc-800 bg-zinc-900 space-y-3">
          <button 
              onClick={handleApply}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all text-lg font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Apply Change
            </button>
          <button className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-sm">
            Skip to Next Set
          </button>
        </div>
        <StepDrawer open={navOpen} onClose={() => setNavOpen(false)} />
      </div>
    </div>
  );
}
