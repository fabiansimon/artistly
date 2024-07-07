import { cn } from '@/lib/utils';
import { Comment } from '@/types';
import WaveContainer from './WaveContainer';
import CommentsSection from './CommentsSection';
import RangeIndicator from './RangeIndicator';
import AudioInfo from './AudioInfo';
import AudioControls from './AudioControls';

export default function AudioEditor({
  className,
  comments,
}: {
  className?: string;
  comments: Comment[];
}) {
  return (
    <div
      className={cn(
        'flex flex-col w-full items-center justify-center space-y-3 px-4 py-2 bg-black/30 border-t border-neutral-800/70',
        className
      )}
    >
      <AudioInfo />
      <WaveContainer amplifyBy={200} />
      <RangeIndicator className="w-full" />
      <CommentsSection comments={comments} />
      <AudioControls className="mx-auto border-t border-neutral-800/70 w-full py-2 pt-4 justify-center" />
    </div>
  );
}
