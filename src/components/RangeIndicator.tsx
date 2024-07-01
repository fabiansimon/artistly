import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { useEffect, useMemo, useState } from 'react';

export default function RangeIndicator({ className }: { className?: string }) {
  const {
    range: { begin, end },
    setRange,
  } = useAudioContext();

  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [minThumb, setMinThumb] = useState(0);
  const [maxThumb, setMaxThumb] = useState(0);

  const min = 100;
  const max = 10000;

  useEffect(() => {
    minTrigger();
    maxTrigger();
  }, [minPrice, maxPrice]);

  const minTrigger = () => {
    setMinPrice((prevMin) => Math.min(prevMin, maxPrice - 500));
    setMinThumb(((minPrice - min) / (max - min)) * 100);
  };

  const maxTrigger = () => {
    setMaxPrice((prevMax) => Math.max(prevMax, minPrice + 500));
    setMaxThumb(100 - ((maxPrice - min) / (max - min)) * 100);
  };

  return (
    <div className={cn('relative', className)}>
      <div>
        <input
          type="range"
          step="100"
          min={min}
          max={max}
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          step="100"
          min={min}
          max={max}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />
        <div className="relative z-10 h-1">
          <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-yellow-400/30"></div>
          <div
            className="absolute z-20 top-0 bottom-0 bg-yellow-500"
            style={{ right: `${maxThumb}%`, left: `${minThumb}%` }}
          />
          <div
            className="absolute z-30 w-1 h-4 top-0 bg-yellow-500 rounded-xs -mt-[5px] -ml-1"
            style={{ left: `${minThumb}%` }}
          />
          <div
            className="absolute z-30 w-1 h-4 top-0 bg-yellow-500 rounded-xs -mt-[5px]"
            style={{ right: `${maxThumb}%` }}
          />
        </div>
      </div>
    </div>
  );
}
