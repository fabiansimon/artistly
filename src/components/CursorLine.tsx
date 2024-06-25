import { formatSeconds } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PlusSignIcon } from 'hugeicons-react';

export default function CursorLine({
  time,
  onAdd,
  style,
  cursorVisible,
}: {
  time: number;
  onAdd?: (seconds: number) => void;
  cursorVisible: boolean;
  style: React.CSSProperties;
}) {
  const handleOnAdd = () => {
    if (onAdd) onAdd(time);
  };
  return (
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
        className="h-9 w-32 shadow-xl shadow-black/30 bg-white absolute -bottom-9 rounded-md rounded-tl-none flex items-center py-[0.5px] overflow-hidden"
      >
        <div className="rounded-md rounded-tl-none mx-[0.5px] bg-black/90 items-center flex flex-grow w-full h-full justify-center space-x-2 px-4">
          <article className="prose">
            <p className="text-slate-200 text-sm">{formatSeconds(time)}</p>
          </article>
        </div>
        <div
          className="cursor-pointer"
          onClick={handleOnAdd}
        >
          <PlusSignIcon
            size={20}
            className="text-black/80 mx-2"
          />
        </div>
      </motion.div>
    </div>
  );
}
