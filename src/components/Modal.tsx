'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import DialogModal from './DialogModal';
import ModalController from '@/controllers/ModalController';

export interface ModalMethods {
  show: (children: React.ReactNode) => void;
  close: () => void;
}
function Modal(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const ref = useRef<ModalMethods>();

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setContent(null);
  }, []);

  useLayoutEffect(() => {
    ModalController.setRef(ref);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (children: React.ReactNode) => {
        setContent(children);
        setIsVisible(true);
      },
      close: () => closeModal(),
    }),
    [closeModal]
  );

  return (
    <DialogModal
      onRequestClose={closeModal}
      isVisible={isVisible}
    >
      {content && content}
    </DialogModal>
  );
}

export default forwardRef<ModalMethods>(Modal);
