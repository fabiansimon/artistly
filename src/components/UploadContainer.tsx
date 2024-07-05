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
import { Project } from '@/types';
import { stat } from 'fs';

const transition = {
  duration: 500,
  type: 'spring',
  mass: 0.05,
};

enum INPUT_STATE {
  fileInput,
  projectSelection,
  infoInput,
}

const DEBUG_PROJECTS: Project[] = [
  {
    created_at: new Date('2024-07-02T11:41:56.110086+00:00'),
    creator_id: 'd52d5b96-142c-4837-a462-1f8b9e2e9d55',
    id: '19cd08a9-78f3-49db-b2fc-02cb3acb2ecd',
    title: 'Sonntag',
    collaborators: [],
    versions: [
      {
        created_at: new Date('2024-07-02T11:41:56.249267+00:00'),
        file_url:
          'https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/dadbf213-b8c7-486b-a15d-e2d5b67d9803?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy9kYWRiZjIxMy1iOGM3LTQ4NmItYTE1ZC1lMmQ1YjY3ZDk4MDMiLCJpYXQiOjE3MjAwOTY3MzMsImV4cCI6MTcMTYzMjczM30.haKIHqr4-edYaoFWNYHZTYqa48Q6__Bm8Xo2pm5Abv4&t=2024-07-04T12%3A38%3A53.741Z',
        id: 'afe0fc37-a3f0-4e84-a4ec-6de5f220b9f0',
        notes:
          'Ein kleiner Party track. Haben wir schnell hingehaut, macht es Sinn das noch länger zu verfolgen?',
        feedback: [],
        title: 'Sonntag',
      },
    ],
  },
];

export default function UploadContainer() {
  const { file, setFile } = useAudioContext();
  const [dragging, setDragging] = useState<boolean>(false);
  const [rawFile, setRawFile] = useState<File | undefined>();
  const [state, setState] = useState<INPUT_STATE>(INPUT_STATE.fileInput);
  const [project, setProject] = useState<string | 'new' | undefined>();

  useEffect(() => {
    setState(() => {
      if (!rawFile || !file) return INPUT_STATE.fileInput;
      if (!project) return INPUT_STATE.projectSelection;
      return INPUT_STATE.infoInput;
    });
  }, [rawFile, file, project]);

  useEffect(() => {
    if (!rawFile) return;
    (async () => {
      const data = await analyzeAudio(rawFile);
      setFile(data);
    })();
  }, [rawFile, setFile]);

  const getStateComponent = useCallback(() => {
    if (state === INPUT_STATE.fileInput)
      return <FileInputContainer onFile={handleFileChange} />;

    if (state === INPUT_STATE.projectSelection)
      return (
        <SelectContainer
          onInput={(value) => setProject(value)}
          projects={DEBUG_PROJECTS}
        />
      );

    if (state === INPUT_STATE.infoInput)
      return <ShareContainer audioFile={file!} />;
  }, [state, file]);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      <div className="flex">
        {getStateComponent()}

        {/* {!rawFile || !file ? (
          <ShareContainer audioFile={file} />
        ) : (
          <FileInputContainer onFile={handlerawFileChange} />
        )} */}
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

function FileInputContainer({
  onFile,
}: {
  onFile: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center flex-col">
      <article className="prose text-center">
        <h3 className="text-white text-sm">{'Import your Masterpiece'}</h3>
        <p className="-mt-2 text-white/70 text-sm">
          {"We will handle it with care, don't worry"}
        </p>
      </article>
      <input
        type="file"
        onChange={onFile}
        className="file-input file-input-bordered scale-90  w-full max-w-xs mt-4 bg-neutral-900"
      />
    </div>
  );
}

function SelectContainer({
  projects,
  onInput,
}: {
  projects: Project[];
  onInput: (input: string) => void;
}) {
  return (
    <>
      <div
        onClick={() => onInput('new')}
        className="flex flex-grow items-center justify-center w-full hover:bg-neutral-950/50 rounded-lg p-2 -m-2 cursor-pointer"
      >
        <article className="prose text-center">
          <h3 className="text-white text-sm">{'Create a new project'}</h3>
          <p className="text-white/70 text-sm">
            {
              'Choose this option if this is your first draft/version that you want to share.'
            }
          </p>
        </article>
      </div>
      <div className="border-l border-neutral-800/80 mx-4 w-1 min-h-full flex" />
      <div className="flex flex-col mt-4 flex-grow items-center justify-center w-full">
        <article className="prose text-center">
          <h3 className="text-white text-sm">{'Add to exisiting project'}</h3>
          <p className="text-white/70 text-sm">
            {'Upload this version to an exisiting project.'}
          </p>
        </article>
        <select
          onChange={(e) => onInput(e.target.value)}
          className="select text-xs text-center select-sm select-bordered bg-transparent w-full mt-4"
        >
          <option
            disabled
            selected
          >
            Chose a project
          </option>
          {projects.map(({ id, title }) => (
            <option key={id}>{title}</option>
          ))}
        </select>
      </div>
    </>
  );
}
