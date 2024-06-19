import { cn, formatSeconds } from '@/lib/utils';
import { Clock01Icon, PlusSignIcon } from 'hugeicons-react';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

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
  simple?: boolean;
  onTap?: (time: number) => void;
  onAdd?: (time: number) => void;
}
export default function WaveContainer({
  intervals,
  simple = false,
  duration,
  className,
  amplifyBy,
  onTap,
  onAdd,
}: WaveContainerProps) {
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);
  const [offset, setOffset] = useState<Offset>({
    percentage: 100,
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
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
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
        {!simple && (
          <CursorLine
            cursorVisible={cursorVisible}
            onAdd={onAdd}
            offsetX={offset.offsetX}
            time={offset.time}
          />
        )}
      </div>
    </div>
  );
}

function CursorLine({
  time,
  offsetX,
  onAdd,
  className,
  cursorVisible,
}: {
  time: number;
  offsetX: number;
  onAdd?: (seconds: number) => void;
  cursorVisible: boolean;
  className?: string;
}) {
  const handleOnAdd = () => {
    if (onAdd) onAdd(time);
  };
  return (
    <div
      style={{ left: offsetX }}
      className={cn(
        'bg-white flex h-full w-[1px] absolute top-4 -mt-4 z-10',
        className
      )}
    >
      <motion.div
        initial={'hidden'}
        animate={cursorVisible ? 'visible' : 'hidden'}
        variants={{
          visible: { width: 'auto', opacity: 1 },
          hidden: { width: 0, opacity: 0 },
        }}
        className="h-9 w-32 shadow-xl shadow-black/30 bg-white absolute -bottom-9 rounded-md rounded-tl-none flex items-center py-[0.5px] overflow-hidden"
      >
        <div className="rounded-md rounded-tl-none mx-[0.5px] bg-black/90 items-center flex flex-grow w-full h-full justify-center space-x-2 px-4">
          <article className="prose">
            <p className="text-slate-200 text-sm">{formatSeconds(time)}</p>
          </article>
        </div>
        <div
          className="cursor-pointer"
          onClick={handleOnAdd}
        >
          <PlusSignIcon
            size={20}
            className="text-black/80 mx-2"
          />
        </div>
      </motion.div>
    </div>
  );
}
