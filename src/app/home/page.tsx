'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import { route, ROUTES } from '@/constants/routes';
import { cn, getDateDifference, getReadableDate, pluralize } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { Comment, InitSummary, Project } from '@/types';
import { HourglassIcon } from 'hugeicons-react';
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
          <h3 className="text-[18px] text-white">{'Latest Feedback'}</h3>
        </article>
      </div>
      <div className="flex space-x-4 w-full mt-4 overflow-x-auto py-4 px-2 no-scrollbar">
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
          <p className="text-xs text-white/50 -mt-4">
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

function PromotionContainer() {
  return <div className="w-full h-44 bg-primary rounded-2xl"></div>;
}
