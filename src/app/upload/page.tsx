'use client';

import ToastController from '@/controllers/ToastController';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  DragEvent,
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import ShareContainer from '@/components/ShareContainer';
import { useAudioContext } from '@/providers/AudioProvider';
import { analyzeAudio } from '@/lib/audioHelpers';
import { cn } from '@/lib/utils';

const transition = {
  duration: 500,
  type: 'spring',
  mass: 0.05,
};

export default function UploadPage() {
  const { file, setFile } = useAudioContext();
  const [dragging, setDragging] = useState<boolean>(false);
  const [rawFile, setRawFile] = useState<File | undefined>();

  useEffect(() => {
    if (!rawFile) return;
    (async () => {
      const data = await analyzeAudio(rawFile);
      setFile(data);
    })();
  }, [rawFile, setFile]);

  const handleDragging = useCallback(
    (e: DragEvent<HTMLDivElement>, status: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(status);
    },
    []
  );

  const addFile = (rawFile: File) => {
    if (!rawFile.type.includes('audio')) {
      ToastController.showErrorToast(
        'Wrong format.',
        'This service is only made for audio files.'
      );
      return;
    }

    setRawFile(rawFile);
  };

  const handlerawFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFile = e.target.files[0];
    addFile(rawFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragging(e, false);
    const rawFile = e.dataTransfer.files[0];
    addFile(rawFile);
  };

  return (
    <div
      onDragEnter={(e) => handleDragging(e, true)}
      onDragLeave={(e) => handleDragging(e, false)}
      onDragOver={(e) => handleDragging(e, true)}
      onDrop={handleDrop}
      className="flex flex-grow items-center justify-center h-full w-full"
    >
      <div className="w-full flex-grow">
        {!rawFile || !file ? (
          <InitContainer onFile={handlerawFileChange} />
        ) : (
          <ShareContainer audioFile={file} />
        )}
      </div>
      <motion.div
        initial={'hidden'}
        transition={transition}
        animate={dragging ? 'visible' : 'hidden'}
        variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
        className={cn(
          'absolute pointer-events-none flex flex-grow h-full w-full bg-secondary items-center justify-center'
        )}
      >
        <article className="prose text-center">
          <h1 className="text-zinc-800">{'Drop it.'}</h1>
          <p className="-mt-6 prose-sm text-zinc-800">
            {"It's time to let it go"}
          </p>
        </article>
      </motion.div>
    </div>
  );
}

function InitContainer({
  onFile,
}: {
  onFile: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center flex-col">
      <Image
        width={60}
        height={60}
        src={'/music_icon.png'}
        alt="Music Icon"
      />
      <article className="prose text-center">
        <h3 className="text-white">{'Import your Masterpiece'}</h3>
        <p className="-mt-3 text-white/70">
          {"We will handle it with care, don't worry"}
        </p>
      </article>
      <input
        type="file"
        onChange={onFile}
        className="file-input file-input-bordered file-input-md w-full max-w-xs mt-4"
      />
    </div>
  );
}
