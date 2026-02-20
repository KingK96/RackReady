import React from 'react';
import { Plus, Minus } from 'lucide-react';

export interface PlateInfo {
  weight: number;
  color: string;
  count: number;
  pairsLoaded: number;
}

interface PlateGridProps {
  plates: PlateInfo[];
  onAdd?: (weight: number) => void;
  onRemove?: (weight: number) => void;
}

export function PlateGrid({ plates, onAdd, onRemove }: PlateGridProps) {
  const getPlateSize = (weight: number) => {
    switch (weight) {
      case 45: return { width: 140, height: 168 };
      case 25: return { width: 120, height: 144 };
      case 10: return { width: 100, height: 120 };
      case 5: return { width: 80, height: 96 };
      case 2.5: return { width: 70, height: 84 };
      default: return { width: 100, height: 120 };
    }
  };

  return (
    <div className="space-y-5">
      {plates.map((plate) => {
        const size = getPlateSize(plate.weight);
        const available = plate.count - plate.pairsLoaded;
        
        return (
          <div key={plate.weight} className="space-y-3">
            {/* Plate Display */}
            <div className="flex items-center justify-center">
              <div
                className="rounded-lg flex items-center justify-center relative shadow-2xl"
                style={{
                  backgroundColor: plate.color,
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  border: '3px solid rgba(0,0,0,0.4)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                }}
              >
                {/* Center hole */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full bg-black/30 shadow-inner"
                    style={{
                      width: `${size.width * 0.35}px`,
                      height: `${size.width * 0.35}px`,
                      border: '2px solid rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
                
                {/* Weight label */}
                <div className="relative z-10 text-center">
                  <div className="font-bold text-black/80" style={{ fontSize: `${size.width * 0.18}px` }}>
                    {plate.weight}
                  </div>
                  <div className="text-black/60 text-xs font-semibold">LB</div>
                </div>

                {/* Grip texture */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full opacity-10">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                  }} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-zinc-400">Available Pairs</p>
                  <p className="text-2xl font-bold">{available}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">On Bar</p>
                  <p className="text-2xl font-bold text-blue-400">{plate.pairsLoaded}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove?.(plate.weight)}
                  disabled={plate.pairsLoaded === 0}
                  className="flex-1 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Minus className="w-4 h-4" />
                  Remove
                </button>
                <button
                  onClick={() => onAdd?.(plate.weight)}
                  disabled={available === 0}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
