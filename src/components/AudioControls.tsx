import useKeyShortcut from '@/hooks/useKeyShortcut';
import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import {
  ArrowReloadHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from 'hugeicons-react';

export default function AudioControls() {
  const {
    settings: { looping, playing },
    toggleLoop,
    togglePlaying,
  } = useAudioContext();

  return (
    <div className="flex flex-col w-32 pl-4">
      <div className="flex w-full">
        <button
          onClick={() => toggleLoop()}
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
          onClick={() => togglePlaying()}
          className={cn(
            'btn flex-row btn-primary flex-grow rounded-t-none -mt-[1px] btn-sm',
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
  );
}
