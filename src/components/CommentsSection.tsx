import { calculateRange, cn, formatSeconds } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';
import { useProjectContext } from '@/providers/ProjectProvider';
import { Comment } from '@/types';
import { motion } from 'framer-motion';
import { ArrowReloadHorizontalIcon } from 'hugeicons-react';
import { useState } from 'react';

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  const { file, range, duration, jumpTo, setRange, setSettings } =
    useAudioContext();
  const { highlightedComment } = useProjectContext();

  const handleLoop = (timestamp: number) => {
    setSettings({ playing: true, looping: true });
    let newRange = calculateRange(file?.duration!, timestamp, 4);
    if (newRange.begin === range.begin && newRange.end === range.end) {
      newRange = { begin: 0, end: duration };
    }
    setRange(newRange);
  };

  return (
    <div
      className={cn(
        'flex w-full relative h-8 border rounded-md border-neutral-700/50',
        comments.length === 0 && 'items-center'
      )}
    >
      {comments.length === 0 && (
        <p className="prose text-white/60 text-[12px] text-center mx-auto">
          No feedback yet
        </p>
      )}
      {comments.map((comment) => {
        const { timestamp } = comment;
        const offset = (timestamp! / duration) * 100;

        return (
          <CommentTile
            onClick={() => jumpTo(timestamp!)}
            style={{
              left: `${offset}%`,
              zIndex: highlightedComment === comment.id ? 20 : undefined,
            }}
            key={comment.id}
            onLoop={() => handleLoop(timestamp!)}
            comment={comment}
          />
        );
      })}
    </div>
  );
}

function CommentTile({
  comment,
  onLoop,
  style,
  onClick,
}: {
  comment: Comment;
  style: React.CSSProperties;
  onLoop: (timestamp: number) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState<boolean>(false);
  const { timestamp, text } = comment;

  return (
    <div
      style={style}
      className={cn(
        'absolute pointer-events-none flex flex-col',
        hovered && 'z-7'
      )}
    >
      <div className="flex">
        <div
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="bg-neutral-700 flex overflow-hidden  pointer-events-auto"
        >
          <p className="prose cursor-pointer text-white/80 font-medium text-xs px-2 py-1">
            {formatSeconds(timestamp!)}
          </p>
          <motion.div
            initial="hidden"
            animate={hovered ? 'expanded' : 'hidden'}
            variants={{
              expanded: { width: 'auto', marginRight: 6 },
              hidden: { width: 0 },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onLoop(timestamp!);
            }}
            className="flex cursor-pointer items-center justify-center ml-[1px]"
          >
            <ArrowReloadHorizontalIcon
              className="text-white/50 hover:text-white"
              size={14}
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial="hidden"
        animate={hovered ? 'expanded' : 'hidden'}
        variants={{
          expanded: {
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 1000,
              damping: 40,
              duration: 0.1,
            },
          },
          hidden: {
            opacity: 0,
            scale: 0.8,
            transition: {
              duration: 0.1,
              ease: 'easeInOut',
            },
          },
        }}
        className="bg-primary rounded-bl-md px-2 py-1 rounded-tr-md rounded-br-md"
      >
        <p className="prose text-white text-[13px] font-medium">{text}</p>
      </motion.div>
    </div>
  );
}
