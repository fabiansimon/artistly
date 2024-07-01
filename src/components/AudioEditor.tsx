import { calculateRange, cn, formatSeconds, ordinalString } from '@/lib/utils';
import { Comment } from '@/types';
import { useMemo, useState } from 'react';
import WaveContainer from './WaveContainer';
import {
  ArrowReloadHorizontalIcon,
  Comment01Icon,
  Layers01Icon,
  Time04Icon,
} from 'hugeicons-react';
import { useAudioContext } from '@/providers/AudioProvider';
import CommentsSection from './CommentsSection';
import RangeIndicator from './RangeIndicator';

export default function AudioEditor({
  className,
  comments,
}: {
  className?: string;
  comments: Comment[];
}) {
  const {
    file,
    audioRef,
    project,
    version,
    settings: { looping },
    jumpTo,
    setRange,
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
        title: `${ordinalString(index)} version`,
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

  if (!info || !project) return;

  return (
    <div
      className={cn('flex flex-grow w-full space-x-3 items-center', className)}
    >
      <div className="flex relative flex-col w-full">
        <div
          className={cn(
            'flex-grow bg-black/20 w-full flex-col items-center px-4 py-2 rounded-md',
            className
          )}
        >
          <div className="flex justify-between">
            <h2 className="text-white text-sm">{project?.title}</h2>
            <p className="text-xs text-right text-white/50">
              Version {version?.title}
            </p>
          </div>
          <p className="text-xs text-white/50 mb-4 mt-1">{version?.notes}</p>
          <RangeIndicator className="mb-4" />
          <WaveContainer amplifyBy={200} />
          <CommentsSection
            onClick={jumpTo}
            onLoop={(timestamp) =>
              setRange(calculateRange(file?.duration!, timestamp, 4))
            }
            comments={comments}
            duration={audioRef.current?.duration || 10}
          />
          <div
            className={cn(
              'flex justify-between mt-4',
              comments.length > 0 && 'mt-10'
            )}
          >
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
        </div>
      </div>
    </div>
  );
}
