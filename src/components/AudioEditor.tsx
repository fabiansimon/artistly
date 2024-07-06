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
import AudioInfo from './AudioInfo';

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
    setSettings,
  } = useAudioContext();

  return (
    <div
      className={cn(
        'flex flex-col space-y-2 flex-grow w-full space-x-3 items-center',
        className
      )}
    >
      <AudioInfo />
      <RangeIndicator className="w-full" />
      <WaveContainer amplifyBy={200} />
      <CommentsSection
        onClick={jumpTo}
        onLoop={(timestamp) => {
          setSettings({ playing: true, looping: true });
          setRange(calculateRange(file?.duration!, timestamp, 4));
        }}
        comments={comments}
        duration={audioRef.current?.duration || 10}
      />
    </div>
  );
}
