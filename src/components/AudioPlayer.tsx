import { AudioFile } from '@/types';
import WaveContainer from './WaveContainer';
import { PauseIcon, PlayIcon } from 'hugeicons-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AudioPlayer({
  audioFile,
  onPlay,
  className,
}: {
  onPlay?: () => void;
  audioFile: AudioFile;
  className?: string;
}) {
  const [playing, setPlaying] = useState<boolean>(false);
  const { intervalPeaks } = audioFile;

  const togglePlaying = () => {
    onPlay();
    setPlaying((prev) => !prev);
  };

  return (
    <div
      className={cn('flex flex-grow w-full space-x-3 items-center', className)}
    >
      <label className="swap swap-rotate bg-neutral-300/20 min-h-8 min-w-8 max-h-8 rounded-full">
        <input
          type="checkbox"
          onChange={togglePlaying}
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
      <WaveContainer intervals={intervalPeaks} />
      <article className="prose">
        <p className="prose-sm">4:22</p>
      </article>
    </div>
  );
}
