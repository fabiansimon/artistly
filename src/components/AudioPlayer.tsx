import WaveContainer from './WaveContainer';
import { PauseIcon, PlayIcon } from 'hugeicons-react';
import { cn, formatSeconds } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';

export default function AudioPlayer({ className }: { className?: string }) {
  const { file, togglePlaying } = useAudioContext();

  if (!file) return;
  return (
    <div
      className={cn('flex flex-grow w-full space-x-3 items-center', className)}
    >
      <PlayButton onClick={() => togglePlaying()} />
      <WaveContainer simple />
      <article className="prose">
        <p className="prose-sm text-white/70">{formatSeconds(file.duration)}</p>
      </article>
    </div>
  );
}

export function PlayButton({
  onClick,
  className,
}: {
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'swap swap-rotate bg-neutral-300/20 min-h-8 min-w-8 max-h-8 max-w-8 rounded-full',
        className
      )}
    >
      <input
        type="checkbox"
        onChange={onClick}
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
  );
}
