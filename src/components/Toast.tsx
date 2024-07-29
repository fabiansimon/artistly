'use client';

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import {
  CancelCircleIcon,
  HelpCircleIcon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react';

import ToastController from '@/controllers/ToastController';
import { motion } from 'framer-motion';
import { ToastType } from '@/types';
import { cn } from '@/lib/utils';
import useWindowSize from '@/hooks/useWindowSize';

interface ToastInfo {
  title?: string;
  description?: string;
  type: ToastType;
}

interface ToastMethods {
  showToast: (type: ToastType, title?: string, description?: string) => void;
}

const AUTOCLOSE_DURATION = 3000; // in milliseconds
const ANIMATION_DURATION = 0.2; // in seconds

function Toast(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [info, setInfo] = useState<ToastInfo | null>(null);

  const { isSmall } = useWindowSize();

  const ref = useRef<ToastMethods>();

  const animationStates = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 100 },
  };

  const { backgroundColor, defaultMessage, icon } = useMemo(() => {
    if (!info)
      return {
        backgroundColor: undefined,
        defaultMessage: undefined,
      };

    const { type } = info;
    return {
      icon: [
        <CancelCircleIcon
          className="text-white"
          key={1}
        />,
        <HelpCircleIcon
          className="text-white"
          key={2}
        />,
        <CheckmarkCircle02Icon
          className="text-white"
          key={3}
        />,
      ][type],
      backgroundColor: ['bg-red-600', 'bg-orange-500', 'bg-green-600'][type],
      defaultMessage: ['Something went wrong', 'Warning', 'Success'][type],
    };
  }, [info]);

  const registerAutoClose = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, AUTOCLOSE_DURATION);
    setTimeout(() => {
      setInfo(null);
    }, AUTOCLOSE_DURATION + ANIMATION_DURATION * 1000);
  };

  useLayoutEffect(() => {
    ToastController.setRef(ref);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      showToast: (type: ToastType, title?: string, description?: string) => {
        setInfo({ title, description, type });
        setIsVisible(true);
        registerAutoClose();
      },
    }),
    []
  );

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={animationStates}
      style={{ backgroundColor }}
      transition={{
        duration: ANIMATION_DURATION,
        type: 'spring',
        stiffness: 100,
        damping: 10,
        mass: 1,
      }}
      className={cn(
        'fixed p-4 right-10 rounded-md flex items-center space-x-3 z-30 bottom-10',
        isSmall && 'left-10',
        backgroundColor
      )}
    >
      {icon}
      <article className="prose">
        <p className="text-white prose-sm font-medium">
          {info?.title || defaultMessage}
        </p>
        <p className="-mt-5 prose-sm text-white/60">{info?.description}</p>
      </article>
    </motion.div>
  );
}

export default forwardRef<ToastMethods>(Toast);
