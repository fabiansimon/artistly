'use client';

import { PlayButton } from '@/components/PlayButton';
import ShareableOptions from '@/components/ShareableOptions';
import ToastController from '@/controllers/ToastController';
import { fetchShareable } from '@/lib/api';
import { cn } from '@/lib/utils';
import { LeanVersion, ShareableProject } from '@/types';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  AttachmentSquareIcon,
} from 'hugeicons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

enum Error {
  GONE,
}

export default function SharePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [track, setTrack] = useState<ShareableProject | null>();
  const [error, setError] = useState<Error | null>();
  const [versionIndex, setVersionIndex] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchShareable(id as string);
        console.log(res);
        setTrack(res);
      } catch (error) {
        if (error.response.status === 410) {
          setError(Error.GONE);
          return;
        }
        ToastController.showErrorToast();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="flex w-full bg-neutral-900 min-h-screen space-x-2 fixed items-center justify-center">
      {!isLoading && error === Error.GONE && (
        <div className="max-w-screen-sm w-full py-5 border border-white/10 rounded-md p-4">
          <article className="prose -mb-2 -mt-6">
            <div className="flex space-x-2 items-center">
              <AttachmentSquareIcon
                size={20}
                className="text-white"
              />
              <h3 className="text-white text-sm mb-5">Link expired</h3>
            </div>
            <p className="text-white/60 text-xs -mt-1">
              The link you have received was already used and/or is now expired.
              Ask the creator you send you an new one.
            </p>
          </article>
        </div>
      )}
      {!isLoading && !error && track && (
        <div className="rounded-lg max-w-screen-md w-full bg-neutral-950 border border-white/10 p-4 flex flex-col space-y-4">
          <article className="prose -mb-2">
            <h3 className="text-white text-sm">{track.title}</h3>
            <p className="text-white/60 text-xs -mt-2">
              Respect the artist wishes and don't download/share this with
              anyone.
            </p>
          </article>
          <ShareableOptions project={track} />
          <PlayButton
            className="mx-auto"
            src={track.versions[versionIndex].file_url}
          />
          {!track.only_recent_version && (
            <VersionControl
              className="mx-auto"
              onClick={(index) => setVersionIndex(index)}
              versions={track.versions}
              index={versionIndex}
            />
          )}
        </div>
      )}
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
