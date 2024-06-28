import { REGEX } from '@/constants/regex';
import { cn, formatSeconds } from '@/lib/utils';
import { Comment, Input } from '@/types';
import { Download04Icon, Navigation03Icon } from 'hugeicons-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyContainer from './EmptyContainer';
import { useAudioContext } from '@/providers/AudioProvider';
import CommentTile from './CommentTile';

enum FilterState {
  GENERAL,
  TIMESTAMPS,
  ALL,
}

interface FeedbackContainerProps {
  timestampComments: Comment[];
  generalComments: Comment[];
  className?: string;
}
export default function FeedbackContainer({
  timestampComments,
  generalComments,
  className,
}: FeedbackContainerProps) {
  const { jumpTo } = useAudioContext();
  const [filter, setFilter] = useState<FilterState>(FilterState.ALL);

  const feedback = useMemo(() => {
    if (filter === FilterState.GENERAL) return generalComments;
    if (filter === FilterState.TIMESTAMPS) return timestampComments;
    return [...timestampComments, ...generalComments];
  }, [filter, timestampComments, generalComments]);

  return (
    <div
      className={cn(
        'mt-auto flex flex-col max-h-[60%] h-full w-full max-w-screen-md bg-black/10 py-4 px-6 rounded-lg',
        className
      )}
    >
      <div className="flex justify-between items-center">
        <article className="prose">
          <h4 className="text-white">Feedback</h4>
        </article>
        <button className={cn('btn btn-neutral btn-sm')}>
          <Download04Icon size={16} />
          Download Feedback
        </button>
      </div>
      <div
        role="tablist"
        className="tabs tabs-boxed border border-neutral mt-4 max-w-sm mr-auto"
      >
        <a
          onClick={() => setFilter(FilterState.ALL)}
          role="tab"
          className={cn('tab', filter === FilterState.ALL && 'tab-active')}
        >
          All
        </a>
        <a
          onClick={() => setFilter(FilterState.GENERAL)}
          role="tab"
          className={cn('tab', filter === FilterState.GENERAL && 'tab-active')}
        >
          General
        </a>
        <a
          onClick={() => setFilter(FilterState.TIMESTAMPS)}
          role="tab"
          className={cn(
            'tab',
            filter === FilterState.TIMESTAMPS && 'tab-active'
          )}
        >
          Timestamps
        </a>
      </div>
      {feedback.length > 0 ? (
        <div className="space-y-2 mt-4 flex-grow h-full overflow-auto ">
          {feedback.map((comment) => (
            <CommentTile
              key={comment.id}
              comment={comment}
              onDelete={(id) => console.log(id)}
              onTimestamp={jumpTo}
            />
          ))}
        </div>
      ) : (
        <EmptyContainer
          title="No comments yet"
          description="Be the first one to add one"
          className="flex-grow "
        />
      )}
      <InputField />
    </div>
  );
}

function InputField() {
  const { addFeedback, file } = useAudioContext();

  const [input, setInput] = useState<Input>({ text: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const timestampIndex = input.text.indexOf('@');
    if (timestampIndex !== -1) {
      const rawTime = input.text.substring(
        timestampIndex + 1,
        timestampIndex + 6
      );
      if (!REGEX.timestamp.test(rawTime))
        return setErrorMessage('Timestamp in input must be format mm:ss');

      const [minutes, seconds] = rawTime.split(':').map(Number);
      const timestamp = minutes * 60 + seconds;
      if (timestamp > file?.duration!)
        return setErrorMessage('Timestamp is outside of song duration.');
      else setInput((prev) => ({ ...prev, timestamp }));
    }

    if (errorMessage) setErrorMessage('');
  }, [input.text, file, errorMessage]);
  return (
    <>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          onInput={({ currentTarget: { value } }) =>
            setInput((prev) => ({ ...prev, text: value }))
          }
          placeholder="Add comment"
          className={cn(
            'input bg-neutral text-sm w-full',
            errorMessage && 'input-error'
          )}
        />
        <button
          onClick={() => addFeedback(input)}
          disabled={!!(errorMessage || input.text.trim().length === 0)}
          className="btn btn-primary"
        >
          <Navigation03Icon size={14} />
          Add Comment
        </button>
      </div>

      <article className="prose mt-2 -mb-2">
        <p
          className={cn(
            'text-red-500/90 text-sm opacity-0',
            errorMessage && 'opacity-1'
          )}
        >
          {errorMessage || '1'}
        </p>
      </article>
    </>
  );
}
