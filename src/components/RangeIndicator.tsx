import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { useEffect, useMemo, useState } from 'react';

export default function RangeIndicator({ className }: { className?: string }) {
  const {
    file,
    settings: { looping },
    range: { begin, end },
    setRange,
  } = useAudioContext();

  const min = 0;
  const max = Math.round(file?.duration!);

  useEffect(() => {
    setRange({ begin: min, end: max });
  }, []);

  const thumbLeft = useMemo(() => {
    return ((begin - min) / (max - min)) * 100;
  }, [begin, max]);

  const thumbRight = useMemo(() => {
    return 100 - ((end - min) / (max - min)) * 100;
  }, [end, max]);

  useEffect(() => {
    maxTrigger();
    minTrigger();
  }, [begin, end]);

  const minTrigger = () => {
    setRange((prev) => ({ ...prev, begin: Math.min(prev.begin, end - 1) }));
  };

  const maxTrigger = () => {
    setRange((prev) => ({ ...prev, end: Math.max(prev.end, begin + 1) }));
  };

  return (
    <div className={cn('relative', !looping && 'opacity-10', className)}>
      <div>
        <input
          type="range"
          step="1"
          min={min}
          max={max}
          value={begin}
          onChange={(e) =>
            setRange((prev) => ({ ...prev, begin: Number(e.target.value) }))
          }
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          step="1"
          min={min}
          max={max}
          value={end}
          onChange={(e) =>
            setRange((prev) => ({ ...prev, end: Number(e.target.value) }))
          }
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <div className="relative z-10 h-1">
          <div className="absolute z-10 begin-0 right-0 bottom-0 top-0 h-full w-full bg-yellow-500/30 rounded-md"></div>
          <div
            onDoubleClick={() => setRange({ begin: min, end: max })}
            className="absolute z-20 cursor-pointer top-0 bottom-0 bg-yellow-500"
            style={{ right: `${thumbRight}%`, left: `${thumbLeft}%` }}
          />
          <div
            className="absolute z-30 w-1 h-4 top-0 bg-yellow-500 rounded-xs -mt-[5px] -ml-1"
            style={{ left: `${thumbLeft}%` }}
          />
          <div
            className="absolute z-30 w-1 h-4 top-0 bg-yellow-500 rounded-xs -mt-[5px]"
            style={{ right: `${thumbRight}%` }}
          />
        </div>
      </div>
    </div>
  );
}
