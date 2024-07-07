import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import {
  ArrowLeft03Icon,
  ArrowReloadHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from 'hugeicons-react';

export default function AudioControls({ className }: { className?: string }) {
  const {
    settings: { looping, playing },
    jumpTo,
    toggleLoop,
    togglePlaying,
  } = useAudioContext();

  return (
    <div
      className={cn(
        'flex items-center justify-items-center space-x-4',
        className
      )}
    >
      <div
        onClick={() => jumpTo(0)}
        className="cursor-pointer"
      >
        <ArrowLeft03Icon size={16} />
      </div>
      <button
        onClick={() => togglePlaying()}
        className={cn(
          'rounded-full w-8 h-8 items-center justify-center flex bg-white '
        )}
      >
        {playing ? (
          <PauseIcon
            size={16}
            className="swap-off fill-current text-black"
          />
        ) : (
          <PlayIcon
            size={16}
            className="swap-on fill-current text-black"
          />
        )}
      </button>
      <div
        onClick={() => toggleLoop()}
        className={cn('cursor-pointer', !looping && 'opacity-15')}
      >
        <ArrowReloadHorizontalIcon size={16} />
      </div>
    </div>
  );
}
