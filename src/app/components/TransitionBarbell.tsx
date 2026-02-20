import React from 'react';

interface Plate {
  weight: number;
  color: string;
  width: number;
  isNew?: boolean;
}

interface TransitionBarbellProps {
  loadedPlates: Plate[];
  label: string;
  weight: number;
  compact?: boolean;
}

export function TransitionBarbell({ loadedPlates, label, weight, compact = false }: TransitionBarbellProps) {
  const barWidth = compact ? 180 : 220;
  const sleeveWidth = compact ? 25 : 30;
  const collarWidth = compact ? 5 : 6;
  const scale = compact ? 0.7 : 0.85;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="text-lg font-bold">
          {weight}
          <span className="text-sm text-zinc-400 ml-1">lb</span>
        </p>
      </div>
      
      <div className="relative w-full flex items-center justify-center py-4">
        {/* Left sleeve and plates */}
        <div className="flex items-center">
          {/* Left plates */}
          <div className="flex items-center gap-0.5">
            {loadedPlates.map((plate, index) => (
              <div
                key={`left-${index}`}
                className={`rounded-sm flex items-center justify-center relative transition-all ${
                  plate.isNew ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900' : ''
                }`}
                style={{
                  backgroundColor: plate.color,
                  width: `${plate.width * scale}px`,
                  height: `${plate.width * 1.2 * scale}px`,
                  border: '2px solid rgba(0,0,0,0.3)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full bg-black/20"
                    style={{
                      width: `${plate.width * 0.4 * scale}px`,
                      height: `${plate.width * 0.4 * scale}px`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Left collar */}
          <div
            className="bg-zinc-400 rounded-sm"
            style={{
              width: `${collarWidth}px`,
              height: `${24 * scale}px`,
            }}
          />

          {/* Left sleeve */}
          <div
            className="bg-zinc-300 rounded-l-sm relative"
            style={{
              width: `${sleeveWidth}px`,
              height: `${16 * scale}px`,
            }}
          >
            <div className="absolute inset-y-1 left-1.5 right-1.5 bg-zinc-400/30 rounded-full" />
          </div>
        </div>

        {/* Bar */}
        <div
          className="bg-zinc-300 relative"
          style={{
            width: `${barWidth}px`,
            height: `${14 * scale}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-around px-4">
            <div className="w-px h-full bg-zinc-400/40" />
            <div className="w-px h-full bg-zinc-400/40" />
          </div>
        </div>

        {/* Right sleeve and plates */}
        <div className="flex items-center">
          {/* Right sleeve */}
          <div
            className="bg-zinc-300 rounded-r-sm relative"
            style={{
              width: `${sleeveWidth}px`,
              height: `${16 * scale}px`,
            }}
          >
            <div className="absolute inset-y-1 left-1.5 right-1.5 bg-zinc-400/30 rounded-full" />
          </div>

          {/* Right collar */}
          <div
            className="bg-zinc-400 rounded-sm"
            style={{
              width: `${collarWidth}px`,
              height: `${24 * scale}px`,
            }}
          />

          {/* Right plates */}
          <div className="flex items-center gap-0.5">
            {[...loadedPlates].reverse().map((plate, index) => (
              <div
                key={`right-${index}`}
                className={`rounded-sm flex items-center justify-center relative transition-all ${
                  plate.isNew ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900' : ''
                }`}
                style={{
                  backgroundColor: plate.color,
                  width: `${plate.width * scale}px`,
                  height: `${plate.width * 1.2 * scale}px`,
                  border: '2px solid rgba(0,0,0,0.3)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full bg-black/20"
                    style={{
                      width: `${plate.width * 0.4 * scale}px`,
                      height: `${plate.width * 0.4 * scale}px`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
