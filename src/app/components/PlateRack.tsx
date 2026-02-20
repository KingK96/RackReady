import React from 'react';

export interface PlateType {
  weight: number;
  color: string;
  count: number;
  width: number;
}

interface PlateRackProps {
  plates: PlateType[];
  onPlateSelect?: (plate: PlateType) => void;
}

export function PlateRack({ plates, onPlateSelect }: PlateRackProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm uppercase tracking-wider text-zinc-400">Available Plates</h3>
      <div className="grid grid-cols-5 gap-3">
        {plates.map((plate) => (
          <button
            key={plate.weight}
            onClick={() => onPlateSelect?.(plate)}
            disabled={plate.count === 0}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div
              className="w-14 h-16 rounded-md flex items-center justify-center relative"
              style={{
                backgroundColor: plate.color,
                border: '2px solid rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-black/20" />
              </div>
              <span className="relative z-10 font-bold text-xs text-black/70">
                {plate.weight}
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              <span className="text-white font-semibold">{plate.count}</span> pairs
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
