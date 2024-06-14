'use client';

import ToastController from '@/controllers/ToastController';
import { LocalStorage } from '@/lib/localStorage';
import { analyzeAudio, cn } from '@/lib/utils';
import { AudioFile } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DragEvent, useCallback, useState, useEffect } from 'react';
import { Mail01Icon } from 'hugeicons-react';

const transition = {
  duration: 500,
  type: 'spring',
  mass: 0.05,
};

enum InputType {
  TITLE,
  DESCRIPTION,
  EMAIL,
  ADD_EMAIL,
}

interface InputData {
  title: string;
  description: string;
  email: string;
  emailList: string[];
}

export default function UploadPage() {
  const [dragging, setDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<AudioFile | undefined>();

  useEffect(() => {
    (async () => {
      const cachedAudio = LocalStorage.fetchAudioData();
      setAudioFile(cachedAudio);
    })();
  }, []);

  useEffect(() => {
    if (!file) return;
    (async () => {
      const data = await analyzeAudio(file);
      LocalStorage.saveAudioData(data);
      setAudioFile(data);
    })();
  }, [file]);

  const handleDragging = useCallback(
    (e: DragEvent<HTMLDivElement>, status: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(status);
    },
    []
  );

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    handleDragging(e, false);
    const file = e.dataTransfer.files[0];

    if (!file.type.includes('audio')) {
      ToastController.showErrorToast(
        'Wrong format.',
        'This service is only made for audio files.'
      );
      return;
    }

    setFile(file);
  };

  return (
    <>
      <div
        className={
          'flex items-center justify-center flex-grow h-full w-full flex-col'
        }
      >
        {!file && !audioFile ? (
          <InitContainer />
        ) : (
          <ShareContainer audioFile={audioFile} />
        )}
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
        className={cn(
          'absolute pointer-events-auto flex flex-grow h-full w-full bg-secondary items-center justify-center',
          audioFile && 'pointer-events-none'
        )}
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

function ShareContainer({ audioFile }: { audioFile?: AudioFile }) {
  const [inputData, setInputData] = useState<InputData>({
    title: audioFile?.name || '',
    description: '',
    emailList: [],
    email: '',
  });

  if (audioFile === undefined)
    return <span className="loading loading-ring loading-sm"></span>;

  const handleInput = (type: InputType, value?: string) => {
    setInputData((prev) => {
      switch (type) {
        case InputType.TITLE:
          return { ...prev, title: value };
        case InputType.ADD_EMAIL:
          const emailList = prev.emailList;
          emailList.push(prev.email);
          return { ...prev, emailList, email: '' };
        case InputType.DESCRIPTION:
          return { ...prev, description: value };
        case InputType.EMAIL:
          return { ...prev, email: value };
      }
    });
  };

  const { intervalPeaks } = audioFile;
  return (
    <div className="flex flex-col w-[80%] justify-center bg-neutral rounded-md items-center space-y-2 px-4 py-2">
      <input
        onInput={({ currentTarget: { value } }) =>
          handleInput(InputType.TITLE, value)
        }
        type="text"
        value={inputData.title}
        placeholder="Type here"
        className="input w-full max-w-xs bg-transparent text-center"
      />
      <WaveContainer intervals={intervalPeaks} />
      <div className="flex flex-wrap">
        {inputData.emailList.map((email, index) => (
          <div key={index}>
            <p>{email}</p>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <label className="input input-bordered flex items-center gap-2">
          <Mail01Icon size={18} />
          <input
            onInput={({ currentTarget: { value } }) =>
              handleInput(InputType.EMAIL, value)
            }
            value={inputData.email}
            type="text"
            className="grow"
            placeholder="Email"
          />
        </label>
        <button
          onClick={() => handleInput(InputType.ADD_EMAIL)}
          className="btn btn-active btn-primary text-white "
        >
          {'Add Collborator'}
        </button>
      </div>
    </div>
  );
}

function WaveContainer({
  intervals,
  className,
}: {
  intervals: number[];
  className?: string;
}) {
  const AMPLIFY_BY = 100;
  return (
    <div
      className={cn('flex items-center flex-grow w-full space-x-1', className)}
    >
      {intervals.map((peak, index) => (
        <div
          key={index}
          style={{ height: peak * AMPLIFY_BY }}
          className="flex-grow min-h-1 min-w-[3px] w-full bg-slate-50 rounded-full"
        />
      ))}
    </div>
  );
}

function InitContainer() {
  return (
    <>
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
    </>
  );
}
