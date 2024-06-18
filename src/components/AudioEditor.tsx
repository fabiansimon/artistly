import { cn } from '@/lib/utils';
import { AudioFile } from '@/types';
import { useState } from 'react';
import WaveContainer from './WaveContainer';
import {
  ArrowReloadHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from 'hugeicons-react';

export default function AudioEditor({
  audioFile,
  comments,
  onPlay,
  className,
}: {
  onPlay?: () => void;
  comments?: Comment;
  audioFile: AudioFile;
  className?: string;
}) {
  const [playing, setPlaying] = useState<boolean>(false);
  const [looping, setLooping] = useState<boolean>(true);

  const toggleLoop = () => {
    setLooping((prev) => !prev);
  };

  const togglePlaying = () => {
    if (onPlay) onPlay();
    setPlaying((prev) => !prev);
  };

  const { intervalPeaks, duration } = audioFile;
  return (
    <div
      className={cn('flex flex-grow w-full space-x-3 items-center', className)}
    >
      <div className="flex relative flex-col w-full">
        <WaveContainer
          onTap={(time) => console.log(time)}
          amplifyBy={200}
          duration={duration}
          intervals={intervalPeaks}
        />
      </div>

      <div className="flex flex-col w-32 pl-4">
        <div className="flex w-full">
          <button
            onClick={toggleLoop}
            className={cn(
              'btn flex-row btn-primary flex-grow rounded-b-none btn-sm',
              !looping && 'btn-outline'
            )}
          >
            <ArrowReloadHorizontalIcon size={16} />
            Loop
          </button>
        </div>
        <div className="flex w-full">
          <button
            onClick={togglePlaying}
            className={cn(
              'btn flex-row btn-secondary flex-grow rounded-t-none -mt-[1px] btn-sm',
              !playing && 'btn-outline'
            )}
          >
            {playing ? (
              <PauseIcon
                size={16}
                className="swap-off fill-current"
              />
            ) : (
              <PlayIcon
                size={16}
                className="swap-on fill-current"
              />
            )}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
