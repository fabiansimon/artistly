'use client';
import ToastController from '@/controllers/ToastController';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DragEvent, useCallback, useState } from 'react';

const transition = {
  duration: 500,
  type: 'spring',
  mass: 0.05,
};

export default function UploadPage() {
  const [dragging, setDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragging = useCallback(
    (e: DragEvent<HTMLDivElement>, status: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(status);
    },
    []
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragging(e, false);
    const file = e.dataTransfer.files[0];

    if (!file.type.includes('audio')) {
      ToastController.showErrorToast(
        'Wrong format.',
        'This service is only made for audio files.'
      );
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    console.log(droppedFile);
  };

  return (
    <>
      <div
        className={
          'flex items-center justify-center flex-grow h-full w-full flex-col'
        }
      >
        <Image
          width={70}
          height={70}
          src={'/music_icon.png'}
          alt="Music Icon"
        />
        <article className="prose text-center">
          <h3>{'Drag and Drop your Masterpiece'}</h3>
          <p className="-mt-2">{"We will handle it with care, don't worry"}</p>
        </article>
      </div>
      <motion.div
        initial={'hidden'}
        onDragEnter={(e) => handleDragging(e, true)}
        onDragLeave={(e) => handleDragging(e, false)}
        onDragOver={(e) => handleDragging(e, true)}
        onDrop={handleDrop}
        transition={transition}
        animate={dragging ? 'visible' : 'hidden'}
        variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
        className="absolute flex flex-grow h-full w-full bg-secondary items-center justify-center"
      >
        <article className="prose text-center">
          <h1 className="text-zinc-800">{'Drop it.'}</h1>
          <p className="-mt-6 prose-sm text-zinc-800">
            {"It's time to let it go"}
          </p>
        </article>
      </motion.div>
    </>
  );
}
