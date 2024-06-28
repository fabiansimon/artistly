import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { Range } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function RangeIndicator({ className }: { className?: string }) {
  const { audioRef, range, setRange } = useAudioContext();
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!audioRef.current) return;
    setRange({ begin: 0, end: 40 });
  }, [audioRef, setRange]);

  const { left, right } = useMemo(() => {
    console.log(audioRef.current?.currentSrc);
    if (!audioRef.current) return { left: 0, right: 0 };
    const { begin, end } = range;

    const duration = audioRef.current.duration;
    const l = (begin / duration) * 100;
    const r = (end / duration) * 100;
    return { left: `${l}%`, right: `${r}%` };
  }, [range, audioRef]);

  return (
    <div
      className={cn(
        'flex flex-grow w-full h-1 overflow-visible bg-yellow-500/30 relative',
        className
      )}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          'flex cursor-pointer absolute h-full bg-yellow-500 left-[10px]'
        }
        style={{ left, right }}
      />
    </div>
  );
}
