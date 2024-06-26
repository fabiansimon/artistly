import { formatSeconds } from '@/lib/utils';
import { Comment } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CommentsSection({
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
      className="absolute flex flex-col"
    >
      <div className="flex h-full">
        <div className="w-[2px] bg-primary h-6 absolute" />
        <div
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="bg-neutral rounded-tr-md rounded-br-md overflow-hidden cursor-pointer mr-auto"
        >
          <p className="prose cursor-pointer text-white/80 font-medium text-xs px-2 py-1">
            {formatSeconds(timestamp)}
          </p>
        </div>
      </div>
      <motion.div
        initial="hidden"
        animate={hovered ? 'expanded' : 'hidden'}
        variants={{
          expanded: {
            opacity: 1,
            maxHeight: 'none',
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
            maxHeight: 0,
            scale: 0.8,
            transition: {
              duration: 0.1,
              ease: 'easeInOut',
            },
          },
        }}
        className="bg-primary rounded-bl-md px-2 py-1 rounded-tr-md rounded-br-md"
      >
        <p className="prose text-black/80 text-[13px]">{text}</p>
      </motion.div>
    </div>
  );
}
