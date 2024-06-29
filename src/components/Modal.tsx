import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function Modal({
  isVisible,
  onRequestClose,
  children,
}: {
  isVisible: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <motion.div
      initial="hidden"
      transition={{ duration: 0.08 }}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      className={cn(
        'fixed w-full h-full bg-black/50 content-center justify-center items-center',
        !isVisible && 'pointer-events-none'
      )}
    >
      <motion.div
        initial="hidden"
        transition={{ duration: 0.08 }}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={{ visible: { scale: 1 }, hidden: { scale: 0.7 } }}
        className="modal-box mx-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
