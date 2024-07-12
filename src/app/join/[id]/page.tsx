'use client';

import { PlayButton } from '@/components/PlayButton';
import { route, ROUTES } from '@/constants/routes';
import DialogController from '@/controllers/DialogController';
import ToastController from '@/controllers/ToastController';
import { fetchInvitation, joinCollabProject } from '@/lib/api';
import { getReadableDate } from '@/lib/utils';
import { Project } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JoinPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  const handleChoice = (decision: boolean) => {
    if (decision) return handleJoin();
    DialogController.closeDialog();
    router.back();
  };

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const _id = id as string;
      await joinCollabProject({ id: _id });
      router.push(route(ROUTES.project, _id));
    } catch (error) {
      ToastController.showErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const project = await fetchInvitation(id as string);
      console.log(project);
      DialogController.showCustomDialog(
        <InvitationCard
          isLoading={isLoading}
          project={project}
          onInput={handleChoice}
        />
      );
    })();
  }, [id]);

  return (
    <div className="flex flex-grow w-full h-full items-center justify-center" />
  );
}

function InvitationCard({
  project,
  onInput,
  isLoading,
}: {
  project: Project;
  onInput: (decision: boolean) => void;
  isLoading: boolean;
}) {
  const { title, created_at } = project;
  return (
    <div className="flex flex-col">
      <article className="prose w-full">
        <p className="text-white text-md -mb-2">
          {"You've been invited to join the project"}
        </p>
        <div className="flex w-full flex-grow justify-between">
          <span className="flex space-x-1">
            <p className="text-white text-sm">{title}</p>
            <p className="text-white/60 text-sm">{'by'}</p>
            <p className="text-white text-sm">{project.author.first_name}</p>
          </span>
          <p className="text-white/80 text-sm">
            {getReadableDate(created_at, true)}
          </p>
        </div>
      </article>

      <div className="flex justify-between items-end">
        <PlayButton src="https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/db5e8ab2-357c-4835-9667-e9e8ae5528e9?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy9kYjVlOGFiMi0zNTdjLTQ4MzUtOTY2Ny1lOWU4YWU1NTI4ZTkiLCJpYXQiOjE3MTk5MjQzNTksImV4cCI6MTc1MTQ2MDM1OX0.Qd_o6nN-n1rE0b6glpN9Zh3hR7rh2UU-wt5rl4tsYXQ&t=2024-07-02T12%3A45%3A59.381Z" />
        <form method="dialog">
          <button
            onClick={() => onInput(false)}
            className="btn btn-outline text-white/60"
          >
            {'Decline'}
          </button>
          <button
            onClick={() => onInput(true)}
            className="btn btn-primary ml-2"
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Accept'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
