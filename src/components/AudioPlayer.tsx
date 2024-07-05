import WaveContainer from './WaveContainer';
import { cn, formatSeconds } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { PlayButton } from './PlayButton';

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
