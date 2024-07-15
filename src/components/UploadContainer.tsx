'use client';

import ToastController from '@/controllers/ToastController';
import { motion } from 'framer-motion';
import { DragEvent, useCallback, useState, ChangeEvent } from 'react';
import { useAudioContext } from '@/providers/AudioProvider';
import { analyzeAudio } from '@/lib/audioHelpers';
import { cn } from '@/lib/utils';
import { LeanProject } from '@/types';
import VersionInput from './VersionInput';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import ProjectSelection from './ProjectSelection';
import FileInput from './FileInput';
import ProjectInput from './ProjectInput';

const transition = {
  duration: 500,
  type: 'spring',
  mass: 0.05,
};

enum INPUT_STATE {
  fileInput,
  projectSelection,
  projectInput,
  versionInput,
}

export default function UploadContainer({ projectId }: { projectId?: string }) {
  const { file, setFile } = useAudioContext();
  const {
    projects: {
      data: {
        content: { authored },
      },
    },
  } = useDataLayerContext();

  const [state, setState] = useState<INPUT_STATE>(INPUT_STATE.fileInput);
  const [dragging, setDragging] = useState<boolean>(false);
  const [project, setProject] = useState<LeanProject>();

  const getStateComponent = useCallback(() => {
    switch (state) {
      case INPUT_STATE.fileInput:
        return <FileInput onFile={handleFileChange} />;
      case INPUT_STATE.projectSelection:
        return (
          <ProjectSelection
            onInput={handleSelection}
            projects={authored}
          />
        );
      case INPUT_STATE.projectInput:
        return (
          <ProjectInput
            onSuccess={(data: LeanProject) => {
              setProject(data);
              setState(INPUT_STATE.versionInput);
            }}
          />
        );
      case INPUT_STATE.versionInput:
        return (
          <VersionInput
            project={project!}
            audioFile={file!}
          />
        );

      default:
        return null;
    }
  }, [state, file, project, authored]);

  const updateProject = (id: string) => {
    const _project = authored.find((p) => p.id === id);
    if (!_project) return;
    setProject({ id, title: _project.title, versions: _project.versions });
    setState(INPUT_STATE.versionInput);
  };

  const handleSelection = (id?: string) => {
    if (!id) {
      setState(INPUT_STATE.projectInput);
      return;
    }

    updateProject(id);
  };

  const handleDragging = useCallback(
    (e: DragEvent<HTMLDivElement>, status: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(status);
    },
    []
  );

  const addFile = async (rawFile: File) => {
    if (!rawFile?.type.includes('audio')) {
      ToastController.showErrorToast(
        'Wrong format.',
        'This service is only made for audio files.'
      );
      return;
    }

    const file = await analyzeAudio(rawFile);
    setFile(file);

    // If dialog is called from project page with default projectId
    if (projectId) {
      updateProject(projectId);
      return;
    }

    setState(INPUT_STATE.projectSelection);
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
      <div className="flex flex-grow w-full">{getStateComponent()}</div>
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
