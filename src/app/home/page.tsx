'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import ShareableOptions from '@/components/ShareableOptions';
import { route, ROUTES } from '@/constants/routes';
import { cn, getDateDifference, getReadableDate, pluralize } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Comment, InitSummary, Project, ShareableProject } from '@/types';
import { HourglassIcon, Share01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const {
    summary: { data: summary, fetch, isLoading },
  } = useDataLayerContext();

  const router = useRouter();

  return (
    <Container onRefresh={fetch}>
      {/* Latest Feedback Continer */}
      <div className="flex space-x-2 items-center -mb-2">
        <HourglassIcon size={16} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Latest feedback'}</h3>
        </article>
      </div>
      <div className="flex space-x-4 mt-4 overflow-x-scroll py-4 -mx-4 px-4 no-scrollbar">
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

      <PromotionContainer />

      {/* Shared Projects */}
      <div className="flex space-x-2 items-center -mb-2 mt-4">
        <Share01Icon size={16} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Shared projects'}</h3>
        </article>
      </div>
      <div className="flex flex-col pt-6">
        {summary?.sharedProjects.map((project, index) => (
          <>
            <ShareProjectTile
              key={project.id}
              project={project}
            />
            {index !== summary.sharedProjects.length - 1 && (
              <div className="divider my-1" />
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
            'rounded-full px-2 py-1 absolute -top-2 -right-2',
            unit === 'day' ? 'bg-error/40' : 'bg-success/40'
          )}
        >
          <p
            className={cn(
              'text-xs text-primary font-medium',
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
  const {
    title,
    versions,
    opened,
    only_recent_version,
    unlimited_visits,
    created_at,
  } = project;
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer p-2 rounded-md justify-between hover:bg-neutral-800/60 transition-opacity duration-300',
        className
      )}
    >
      <div className="">
        <article className="prose -mt-5 items-center">
          <div className="flex space-x-2">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-white/60">
              {getReadableDate(created_at, true)}
            </p>
          </div>
        </article>
        <ShareableOptions
          project={project}
          className="-mt-2"
        />
      </div>

      <div className="flex border-2 my-auto py-2 border-neutral-700/50 items-center justify-center rounded-md">
        <p className="text-xs text-white/60 mx-2">
          {pluralize(opened, 'stream')}
        </p>
      </div>
    </div>
  );
}

function PromotionContainer() {
  return <div className="w-full h-44 bg-primary rounded-2xl"></div>;
}
