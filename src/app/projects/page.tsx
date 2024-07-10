'use client';

import AuthContainer from '@/components/AuthContainer';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import { route, ROUTES } from '@/constants/routes';
import DialogController from '@/controllers/DialogController';
import { cn, getReadableDate, pluralize } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Project } from '@/types';
import { MusicNote01Icon, Rocket01Icon } from 'hugeicons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProjectsListPage() {
  const { data: session } = useSession();
  console.log(session);
  const {
    projects: { data, refetch, isLoading },
  } = useDataLayerContext();

  const router = useRouter();

  if (isLoading || !data)
    return (
      <LoadingView
        strings={[
          'Fetching authored projects',
          'Searching for authored projects',
        ]}
      />
    );

  const { collabs, authored } = data.content;
  return (
    <Container onRefresh={refetch}>
      <div className="flex space-x-2 items-center mb-2">
        <Rocket01Icon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Collabs'}</h3>
        </article>
      </div>
      <div className="">
        {collabs.length == 0 && (
          <p className="text-sm text-white/50">No projects found.</p>
        )}
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
        {authored.length == 0 && (
          <p className="text-sm text-white/50">No projects found.</p>
        )}
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
        <p className="text-xs text-white/50 mx-2">
          {pluralize(versions.length, 'version')}
        </p>
      </div>
    </div>
  );
}
