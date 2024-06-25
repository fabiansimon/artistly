import { cn, formatSeconds } from '@/lib/utils';
import { Comment } from '@/types';
import { useRef, useState } from 'react';
import WaveContainer, { AudioRef } from './WaveContainer';
import {
  ArrowReloadHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from 'hugeicons-react';
import { motion } from 'framer-motion';
import AudioInfoBox from './AudioInfoBox';
import useKeyShortcut from '@/hooks/useKeyShortcut';
import { useAudioContext } from '@/providers/AudioProvider';

export default function AudioEditor({
  className,
  comments,
}: {
  className?: string;
  comments: Comment[];
}) {
  const {
    file,
    settings: { looping, playing },
    setSettings,
  } = useAudioContext();
  const audioRef = useRef<AudioRef | null>(null);

  const toggleLoop = () => {
    setSettings((prev) => {
      const newState = !prev.looping;
      return {
        ...prev,
        looping: newState,
      };
    });
  };

  const togglePlaying = () => {
    setSettings((prev) => {
      const newState = !prev.playing;
      if (newState) audioRef.current?.play();
      else audioRef?.current?.pause();

      return {
        ...prev,
        playing: newState,
      };
    });
  };

  useKeyShortcut(' ', togglePlaying, true);
  useKeyShortcut('L', toggleLoop, true);

  return (
    <div
      className={cn('flex flex-grow w-full space-x-3 items-center', className)}
    >
      <div className="flex relative flex-col w-full">
        <AudioInfoBox className="mb-4" />
        <WaveContainer
          ref={audioRef}
          amplifyBy={200}
        />
        <CommentsSection
          onClick={(timestamp: number) => audioRef.current?.setTime(timestamp)}
          comments={comments}
          duration={file?.duration!}
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
    </div>
  );
}

function CommentsSection({
  comments,
  duration,
  onClick,
}: {
  comments: Comment[];
  duration: number;
  onClick: (timestamp: number) => void;
}) {
  return (
    <div className="flex w-full mt-3 relative">
      {comments.map((comment) => {
        const { timestamp } = comment;
        const offset = (timestamp / duration) * 100;
        return (
          <CommentTile
            onClick={() => onClick(timestamp)}
            style={{ left: `${offset}%` }}
            key={comment.id}
            comment={comment}
          />
        );
      })}
    </div>
  );
}

function CommentTile({
  comment,
  style,
  onClick,
}: {
  comment: Comment;
  style: React.CSSProperties;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState<boolean>(false);
  const { timestamp, text } = comment;

  return (
    <div
      style={style}
      className="absolute h-7"
    >
      <div className="w-[1px] h-16 bg-white/80 absolute bottom-4 left-[1px]" />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className={cn(
          'flex cursor-pointer bg-neutral-900 relative items-center space-x-1 overflow-hidden rounded-sm h-full border border-neutral-100/5',
          hovered && 'z-10'
        )}
      >
        <div className="items-center flex px-2 py-1 h-full">
          <p className="prose text-xs text-neutral-500">
            {formatSeconds(timestamp)}
          </p>
        </div>

        <motion.div
          transition={{
            ease: 'linear',
            stiffness: 1,
            duration: 0.09,
          }}
          initial="minimized"
          animate={hovered ? 'expanded' : 'minimized'}
          variants={{
            expanded: { width: 'auto' },
            minimized: { width: 60 },
          }}
          className="flex h-full items-center pr-4"
        >
          <p className="prose text-[13px] text-white/80 truncate">{text}</p>
        </motion.div>
      </div>
    </div>
  );
}
