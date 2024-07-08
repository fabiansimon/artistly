import { cn, formatSeconds } from '@/lib/utils';
import { Comment, MenuOption } from '@/types';
import { Delete01Icon } from 'hugeicons-react';
import DropDown from './Dropdown';
import { useMemo } from 'react';
import { useAudioContext } from '@/providers/AudioProvider';
import Avatar from './Avatar';

export default function CommentTile({ comment }: { comment: Comment }) {
  const { jumpTo, highlightedComment, removeFeedback } = useAudioContext();

  const { id, timestamp, text } = comment;

  const options: MenuOption[] = useMemo(
    () => [
      {
        icon: (
          <Delete01Icon
            size={14}
            className="text-white/70"
          />
        ),
        text: 'Remove',
        confirm: true,
        onClick: () => removeFeedback(id),
      },
    ],
    [removeFeedback, id]
  );

  return (
    <div
      onClick={() => timestamp && jumpTo(timestamp)}
      className={cn(
        'hover:bg-neutral-950 rounded-md cursor-pointer flex min-h-11 space-x-4 items-center px-3',
        highlightedComment === id && 'bg-neutral-950'
      )}
      key={id}
    >
      <div className="flex min-w-14 justify-center">
        <Avatar className="size-8" />
      </div>
      <div className="text-xs flex-grow">{text}</div>
      <div className={cn('text-xs text-center', !timestamp && 'opacity-20')}>
        {timestamp ? formatSeconds(timestamp) : 'n/A'}
      </div>
      <DropDown options={options} />
    </div>
  );
}
