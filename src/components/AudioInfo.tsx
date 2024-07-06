import { cn, formatSeconds, ordinalString } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import {
  ArrowReloadHorizontalIcon,
  Comment01Icon,
  Layers01Icon,
  Time04Icon,
} from 'hugeicons-react';
import { useMemo } from 'react';

export default function AudioInfo({ className }: { className?: string }) {
  const {
    file,
    audioRef,
    version,
    settings: { looping },
  } = useAudioContext();

  const info = useMemo(() => {
    if (!version || !file) return;
    const { feedback, index } = version;
    return [
      {
        icon: (
          <Comment01Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: `${feedback?.length} comments`,
      },
      {
        icon: (
          <Layers01Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: `${ordinalString(index + 1)} version`,
      },
      {
        icon: (
          <Time04Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: formatSeconds(audioRef.current?.duration || 10),
      },
      {
        icon: (
          <ArrowReloadHorizontalIcon
            size={12}
            className="text-white/60"
          />
        ),
        title: 'looping',
        disabled: !looping,
      },
    ];
  }, [version, looping, file, audioRef]);

  if (!version || !info) return;

  return (
    <div className={cn('flex w-full justify-between', className)}>
      {info.map(({ icon, title, disabled }, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center justify-center space-x-1',
            disabled && 'opacity-10'
          )}
        >
          {icon}
          <article className="prose text-white/60">
            <p className="text-xs">{title}</p>
          </article>
        </div>
      ))}
    </div>
  );
}
