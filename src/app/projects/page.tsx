'use client';

import { PlayButton } from '@/components/PlayButton';
import ToastController from '@/controllers/ToastController';
import { getUserProjects } from '@/lib/api';
import { Project } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ProjectMix {
  collabs: Project[];
  authored: Project[];
}

export default function ProjectsListPage() {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [{ collabs, authored }, setProjects] = useState<ProjectMix>({
    collabs: [],
    authored: [],
  });

  const router = useRouter();

  const handlePlay = (audioUrl: string) => {
    setAudioUrl((prev) => (prev ? '' : audioUrl));
  };

  useEffect(() => {
    (async () => {
      try {
        const { authorProjects, collabProjects } = await getUserProjects({
          pagination: { limit: 10, page: 1 },
        });
        setProjects({ authored: authorProjects, collabs: collabProjects });
      } catch (error) {
        ToastController.showErrorToast('Oh no.', error.message);
      }
    })();
  }, []);

  return (
    <div className="flex items-center flex-grow h-full w-full flex-col fixed py-10">
      <div className="flex flex-col items-center w-full space-x-6 px-10 mt-4 justify-center">
        <article className="prose">
          <h3 className="text-white">{'Collabs'}</h3>
        </article>
        {collabs.map(({ id, title, collaborators }) => (
          <div
            // onClick={() => router.push(`/project/${id}`)}
            key={id}
            className="carousel-item cursor-pointer"
          >
            <div className="card bg-neutral-700/40 w-96 shadow-xl items-center space-y-3 py-4">
              <article className="prose">
                <h4 className="text-white">{title}</h4>
              </article>
              <PlayButton
                src={audioUrl}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="mx-auto"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full space-x-6 px-10 mt-4 justify-center">
        <article className="prose">
          <h3 className="text-white">{'Collabs'}</h3>
        </article>
        {authored.map(({ id, title, collaborators }) => (
          <div
            // onClick={() => router.push(`/project/${id}`)}
            key={id}
            className="carousel-item cursor-pointer"
          >
            <div className="card bg-neutral-700/40 w-96 shadow-xl items-center space-y-3 py-4">
              <article className="prose">
                <h4 className="text-white">{title}</h4>
              </article>
              <PlayButton
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="mx-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard() {}
