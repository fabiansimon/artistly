import { REGEX } from '@/constants/regex';
import { cn, formatSeconds, withinRange } from '@/lib/utils';
import { Comment, Input } from '@/types';
import {
  Comment01Icon,
  Download04Icon,
  Navigation03Icon,
} from 'hugeicons-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyContainer from './EmptyContainer';
import { useAudioContext } from '@/providers/AudioProvider';
import CommentTile from './CommentTile';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeedbackSummaryPDF from './FeedbackSummaryPDF';
import Avatar from './Avatar';

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
  const { project, highlightedComment, jumpTo, removeFeedback, version } =
    useAudioContext();
  const [filter, setFilter] = useState<FilterState>(FilterState.ALL);

  const feedback = useMemo(() => {
    // if (filter === FilterState.GENERAL) return generalComments;
    // if (filter === FilterState.TIMESTAMPS) return timestampComments;
    return [...timestampComments, ...generalComments].sort((a, b) => {
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return a.timestamp - b.timestamp;
    });
  }, [timestampComments, generalComments]);

  return (
    <div className={cn('grow', className)}>
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center ml-2 space-x-2">
          <Comment01Icon size={14} />
          <h3 className="text-md text-white font-medium">{'Feedback'}</h3>
        </div>
        <PDFDownloadLink
          document={
            <FeedbackSummaryPDF
              title={project?.title!}
              comments={[...timestampComments, ...generalComments]}
            />
          }
          fileName={`Feedback ${project?.title}, version: ${version?.title}`}
        >
          <button className={cn('btn btn-xs btn-neutral min-h-8')}>
            <Download04Icon size={16} />
            Download Feedback
          </button>
        </PDFDownloadLink>
      </div>
      <div className="flex space-x-4 mt-4 mx-6">
        <p className="text-xs font-medium w-10 text-neutral-400/80">User</p>
        <p className="text-xs font-medium flex-grow text-neutral-400/80">
          Comment
        </p>
        <p className="text-xs text-end font-medium text-neutral-400/80 pr-4">
          Timestamp
        </p>
      </div>
      <div className="divider my-0" />
      <div className="max-h-96 pb-4 overflow-y-auto">
        {feedback.map((comment, index) => {
          return (
            <div key={comment.id}>
              <CommentTile comment={comment} />
              {index !== feedback.length - 1 && (
                <div className="divider my-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

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
        <PDFDownloadLink
          document={
            <FeedbackSummaryPDF
              title={project?.title!}
              comments={[...timestampComments, ...generalComments]}
            />
          }
          fileName={`Feedback ${project?.title}, version: ${version?.title}`}
        >
          <button className={cn('btn btn-neutral btn-sm')}>
            <Download04Icon size={16} />
            Download Feedback
          </button>
        </PDFDownloadLink>
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
              onDelete={removeFeedback}
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

  const handleAddFeedback = (input: Input) => {
    setInput({ text: '' });
    setErrorMessage('');
    addFeedback(input);
  };

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
          value={input.text}
          placeholder="Add comment"
          className={cn(
            'input bg-neutral text-sm w-full',
            errorMessage && 'input-error'
          )}
        />
        <button
          onClick={() => handleAddFeedback(input)}
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
