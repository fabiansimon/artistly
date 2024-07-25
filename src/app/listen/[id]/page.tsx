'use client';

import { PlayButton } from '@/components/PlayButton';
import ShareableOptions from '@/components/ShareableOptions';
import ToastController from '@/controllers/ToastController';
import { fetchShareable } from '@/lib/api';
import { cn, pluralize } from '@/lib/utils';
import { LeanVersion, ShareableProject } from '@/types';
import {
  Alert02Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  MusicNoteSquare01Icon,
  Playlist02Icon,
} from 'hugeicons-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function SharePage() {
  const { id } = useParams();
  const [track, setTrack] = useState<ShareableProject | null>();
  const [versionIndex, setVersionIndex] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchShareable(id as string);
        console.log(res);
        setTrack(res);
      } catch (error) {
        console.log(error);
        ToastController.showErrorToast();
      }
    })();
  }, [id]);

  if (!track) return;
  const { title, versions, only_recent_version } = track;

  return (
    <div className="flex w-full bg-neutral-900 min-h-screen space-x-2 fixed items-center justify-center">
      <div className="rounded-lg max-w-screen-md w-full bg-neutral-950 border border-white/10 p-4 flex flex-col space-y-4">
        <article className="prose -mb-2">
          <h3 className="text-white text-sm">{title}</h3>
          <p className="text-white/60 text-xs -mt-2">
            Respect the artist wishes and don't download/share this with anyone.
          </p>
        </article>
        <ShareableOptions project={track} />
        <PlayButton
          className="mx-auto"
          src={versions[versionIndex].file_url}
        />
        {!only_recent_version && (
          <VersionControl
            className="mx-auto"
            onClick={(index) => setVersionIndex(index)}
            versions={versions}
            index={versionIndex}
          />
        )}
      </div>
    </div>
  );
}

function VersionControl({
  versions,
  index,
  onClick,
  className,
}: {
  versions: LeanVersion[];
  index: number;
  onClick: (index: number) => void;
  className?: string;
}) {
  const version = versions[index];
  const first = index === 0;
  const last = index === versions.length - 1;

  return (
    <div
      className={cn(
        'inline-flex justify-between space-x-2 min-w-24 items-center rounded-full px-3 py-2 border border-neutral-700/50 bg-neutral-950/50',
        className
      )}
    >
      <ArrowLeft02Icon
        onClick={() => !first && onClick(index - 1)}
        className={cn(
          'text-white cursor-pointer',
          first && 'cursor-not-allowed opacity-50'
        )}
        size={16}
      />
      <p className="text-white font-medium text-xs">{version.title}</p>
      <ArrowRight02Icon
        onClick={() => !last && onClick(index + 1)}
        className={cn(
          'text-white cursor-pointer',
          last && 'cursor-not-allowed opacity-50'
        )}
        size={16}
      />
    </div>
  );
}
