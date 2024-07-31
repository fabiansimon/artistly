'use client';

import Container from '@/components/Container';
import EmptyContainer from '@/components/EmptyContainer';
import ProjectsSkeleton from '@/components/Skeletons/ProjectsSkeleton';
import AlertController from '@/controllers/AlertController';
import { cn, concatName } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Project } from '@/types';
import { motion } from 'framer-motion';
import { Unlink01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InvitesPage() {
  const {
    invites: { data: invites, fetch, isLoading },
  } = useDataLayerContext();
  8;
  const router = useRouter();

  const handleInvite = (decision: boolean) => {
    if (!decision)
      return AlertController.show({
        callback: () => console.log('Hello'),
        buttonText: 'Delete',
      });
  };

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
        {invites?.map(({ invite, project }, index) => (
          <>
            {index !== 0 && <div className="divider -my-1" />}
            <InviteTile
              key={invite.id}
              project={project}
              onClick={(decision) => handleInvite(decision)}
            />
          </>
        ))}
      </div>
    </Container>
  );
}

function InviteTile({
  project,
  onClick,
  className,
}: {
  project: Project;
  onClick: (decision: boolean) => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState<boolean>(false);

  const { title, author, description } = project;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'flex w-full h-14 p-2 rounded-md justify-between',
        className
      )}
    >
      <article className="prose">
        <span className="flex space-x-2 -mt-4">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-white/60">{description}</p>
        </span>
        <p className="text-xs text-white/60 -mt-4">{`invited by ${concatName(
          author.first_name,
          author.last_name
        )}`}</p>
      </article>
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center  justify-center rounded-md space-x-2"
        >
          <button
            className="btn btn-error"
            onClick={() => onClick(false)}
          >
            <p className="prose text-xs font-medium text-white">Decline</p>
          </button>
          <button
            onClick={() => onClick(true)}
            className="btn btn-success"
          >
            <p className="prose text-xs font-medium text-white">Accept</p>
          </button>
        </motion.div>
      )}
    </div>
  );
}
