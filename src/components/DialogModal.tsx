import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import useWindowSize from '@/hooks/useWindowSize';

function DialogModal({
  isVisible,
  onRequestClose,
  children,
  className,
  contentClassName,
}: {
  isVisible: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}): JSX.Element {
  const { isSmall } = useWindowSize();

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        if (onRequestClose) onRequestClose();
      }}
      initial="hidden"
      transition={{ duration: 0.08 }}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      className={cn(
        'fixed w-full h-full z-20 top-0 left-0 right-0 bottom-0 bg-black/50 flex flex-col items-center justify-end md:justify-center',
        !isVisible && 'pointer-events-none',
        className
      )}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        transition={{ duration: 0.05 }}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={
          isSmall
            ? {
                visible: { translateY: 0 },
                hidden: { translateY: 1000 },
              }
            : { visible: { scale: 1 }, hidden: { scale: 0.7 } }
        }
        className={cn(
          'rounded-tl-xl overflow-y-auto rounded-tr-xl min-w-full md:min-w-0 py-5 px-4 bg-neutral-900 max-h-[90%]',
          !isSmall && 'modal-box',
          contentClassName
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default DialogModal;
