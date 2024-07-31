'use client';

import Container from '@/components/Container';
import EmptyContainer from '@/components/EmptyContainer';
import ProjectsSkeleton from '@/components/Skeletons/ProjectsSkeleton';
import { cn } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Invite, Project } from '@/types';
import { Unlink01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function InvitesPage() {
  const {
    invites: { data: invites, fetch, isLoading },
  } = useDataLayerContext();
  8;
  const router = useRouter();

  return (
    <Container
      isLoading={isLoading}
      className="relative"
      skeleton={<ProjectsSkeleton />}
      onRefresh={fetch}
    >
      <div className="flex space-x-2 items-center mb-2">
        <Unlink01Icon
          className="text-white"
          size={18}
        />
        <article className="prose">
          <h3 className="text-[18px] text-white">Invitations</h3>
        </article>
      </div>
      <div className="">
        {invites?.length == 0 && (
          <EmptyContainer
            text="No open invitations"
            className="items-start"
          />
        )}
        {invites?.map(({ invite, project }) => (
          <InviteTile
            onClick={() => console.log('12')}
            key={invite.id}
            project={project}
          />
        ))}
      </div>
    </Container>
  );
}

function InviteTile({
  project,
  className,
  onClick,
}: {
  project: Project;
  className?: string;
  onClick?: () => void;
}) {
  const { title, author, description } = project;
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
        <p className="text-xs text-white/60 -mt-4">{author.first_name}</p>
      </article>
      <div className="flex border-2 border-neutral-700/50 items-center justify-center rounded-md">
        <p className="text-xs text-white/60 mx-2">{description}</p>
      </div>
    </div>
  );
}
