import { useNavigate } from "react-router-dom";
import { TransitionBarbell } from '../components/TransitionBarbell';
import { ChevronLeft, Menu, ArrowRight, Check } from 'lucide-react';
import { getRackState, setRackState } from "../utils/rackState";
import { diffPerSide, calculatePerSide } from "../utils/plateMath";

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

  const barWeight = state.barWeight;
  const currentWeight = state.currentTotal;
  const targetWeight = state.targetTotal;

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
    isNew: idx >= currentPerSide.length,
  }));

  const handleApply = () => {
    setRackState({
      currentTotal: targetCalc.achievableTotal,
      currentPerSide: targetPerSide,
    });
    navigate("/load");
  };

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
              <div className="text-xs text-zinc-400 mt-1">Transition guidance</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/load')}
              className="px-4 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 transition-colors text-sm flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Load
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
          {/* Left: instructions */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Current → Target</div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                  <div className="text-xs text-zinc-400">Current</div>
                  <div className="text-2xl font-bold mt-1">
                    {currentWeight}<span className="text-sm text-zinc-500 ml-1">lb</span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-600/10 border border-blue-600/30 p-4">
                  <div className="text-xs text-blue-200">Target</div>
                  <div className="text-2xl font-bold mt-1 text-blue-200">
                    {targetWeight}<span className="text-sm text-blue-200/80 ml-1">lb</span>
                  </div>
                  {targetCalc.achievableTotal !== targetWeight && (
                    <div className="text-xs text-blue-200/80 mt-1">Closest: {targetCalc.achievableTotal} lb</div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-zinc-800">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Steps</div>

                {transition.add.length === 0 && transition.remove.length === 0 && (
                  <div className="text-sm text-zinc-300">No plate change needed.</div>
                )}

                <div className="space-y-2">
                  {transition.remove.map((x) => (
                    <div key={`rm-${x.denom}`} className="flex items-center gap-2 text-sm text-zinc-300">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800">−</span>
                      Remove {x.count} × {x.denom} (each side)
                    </div>
                  ))}
                  {transition.add.map((x) => (
                    <div key={`add-${x.denom}`} className="flex items-center gap-2 text-sm">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600/15 border border-blue-600/30 text-blue-200">+</span>
                      Add {x.count} × {x.denom} (each side)
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleApply}
                className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all text-base font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Apply Change
              </button>

              <button
                onClick={() => navigate('/load')}
                className="mt-3 w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 transition-colors text-sm"
              >
                Skip
              </button>
            </div>
          </aside>

          {/* Right: visual guide */}
          <main className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400">Visual Guide</div>
                  <div className="text-sm text-zinc-500 mt-1">New plates are highlighted</div>
                </div>
                <div className="text-xs text-zinc-500">Bar: {barWeight} lb</div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5">
                  <TransitionBarbell loadedPlates={currentPlates} label="Current" weight={currentWeight} compact />
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 rotate-90 text-blue-200" />
                  </div>
                </div>

                <div className="rounded-2xl bg-zinc-950 border border-blue-600/40 p-5">
                  <TransitionBarbell
                    loadedPlates={targetPlates}
                    label="After Change"
                    weight={targetCalc.achievableTotal}
                    compact
                  />
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="w-3 h-3 rounded-sm bg-blue-500 ring-2 ring-blue-500/50"></div>
                      <span>New plates highlighted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}