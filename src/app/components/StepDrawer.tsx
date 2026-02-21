import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Check } from "lucide-react";
import { getRackState } from "../utils/rackState";

// If you already use shadcn Drawer/Sheet, use those.
// This implementation uses a simple conditional overlay to avoid dependency mismatch.

type Step = {
  key: string;
  label: string;
  path: string;
  helper?: (state: any) => string | null;
};

const STEPS: Step[] = [
  {
    key: "load",
    label: "Load",
    path: "/load",
    helper: (s) => (s?.targetTotal ? `Target ${s.targetTotal} lb` : null),
  },
  {
    key: "transition",
    label: "Transition",
    path: "/transition",
    helper: (s) =>
      s?.setNumber && s?.setTotal ? `Set ${s.setNumber} of ${s.setTotal}` : null,
  },
  {
    key: "rack",
    label: "Rack",
    path: "/rack",
    helper: (s) => (s?.inventory ? "Plate inventory" : null),
  },
];

export function StepDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const nav = useNavigate();
  const location = useLocation();
  const state = getRackState();

  const currentPath = location.pathname === "/" ? "/load" : location.pathname;

  const currentIndex = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.path === currentPath);
    return idx === -1 ? 0 : idx;
  }, [currentPath]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close menu"
      />

      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-zinc-950 border-l border-zinc-800 p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-wider text-zinc-400">
            Navigation
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5"
            aria-label="Close"
          >
            <Menu className="w-5 h-5 rotate-90" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs text-zinc-400">Workout</div>
          <div className="text-lg font-semibold text-white">
            {state.workout ?? "Squat"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">
            Set {state.setNumber ?? 1} of {state.setTotal ?? 4}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Steps
          </div>

          {STEPS.map((step, idx) => {
            const active = idx === currentIndex;
            const done = idx < currentIndex;
            const helper = step.helper?.(state);

            return (
              <button
                key={step.key}
                onClick={() => {
                  nav(step.path);
                  onClose();
                }}
                className={[
                  "w-full text-left rounded-2xl border p-4 transition",
                  active
                    ? "border-blue-500/60 bg-blue-600/10"
                    : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold">
                    {idx + 1}. {step.label}
                  </div>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-300">
                      <Check className="w-4 h-4" /> Done
                    </span>
                  ) : active ? (
                    <span className="text-xs text-blue-300">Current</span>
                  ) : (
                    <span className="text-xs text-zinc-500">Go</span>
                  )}
                </div>

                {helper && <div className="mt-1 text-sm text-zinc-400">{helper}</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Tip: In kiosk mode, you can expose this drawer as a “Help / Steps” panel.
        </div>
      </div>
    </div>
  );
}