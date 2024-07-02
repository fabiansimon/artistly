import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        'fixed w-full h-full z-20 top-0 left-0 right-0 bottom-0 bg-black/50 content-center justify-center items-center',
        !isVisible && 'pointer-events-none',
        className
      )}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        transition={{ duration: 0.08 }}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={{ visible: { scale: 1 }, hidden: { scale: 0.7 } }}
        className={cn('modal-box mx-auto', contentClassName)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default DialogModal;
