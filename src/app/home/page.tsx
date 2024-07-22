'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import { route, ROUTES } from '@/constants/routes';
import { cn, getDateDifference, getReadableDate, pluralize } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { HourglassIcon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const {
    summary: { data: summary, fetch, isLoading },
  } = useDataLayerContext();

  const router = useRouter();

  return (
    <Container onRefresh={fetch}>
      <div className="flex space-x-2 items-center mb-2">
        <HourglassIcon size={16} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Latest Feedback'}</h3>
        </article>
      </div>
      <div className="flex space-x-4 w-full mt-4">
        {summary?.latestFeedback.map((data) => {
          const {
            id,
            created_at,
            title,
            feedback: {
              creator: { image_url },
              text,
              created_at: feedback_created_at,
            },
          } = data;

          const { text: differenceText, unit } =
            getDateDifference(feedback_created_at);

          return (
            <div
              onClick={() => router.push(route(ROUTES.project, id))}
              key={data.id}
              className="relative flex flex-col overflow-visible cursor-pointer border border-white/10 rounded-lg p-3 w-60 hover:bg-neutral-950/50 hover:scale-[102%] transition duration-100 ease-in-out transform"
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
        })}
      </div>
    </Container>
  );
}
