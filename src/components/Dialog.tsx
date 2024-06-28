'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import DialogController from '@/controllers/DialogController';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DEFAULT_TITLE = 'Are you sure?';
const DEFAULT_DESCRIPTION = 'This cannot be reverted.';

interface DialogInfo {
  title?: string;
  description?: string;
  callback?: (args?: any) => any | void;
}

export interface DialogMethods {
  showDialog: (
    title?: string,
    description?: string,
    callback?: (args?: any) => any | void
  ) => void;
}

function Dialog(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [info, setInfo] = useState<DialogInfo | null>(null);

  const ref = useRef<DialogMethods>();

  const closeDialog = useCallback(() => {
    setIsVisible(false);
    setInfo(null);
  }, []);

  useLayoutEffect(() => {
    DialogController.setRef(ref);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      showDialog: (
        title?: string,
        description?: string,
        callback?: (args?: any) => any | void
      ) => {
        setInfo({ title, description, callback });
        setIsVisible(true);
      },
    }),
    []
  );

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
        <article className="prose">
          <h3 className="font-medium text-white text-md">
            {info?.title || DEFAULT_TITLE}
          </h3>
          <p className="text-white/80 text-sm">
            {info?.description || DEFAULT_DESCRIPTION}
          </p>
        </article>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn"
              onClick={closeDialog}
            >
              {'Close'}
            </button>
            {info?.callback !== undefined && (
              <button
                onClick={() => {
                  info.callback!();
                  closeDialog();
                }}
                className="btn btn-error ml-2"
              >
                {'Delete'}
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default forwardRef<DialogMethods>(Dialog);
