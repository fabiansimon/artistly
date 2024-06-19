'use client';

import { act, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { AudioFile, Project, Version } from '@/types';
import ToastController from '@/controllers/ToastController';
import { fetchProject } from '@/lib/api';
import { LocalStorage } from '@/lib/localStorage';
import AudioEditor from '@/components/AudioEditor';
import { cn } from '@/lib/utils';
import FeedbackContainer from '@/components/FeedbackContainer';

function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [currVersionId, setCurrVersionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<AudioFile | undefined>();

  const version = useMemo(() => {
    if (!project) return;
    const { versions } = project;
    return versions.find((v) => v.id === currVersionId) || versions[0];
  }, [currVersionId, project]);

  const { timestampComments, generalComments } = useMemo(() => {
    if (!version) return { timestampComments: [], generalComments: [] };
    const { feedback } = version;
    return {
      timestampComments: feedback.filter((f) => f.timestamp),
      generalComments: feedback.filter((f) => !f.timestamp),
    };
  }, [version]);

  useEffect(() => {
    if (audioFile) return;
    const cachedAudio = LocalStorage.fetchAudioFile();
    console.log('cachedAudio', audioFile);
    setAudioFile(cachedAudio);
  }, []);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchProject(id as string);
        setProject(res);
        setCurrVersionId(res.versions[0].id);
      } catch (error: any) {
        console.error(error.message);
        ToastController.showErrorToast('Something went wrong', error.message);
      }
    })();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Loadingss...</div>;
  }

  const { title, versions } = project;

  return (
    <div className="flex items-center flex-grow h-full w-full flex-col fixed py-10">
      <article className="prose text-center text-white/50">
        <h3 className="text-white">{title}</h3>
        <p className="-mt-4">Version {version?.title}</p>
      </article>
      <div className="flex w-full space-x-6 px-10 mt-4 justify-center">
        <VersionControl
          versions={versions}
          currVersionId={currVersionId}
          onClick={setCurrVersionId}
        />
        {audioFile && (
          <AudioEditor
            audioFile={audioFile}
            comments={timestampComments}
          />
        )}
      </div>
      {audioFile && (
        <FeedbackContainer
          onAddFeedback={(text, seconds) => console.log(text, seconds)}
          duration={audioFile.duration}
          generalComments={generalComments}
          timestampComments={timestampComments}
        />
      )}
    </div>
  );
}

function VersionControl({
  versions,
  onClick,
  currVersionId,
}: {
  versions: Version[];
  currVersionId: string;
  onClick: (id: string) => void;
}) {
  return (
    <div className="relative mt-4">
      <article className="prose absolute -top-8">
        <p className="font-medium text-sm text-white/70">{'Versions'}</p>
      </article>

      <div className="flex border rounded-md border-neutral-800 max-w-20 overflow-hidden flex-col overflow-y-scroll scrollbar-hide max-h-20">
        {versions.map((v, i) => {
          const { title, id } = v;
          const isLast = i === versions.length - 1;
          const active = currVersionId === id;
          return (
            <div
              onClick={() => onClick(id)}
              className={cn(
                'bg-white/40 cursor-pointer min-h-8 flex items-center justify-center px-4',
                active && 'bg-white',
                !isLast && 'border-b border-neutral/40'
              )}
              key={id}
            >
              <p
                className={cn(
                  'prose-sm text-black/40 truncate font-bold',
                  active && 'text-black'
                )}
              >
                {title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectPage;
