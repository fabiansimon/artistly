'use client';

import BackButton from '@/components/BackButton';
import Container from '@/components/Container';
import { PlayButton } from '@/components/PlayButton';
import { route, ROUTES } from '@/constants/routes';
import ToastController from '@/controllers/ToastController';
import { getUserProjects } from '@/lib/api';
import { cn, getReadableDate } from '@/lib/utils';
import { Project } from '@/types';
import { MusicNote01Icon, Rocket01Icon } from 'hugeicons-react';
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
    <Container>
      <div className="flex space-x-2 items-center mb-2">
        <Rocket01Icon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Collabs'}</h3>
        </article>
      </div>
      <div className="">
        {collabs.map((collab) => (
          <ProjectTile
            onClick={() => router.push(route(ROUTES.project, collab.id))}
            key={collab.id}
            project={collab}
          />
        ))}
      </div>
      <div className="flex space-x-2 items-center mb-2 mt-4">
        <MusicNote01Icon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Authored'}</h3>
        </article>
      </div>
      <div className="">
        {authored.map((collab) => (
          <ProjectTile
            onClick={() => router.push(route(ROUTES.project, collab.id))}
            key={collab.id}
            project={collab}
          />
        ))}
      </div>
    </Container>
  );
}

function ProjectTile({
  project,
  className,
  onClick,
}: {
  project: Project;
  className?: string;
  onClick?: () => void;
}) {
  const { title, versions, created_at } = project;
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer p-2 rounded-md justify-between hover:bg-neutral-800/60 transition-opacity duration-300',
        className
      )}
    >
      <article className="prose">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/50 -mt-4">
          {getReadableDate(created_at, true)}
        </p>
      </article>
      <div className="flex border-2 border-neutral-700/50 items-center justify-center rounded-md">
        <p className="text-xs text-white/50 mx-2">{`${versions.length} Versions`}</p>
      </div>
    </div>
  );
}
