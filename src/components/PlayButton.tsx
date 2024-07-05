import { cn } from '@/lib/utils';
import { PauseIcon, PlayIcon } from 'hugeicons-react';
import { useEffect, useRef, useState } from 'react';

export function PlayButton({
  onClick,
  className,
  src,
}: {
  onClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  src?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src) return;
    if (playing) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [playing, src]);

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onClick) onClick(event);
    setPlaying((prev) => !prev);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
      <label
        className={cn(
          'swap swap-rotate bg-neutral-300/20 min-h-8 min-w-8 max-h-8 max-w-8 rounded-full',
          className
        )}
      >
        <input
          type="checkbox"
          onChange={handleClick}
        />

        <PlayIcon
          size={20}
          className="swap-off fill-current"
        />

        <PauseIcon
          size={20}
          className="swap-on fill-current"
        />
      </label>
    </>
  );
}
