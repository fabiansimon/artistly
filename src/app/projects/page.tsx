'use client';

import Container from '@/components/Container';
import EmptyContainer from '@/components/EmptyContainer';
import FloatingBar from '@/components/FloatingBar';
import ProjectsSkeleton from '@/components/Skeletons/ProjectsSkeleton';
import { route, ROUTES } from '@/constants/routes';
import useWindowSize from '@/hooks/useWindowSize';
import { cn, getReadableDate, pluralize } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Project } from '@/types';
import { MusicNote01Icon, Rocket01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function ProjectsListPage() {
  const {
    projects: { data, fetch, isLoading },
  } = useDataLayerContext();

  const { isSmall } = useWindowSize();
  const router = useRouter();

  const { collabs, authored } = data.content;
  return (
    <Container
      isLoading={isLoading}
      className="relative"
      skeleton={<ProjectsSkeleton />}
      onRefresh={fetch}
    >
      {isSmall && <FloatingBar />}

      <div className="flex space-x-2 items-center mb-2">
        <Rocket01Icon
          className="text-white"
          size={18}
        />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Collabs'}</h3>
        </article>
      </div>
      <div className="">
        {collabs.length == 0 && (
          <EmptyContainer
            text="No collaborations"
            className="items-start"
          />
        )}
        {collabs.map((collab) => (
          <ProjectTile
            onClick={() => router.push(route(ROUTES.project, collab.id))}
            key={collab.id}
            project={collab}
          />
        ))}
      </div>
      <div className="divider my-2" />
      <div className="flex space-x-2 items-center mb-2">
        <MusicNote01Icon
          className="text-white"
          size={18}
        />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Authored'}</h3>
        </article>
      </div>
      <div>
        {authored.length == 0 && (
          <EmptyContainer
            text="No authored projects"
            className="items-start"
          />
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
        <p className="text-xs text-white/60 -mt-4">
          {getReadableDate(created_at, true)}
        </p>
      </article>
      <div className="flex border-2 border-neutral-700/50 items-center justify-center rounded-md">
        <p className="text-xs text-white/60 mx-2">
          {pluralize(versions.length, 'version')}
        </p>
      </div>
    </div>
  );
}
