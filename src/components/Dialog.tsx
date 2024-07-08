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
import DialogModal from './DialogModal';

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
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const ref = useRef<DialogMethods>();

  const closeDialog = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setContent(null);
      setInfo(null);
    }, 300);
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
      showCustomDialog: (children: React.ReactNode) => {
        setContent(children);
        setIsVisible(true);
      },
      closeDialog: () => closeDialog(),
    }),
    []
  );

  return (
    <DialogModal
      onRequestClose={closeDialog}
      isVisible={isVisible}
    >
      {!content && (
        <>
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
                className="btn btn-outline text-white/60"
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
        </>
      )}
      {content && content}
    </DialogModal>
  );
}

export default forwardRef<DialogMethods>(Dialog);
