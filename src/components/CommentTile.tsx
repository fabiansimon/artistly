import {
  formatSeconds,
  formattedTimeToNumber,
  timestampIndex,
} from '@/lib/utils';
import { Comment, MenuOption } from '@/types';
import { Delete01Icon } from 'hugeicons-react';
import DropDown from './Dropdown';
import { useCallback, useMemo } from 'react';

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

  const timestampSpan = useCallback(
    (timestamp: number) => {
      return (
        <p
          onClick={() => onTimestamp(timestamp)}
          className="text-sm cursor-pointer text-blue-400 font-normal -mt-3"
        >
          @{formatSeconds(timestamp)}
        </p>
      );
    },
    [onTimestamp]
  );

  const textParts = useMemo(() => {
    const output: { value: string | number; isTime: boolean }[] = [];

    const index = timestampIndex(text);
    if (index === -1) {
      timestamp != null && output.push({ value: timestamp, isTime: true });
      output.push({ value: ` ${text}`, isTime: false });
    } else {
      output.push({ value: text.substring(0, index), isTime: false });
      output.push({
        value: formattedTimeToNumber(text.substring(index + 1, index + 6)),
        isTime: true,
      });
      output.push({
        value: text.substring(index + 6, text.length),
        isTime: false,
      });
    }

    return output;
  }, [text, timestamp]);

  return (
    <div
      key={id}
      className="bg-neutral rounded-xl p-2 shadow-xl shadow-black/5 flex justify-between relative"
    >
      <article className="prose">
        <p className="text-xs text-white/30">fabian.simon98@gmail.com</p>
        <span
          className="flex"
          style={{ whiteSpace: 'pre' }}
        >
          {textParts.map(({ value, isTime }, index) => {
            if (isTime)
              return <div key={index}>{timestampSpan(value as number)}</div>;
            return (
              <h3
                key={index}
                className="text-sm text-white font-normal -mt-3"
              >
                {value}
              </h3>
            );
          })}
        </span>
      </article>
      <DropDown options={options} />
    </div>
  );
}
