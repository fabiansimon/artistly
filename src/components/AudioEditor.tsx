import { cn } from '@/lib/utils';
import CommentsSection from './CommentsSection';
import RangeIndicator from './RangeIndicator';
import AudioInfo from './AudioInfo';
import AudioControls from './AudioControls';
import VersionControl from './VersionControl';
import WaveContainer from './WaveContainer';
import { Comment } from '@/types';

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
        'flex flex-col w-full items-center justify-center space-y-3 px-4 pb-2 border-neutral-800/70 relative',
        className
      )}
    >
      <WaveContainer amplifyBy={200} />
      <RangeIndicator className="w-full" />
      <CommentsSection comments={comments} />

      <div className="border-neutral-800/70 border-t w-full mt-2 pt-2">
        <AudioInfo />
        <AudioControls className="mx-auto w-full py-2 justify-center" />
      </div>
    </div>
  );
}
