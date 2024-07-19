'use client';

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import DialogModal from './DialogModal';
import AlertController from '@/controllers/AlertController';
import ToastController from '@/controllers/ToastController';

const DEFAULT_TITLE = 'Are you sure?';
const DEFAULT_DESCRIPTION = 'This cannot be reverted.';

interface AlertInfo {
  title?: string;
  description?: string;
  callback?: (args?: any) => any | void;
}

export interface AlertMethods {
  show: ({
    title,
    description,
    callback,
  }: {
    title?: string;
    description?: string;
    callback?: (args?: any) => any | void;
  }) => void;
}

function Alert(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [info, setInfo] = useState<AlertInfo | null>(null);

  const ref = useRef<AlertMethods>();

  const onClick = async () => {
    try {
      if (info?.callback) {
        setIsLoading(true);
        await info.callback();
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        closeAlert();
      }, 200);
    }
  };

  const closeAlert = () => {
    setIsVisible(false);
    setTimeout(() => {
      setInfo(null);
    }, 300);
  };

  useLayoutEffect(() => {
    AlertController.setRef(ref);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: ({
        title,
        description,
        callback,
      }: {
        title?: string;
        description?: string;
        callback?: (args?: any) => any | void;
      }) => {
        setInfo({ title, description, callback });
        setIsVisible(true);
      },
    }),
    []
  );

  return (
    <DialogModal
      onRequestClose={closeAlert}
      isVisible={isVisible}
      className="z-30"
    >
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
              onClick={closeAlert}
            >
              {'Close'}
            </button>
            {info?.callback !== undefined && (
              <button
                disabled={isLoading}
                onClick={onClick}
                className="btn btn-error ml-2"
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>Delete</>
                )}
              </button>
            )}
          </form>
        </div>
      </>
    </DialogModal>
  );
}

export default forwardRef<AlertInfo>(Alert);
