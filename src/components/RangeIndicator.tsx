import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { Range } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RangeIndicator({ className }: { className?: string }) {
  const { audioRef, setRange } = useAudioContext();
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!audioRef.current) return;
    setRange({ begin: 0, end: audioRef.current.duration });
  }, [audioRef, setRange]);

  return (
    <div
      className={cn(
        'flex flex-grow w-full h-1 overflow-visible bg-yellow-500/30',
        className
      )}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex cursor-pointer w-32 relative"
      >
        <div className="flex w-full bg-yellow-500 h-full"></div>
      </div>
    </div>
  );
}
