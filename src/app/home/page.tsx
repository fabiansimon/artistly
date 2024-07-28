'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import EmptyContainer from '@/components/EmptyContainer';
import ShareableOptions from '@/components/ShareableOptions';
import HomeSkeleton from '@/components/Skeletons/HomeSkeleton';
import { route, ROUTES } from '@/constants/routes';
import ToastController from '@/controllers/ToastController';
import useWindowSize from '@/hooks/useWindowSize';
import {
  cn,
  copyToClipboard,
  getDateDifference,
  getReadableDate,
} from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Comment, Project, ShareableProject } from '@/types';
import { Copy01Icon, HourglassIcon, Share01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const {
    summary: { data: summary, fetch, isLoading },
  } = useDataLayerContext();

  const { isSmall } = useWindowSize();

  const router = useRouter();

  return (
    <Container
      onRefresh={fetch}
      isLoading={isLoading}
      skeleton={<HomeSkeleton />}
    >
      {/* Latest Feedback Continer */}
      <div className="flex space-x-2 -mb-2">
        {!isSmall && (
          <HourglassIcon
            size={16}
            className="mt-2 text-white"
          />
        )}
        <article className="prose">
          <h3 className="text-sm md:text-[18px] text-white">Latest feedback</h3>
          <p className="text-xs text-white/60 md:-mt-3 -mt-2">
            See the latest comments on your active projects.
          </p>
        </article>
      </div>
      <div className="flex space-x-4 mt-4 overflow-x-scroll py-4 -mx-4 px-4 no-scrollbar">
        {summary?.latestFeedback.length === 0 && (
          <EmptyContainer
            text="No feedback added yet."
            className="min-h-32 min-w-60 flex justify-center border border-white/10 rounded-lg"
          />
        )}
        {summary?.latestFeedback.map((data) => {
          return (
            <LastFeedbackCard
              key={data.id}
              onClick={() => router.push(route(ROUTES.project, data.id))}
              data={data}
            />
          );
        })}
      </div>
      {/*  */}

      {/* Shared Projects */}
      <div className="flex space-x-2 -mb-2 mt-4">
        {!isSmall && (
          <Share01Icon
            size={16}
            className="mt-2 text-white"
          />
        )}
        <article className="prose">
          <h3 className="text-sm md:text-[18px] text-white">Shared Projects</h3>
          <p className="text-xs text-white/60 md:-mt-3 -mt-2">
            If you wish to share another project just generate a link on the
            projects page.
          </p>
        </article>
      </div>
      <div className="flex flex-col pt-6">
        {summary?.sharedProjects.length === 0 && (
          <EmptyContainer
            text="No projects shared yet."
            className="min-h-20 flex justify-center border border-white/10 rounded-lg"
          />
        )}
        {summary?.sharedProjects.map((project, index) => (
          <>
            <ShareProjectTile
              key={project.id}
              onClick={() =>
                router.push(route(ROUTES.project, project.project_id))
              }
              project={project}
            />
            {index !== summary.sharedProjects.length - 1 && (
              <div className="divider my-0" />
            )}
          </>
        ))}
      </div>
    </Container>
  );
}

function LastFeedbackCard({
  data,
  onClick,
}: {
  data: Project & { feedback: Comment };
  onClick: () => void;
}) {
  const {
    created_at,
    title,
    feedback: {
      creator: { image_url },
      text,
      created_at: feedback_created_at,
    },
  } = data;
  const { text: differenceText, unit } = getDateDifference(feedback_created_at);

  return (
    <div
      onClick={onClick}
      key={data.id}
      className="relative flex flex-col min-w-60 overflow-visible cursor-pointer border border-white/10 rounded-lg p-3 w-60 hover:bg-neutral-950/50 hover:scale-[102%] transition duration-100 ease-in-out transform"
    >
      <div className="flex justify-between w-full">
        <article className="prose">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-white/60 -mt-4">
            {getReadableDate(created_at, true)}
          </p>
        </article>
        <div
          className={cn(
            'rounded-md px-2 py-1 absolute -top-2 -right-2',
            unit === 'day' ? 'bg-error/30' : 'bg-success/40'
          )}
        >
          <p
            className={cn(
              'text-[11px] text-primary',
              unit === 'day' ? 'text-error' : 'text-success'
            )}
          >
            {differenceText}
          </p>
        </div>
      </div>
      <p className="text-xs text-white/60 mt-4">Last comment</p>
      <div className="mt-2">
        <div className="flex space-x-2">
          <Avatar
            src={image_url}
            className="size-5"
          />
          <p className="text-xs text-white">{`"${text}"`}</p>
        </div>
      </div>
    </div>
  );
}

function ShareProjectTile({
  project,
  className,
  onClick,
}: {
  project: ShareableProject;
  className?: string;
  onClick?: () => void;
}) {
  const { title, url, created_at, opened } = project;

  const handleCopy = () => {
    if (!url) return;
    copyToClipboard(url);
    ToastController.showSuccessToast(
      'Successfully copied.',
      'Share the link with your friends so they can listen to your project.'
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer px-2 py-3 rounded-md justify-between hover:bg-neutral-800/60 transition-opacity duration-300',
        className
      )}
    >
      <div>
        <article className="prose -mt-5 items-center">
          <div className="flex space-x-2">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-white/60">
              {getReadableDate(created_at, true)}
            </p>
          </div>
        </article>
        <ShareableOptions
          className="-mt-2"
          streams={opened}
          project={project}
        />
      </div>

      <div className="flex flex-col">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="flex border-2 cursor-pointer ml-auto my-auto py-2 border-neutral-700/50 items-center justify-center rounded-md hover:bg-neutral-950/50 hover:scale-[102%] transition duration-100 ease-in-out transform"
        >
          <p className="text-xs text-white/60 font-medium mx-2">copy url</p>
          <Copy01Icon
            className="mr-2 text-white/60"
            size={15}
          />
        </div>
      </div>
    </div>
  );
}

function PromotionContainer() {
  return <div className="w-full h-44 bg-primary rounded-2xl"></div>;
}
