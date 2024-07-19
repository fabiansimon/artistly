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
  show: (children: React.ReactNode, ignoreDesign: boolean) => void;
  close: () => void;
}
function Modal(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [content, setContent] = useState<{
    render: React.ReactNode;
    ignoreDesign: boolean;
  } | null>(null);

  const ref = useRef<ModalMethods>();

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setContent(null);
    }, 300);
  }, []);

  useLayoutEffect(() => {
    ModalController.setRef(ref);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (children: React.ReactNode, ignoreDesign: boolean) => {
        setContent({
          render: children,
          ignoreDesign,
        });
        setIsVisible(true);
      },
      close: () => closeModal(),
    }),
    [closeModal]
  );

  return (
    <DialogModal
      ignoreDesign={content?.ignoreDesign || false}
      onRequestClose={closeModal}
      isVisible={isVisible}
    >
      {content && content.render}
    </DialogModal>
  );
}

export default forwardRef<ModalMethods>(Modal);
