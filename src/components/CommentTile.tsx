import { formatSeconds } from '@/lib/utils';
import { Comment, MenuOption } from '@/types';
import { Delete01Icon } from 'hugeicons-react';
import DropDown from './Dropdown';
import { useMemo } from 'react';

export default function CommentTile({
  comment,
  onTimestamp,
  onDelete,
}: {
  comment: Comment;
  onTimestamp: (timestamp: number) => void;
  onDelete: (id: string) => void;
}) {
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
        onClick: () => onDelete(id),
      },
    ],
    [onDelete, id]
  );

  const includesTimestamp = useMemo(() => {}, [text, timestamp]);

  return (
    <div
      key={id}
      className="bg-neutral rounded-xl p-2 shadow-xl shadow-black/5 flex justify-between relative"
    >
      <article className="prose">
        <p className="text-xs text-white/30">fabian.simon98@gmail.com</p>
        <span className="flex">
          {timestamp != null && (
            <p
              onClick={() => onTimestamp(timestamp)}
              className="text-sm cursor-pointer text-blue-400 font-normal -mt-3 mr-1"
            >
              @{formatSeconds(timestamp)}
            </p>
          )}
          <h3 className="text-sm text-white font-normal -mt-3">{text}</h3>
        </span>
      </article>
      <DropDown options={options} />
    </div>
  );
}
