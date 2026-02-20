import React from 'react';

interface Plate {
  weight: number;
  color: string;
  width: number; // relative width
}

interface BarbellDisplayProps {
  loadedPlates: Plate[];
}

export function BarbellDisplay({ loadedPlates }: BarbellDisplayProps) {
  const barWidth = 280;
  const sleeveWidth = 40;
  const collarWidth = 8;

  return (
    <div className="relative w-full flex items-center justify-center py-8">
      {/* Left sleeve and plates */}
      <div className="flex items-center">
        {/* Left plates */}
        <div className="flex items-center gap-0.5">
          {loadedPlates.map((plate, index) => (
            <div
              key={`left-${index}`}
              className="rounded-sm flex items-center justify-center relative"
              style={{
                backgroundColor: plate.color,
                width: `${plate.width}px`,
                height: `${plate.width * 1.2}px`,
                border: '2px solid rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full bg-black/20"
                  style={{
                    width: `${plate.width * 0.4}px`,
                    height: `${plate.width * 0.4}px`,
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
            height: '32px',
          }}
        />

        {/* Left sleeve */}
        <div
          className="bg-zinc-300 rounded-l-sm relative"
          style={{
            width: `${sleeveWidth}px`,
            height: '20px',
          }}
        >
          <div className="absolute inset-y-1 left-2 right-2 bg-zinc-400/30 rounded-full" />
        </div>
      </div>

      {/* Bar */}
      <div
        className="bg-zinc-300 relative"
        style={{
          width: `${barWidth}px`,
          height: '16px',
        }}
      >
        {/* Knurling marks */}
        <div className="absolute inset-0 flex items-center justify-around px-8">
          <div className="w-0.5 h-full bg-zinc-400/40" />
          <div className="w-0.5 h-full bg-zinc-400/40" />
          <div className="w-0.5 h-full bg-zinc-400/40" />
        </div>
      </div>

      {/* Right sleeve and plates */}
      <div className="flex items-center">
        {/* Right sleeve */}
        <div
          className="bg-zinc-300 rounded-r-sm relative"
          style={{
            width: `${sleeveWidth}px`,
            height: '20px',
          }}
        >
          <div className="absolute inset-y-1 left-2 right-2 bg-zinc-400/30 rounded-full" />
        </div>

        {/* Right collar */}
        <div
          className="bg-zinc-400 rounded-sm"
          style={{
            width: `${collarWidth}px`,
            height: '32px',
          }}
        />

        {/* Right plates */}
        <div className="flex items-center gap-0.5">
          {[...loadedPlates].reverse().map((plate, index) => (
            <div
              key={`right-${index}`}
              className="rounded-sm flex items-center justify-center relative"
              style={{
                backgroundColor: plate.color,
                width: `${plate.width}px`,
                height: `${plate.width * 1.2}px`,
                border: '2px solid rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full bg-black/20"
                  style={{
                    width: `${plate.width * 0.4}px`,
                    height: `${plate.width * 0.4}px`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
