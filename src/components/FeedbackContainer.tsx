import { cn } from '@/lib/utils';
import { Comment } from '@/types';
import { Add01Icon, Comment01Icon } from 'hugeicons-react';
import { useMemo } from 'react';
import EmptyContainer from './EmptyContainer';
import CommentTile from './CommentTile';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeedbackSummaryPDF from './FeedbackSummaryPDF';
import { useProjectContext } from '@/providers/ProjectProvider';
import SimpleButton from './SimpleButton';

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
  const { project, users } = useProjectContext();
  const { toggleCommentInput, version } = useProjectContext();

  const feedback = useMemo(() => {
    return [...timestampComments, ...generalComments].sort((a, b) => {
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return a.timestamp - b.timestamp;
    });
  }, [timestampComments, generalComments]);

  const empty = !(feedback.length > 0);

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
                comments={feedback}
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
              className="mt-[10%] "
            />
          )}

          {!empty &&
            feedback.map((comment, index) => {
              return (
                <div key={comment.id}>
                  <CommentTile
                    comment={{
                      ...comment,
                      creator: users[comment.creator_id],
                    }}
                  />
                  {index !== feedback.length - 1 && (
                    <div className="divider my-0" />
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <SimpleButton
        icon={<Add01Icon size={15} />}
        text="Add comment"
        textClassName="text-white font-medium"
        className="mx-auto mb-2 bg-primary hover:bg-primary/80"
        onClick={() => toggleCommentInput()}
      />
    </div>
  );
}
