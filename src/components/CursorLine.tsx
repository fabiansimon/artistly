import { formatSeconds } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PlusSignIcon } from 'hugeicons-react';
import { useProjectContext } from '@/providers/ProjectProvider';

export default function CursorLine({
  time,
  style,
  cursorVisible,
}: {
  time: number;
  cursorVisible: boolean;
  style: React.CSSProperties;
}) {
  const { toggleCommentInput } = useProjectContext();
  return (
    <>
      <div
        className={'bg-white flex h-full w-[1px] absolute top-4 -mt-4 z-10'}
        style={style}
      >
        <motion.div
          initial={'hidden'}
          animate={cursorVisible ? 'visible' : 'hidden'}
          variants={{
            visible: { width: 'auto', opacity: 1 },
            hidden: { width: 0, opacity: 0 },
          }}
          className="h-7 w-30 shadow-xl shadow-black/30 bg-white absolute -bottom-6 rounded-sm rounded-tl-none flex items-center py-[0.5px] overflow-hidden"
        >
          <div className="rounded-sm rounded-tl-none mx-[0.5px] bg-black/90 items-center flex flex-grow w-full h-full justify-center space-x-2 px-4">
            <article className="prose">
              <p className="text-slate-200 text-xs">{formatSeconds(time)}</p>
            </article>
          </div>
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleCommentInput(Math.round(time));
            }}
          >
            <PlusSignIcon
              size={15}
              className="text-black/80 mx-1"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
