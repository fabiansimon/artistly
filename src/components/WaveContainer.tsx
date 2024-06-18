import { cn, formatSeconds } from '@/lib/utils';
import { Clock01Icon, PlusSignIcon } from 'hugeicons-react';
import { useMemo, useState } from 'react';

interface Offset {
  percentage: number;
  offsetX: number;
  time: number;
}

interface WaveContainerProps {
  intervals: number[];
  className?: string;
  amplifyBy?: number;
  duration?: number;
  onTap?: (time: number) => void;
  onAdd?: (time: number) => void;
}
export default function WaveContainer({
  intervals,
  duration,
  className,
  amplifyBy,
  onTap,
  onAdd,
}: WaveContainerProps) {
  const [offset, setOffset] = useState<Offset>({
    percentage: 0,
    offsetX: 0,
    time: 0,
  });
  const AMPLIFY_BY = amplifyBy || 100;

  const clipPath = useMemo(
    () => `inset(0 ${offset.percentage}% 0 0)`,
    [offset.percentage]
  );

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!duration) return;

    const target = e.currentTarget as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const percentage = 100 - (offsetX / width) * 100;
    const time = duration - duration * (percentage / 100);
    setOffset({
      percentage,
      offsetX,
      time,
    });
    if (onTap) onTap(time);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn('relative w-full', className)}
      >
        <div className="flex w-full items-center space-x-1">
          {intervals.map((peak, index) => (
            <div
              key={index}
              style={{ height: peak * AMPLIFY_BY, flex: 1 }}
              className="flex-grow w-full min-w-[0.3px] max-w-2 bg-slate-50/30 rounded-full"
            />
          ))}
        </div>
        <div
          style={{ clipPath }}
          className="absolute top-0 flex w-full items-center space-x-1"
        >
          {intervals.map((peak, index) => (
            <div
              key={index}
              style={{ height: peak * AMPLIFY_BY, flex: 1 }}
              className="flex-grow w-full min-w-[0.3px] max-w-2 bg-slate-50 rounded-full"
            />
          ))}
        </div>
      </div>
      <CursorLine
        onClick={onAdd}
        offsetX={offset.offsetX}
        time={offset.time}
      />
    </div>
  );
}

function CursorLine({
  time,
  offsetX,
  onClick,
  className,
}: {
  time: number;
  offsetX: number;
  onClick: (seconds: number) => void;
  className?: string;
}) {
  return (
    <div
      style={{ left: offsetX }}
      className={cn('bg-white flex h-full w-[1px] absolute top-3', className)}
    >
      <div className="h-9 w-32 bg-white absolute -bottom-9 rounded-md rounded-tl-none flex items-center py-[0.5px]">
        <div className="rounded-md rounded-tl-none mx-[0.5px] px-1 bg-neutral items-center flex flex-grow w-full h-full justify-center space-x-2">
          <Clock01Icon
            className="text-slate-200"
            size={16}
          />
          <article className="prose">
            <p className="text-slate-200 text-sm">{formatSeconds(time)}</p>
          </article>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => onClick(time)}
        >
          <PlusSignIcon
            size={20}
            className="text-black/80 mx-2"
          />
        </div>
      </div>
    </div>
  );
}
