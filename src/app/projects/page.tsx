'use client';

import { PlayButton } from '@/components/AudioPlayer';
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log(audioRef);
    if (!audioRef.current) return;
    if (!audioUrl) {
      audioRef.current?.pause();
      return;
    }

    audioRef.current.play();
  }, [audioUrl]);

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
      <audio
        loop={true}
        ref={audioRef}
        src={audioUrl}
      >
        Your browser does not support the audio element.
      </audio>
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
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlay(
                    'https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/dadbf213-b8c7-486b-a15d-e2d5b67d9803?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy9kYWRiZjIxMy1iOGM3LTQ4NmItYTE1ZC1lMmQ1YjY3ZDk4MDMiLCJpYXQiOjE3MTk5MjQwNDQsImV4cCI6MTc1MTQ2MDA0NH0.8d-y6k_CY0dsi7l5FDueq7v3LCRgT6XjMxeFrRTC20s&t=2024-07-02T12%3A40%3A44.294Z'
                  );
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
                  handlePlay(
                    'https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/db5e8ab2-357c-4835-9667-e9e8ae5528e9?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy9kYjVlOGFiMi0zNTdjLTQ4MzUtOTY2Ny1lOWU4YWU1NTI4ZTkiLCJpYXQiOjE3MTk5MjQzNTksImV4cCI6MTc1MTQ2MDM1OX0.Qd_o6nN-n1rE0b6glpN9Zh3hR7rh2UU-wt5rl4tsYXQ&t=2024-07-02T12%3A45%3A59.381Z'
                  );
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
