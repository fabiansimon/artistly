import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { useEffect, useMemo, useState } from 'react';

export default function RangeIndicator({ className }: { className?: string }) {
  const { file, range, setRange } = useAudioContext();

  const min = 0;
  const max = Math.round(file?.duration!);

  const [left, setLeft] = useState(min);
  const [right, setRight] = useState(max);

  const thumbLeft = useMemo(() => {
    return ((left - min) / (max - min)) * 100;
  }, [left, max]);

  const thumbRight = useMemo(() => {
    return 100 - ((right - min) / (max - min)) * 100;
  }, [right, max]);

  useEffect(() => {
    maxTrigger();
    minTrigger();
    setRange({ begin: left, end: right });
    // console.log('Minimum', left, 'Maximum', right);
  }, [left, right]);

  const minTrigger = () => {
    setLeft((prev) => Math.min(prev, right - 1));
  };

  const maxTrigger = () => {
    setRight((prev) => Math.max(prev, left + 1));
  };

  return (
    <div className={cn('relative', className)}>
      <div>
        <input
          type="range"
          step="1"
          min={min}
          max={max}
          value={left}
          onChange={(e) => setLeft(Number(e.target.value))}
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          step="1"
          min={min}
          max={max}
          value={right}
          onChange={(e) => setRight(Number(e.target.value))}
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <div className="relative z-10 h-1">
          <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-yellow-400/30"></div>
          <div
            className="absolute z-20 top-0 bottom-0 bg-yellow-500"
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
