import { formatSeconds } from '@/lib/utils';
import { Comment } from '@/types';
import {
  Delete01Icon,
  More01Icon,
  MoreHorizontalIcon,
  MoreIcon,
} from 'hugeicons-react';

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
      <div className="dropdown dropdown-left">
        <div
          tabIndex={0}
          role="button"
        >
          <MoreHorizontalIcon />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[10] p-1 shadow"
        >
          <li>
            <div>
              <Delete01Icon size={16} />
              <p>{'Delete'}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
