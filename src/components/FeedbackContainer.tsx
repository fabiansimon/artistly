import { REGEX } from '@/constants/regex';
import { cn, formatSeconds, withinRange } from '@/lib/utils';
import { Comment, Input } from '@/types';
import {
  Add01Icon,
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
import SimpleButton from './SimpleButton';

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
  const { project, toggleCommentInput, version } = useAudioContext();

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

  const empty = feedback.length < 0;

  return (
    <div className={cn('flex flex-col grow h-full justify-between', className)}>
      <div>
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
        <div className="flex flex-col overflow-y-hidden">
          {empty && (
            <EmptyContainer
              title="No comments yet"
              description="Be the first one to add one"
              className="mt-[30%] "
            />
          )}

          {!empty &&
            [...feedback].map((comment, index) => {
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

        {/* <div className="bg-red-500 flex-grow pb-4 overflow-y-auto">
          {empty && (
            <EmptyContainer
              title="No comments yet"
              description="Be the first one to add one"
              className="mt-4 "
            />
          )}
          {!empty &&
            [...feedback, ...feedback, ...feedback].map((comment, index) => {
              return (
                <div key={comment.id}>
                  <CommentTile comment={comment} />
                  {index !== feedback.length - 1 && (
                    <div className="divider my-0" />
                  )}
                </div>
              );
            })}
        </div> */}
      </div>
      <button
        onClick={() => toggleCommentInput()}
        className="btn btn-primary mx-auto text-white"
      >
        <Add01Icon size={15} />
        Add Comment
      </button>
    </div>
  );
}
