import React from 'react';

interface Plate {
  weight: number;
  color: string;
  width: number;
}

interface CompactBarbellProps {
  loadedPlates: Plate[];
  totalWeight: number;
}

export function CompactBarbell({ loadedPlates, totalWeight }: CompactBarbellProps) {
  const barWidth = 140;
  const sleeveWidth = 20;
  const collarWidth = 4;
  const scale = 0.5;

  return (
    <div className="space-y-3">
      <div className="relative w-full flex items-center justify-center py-3">
        {/* Left sleeve and plates */}
        <div className="flex items-center">
          {/* Left plates */}
          <div className="flex items-center gap-px">
            {loadedPlates.map((plate, index) => (
              <div
                key={`left-${index}`}
                className="rounded-sm flex items-center justify-center relative"
                style={{
                  backgroundColor: plate.color,
                  width: `${plate.width * scale}px`,
                  height: `${plate.width * 1.2 * scale}px`,
                  border: '1px solid rgba(0,0,0,0.3)',
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
              height: `${18 * scale}px`,
            }}
          />

          {/* Left sleeve */}
          <div
            className="bg-zinc-300 rounded-l-sm"
            style={{
              width: `${sleeveWidth}px`,
              height: `${12 * scale}px`,
            }}
          />
        </div>

        {/* Bar */}
        <div
          className="bg-zinc-300"
          style={{
            width: `${barWidth}px`,
            height: `${10 * scale}px`,
          }}
        />

        {/* Right sleeve and plates */}
        <div className="flex items-center">
          {/* Right sleeve */}
          <div
            className="bg-zinc-300 rounded-r-sm"
            style={{
              width: `${sleeveWidth}px`,
              height: `${12 * scale}px`,
            }}
          />

          {/* Right collar */}
          <div
            className="bg-zinc-400 rounded-sm"
            style={{
              width: `${collarWidth}px`,
              height: `${18 * scale}px`,
            }}
          />

          {/* Right plates */}
          <div className="flex items-center gap-px">
            {[...loadedPlates].reverse().map((plate, index) => (
              <div
                key={`right-${index}`}
                className="rounded-sm flex items-center justify-center relative"
                style={{
                  backgroundColor: plate.color,
                  width: `${plate.width * scale}px`,
                  height: `${plate.width * 1.2 * scale}px`,
                  border: '1px solid rgba(0,0,0,0.3)',
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

      {/* Weight display */}
      <div className="text-center">
        <div className="text-3xl font-bold">
          {totalWeight}
          <span className="text-lg text-zinc-400 ml-1">lb</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Bar: 45 lb + Plates: {totalWeight - 45} lb
        </p>
      </div>
    </div>
  );
}
