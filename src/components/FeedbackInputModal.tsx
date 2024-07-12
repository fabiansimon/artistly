import { useEffect, useState } from 'react';
import DialogModal from './DialogModal';
import {
  cn,
  formatSeconds,
  formattedTimeToNumber,
  formatTimeInput,
} from '@/lib/utils';
import { REGEX } from '@/constants/regex';
import { useAudioContext } from '@/providers/AudioProvider';
import { useProjectContext } from '@/providers/ProjectProvider';

interface FeedbackInputModalProps {
  isVisible: boolean;
  onRequestClose?: () => void;
  timestamp?: number;
  className?: string;
}

export default function FeedbackInputModal({
  isVisible,
  onRequestClose,
  timestamp,
  className,
}: FeedbackInputModalProps) {
  const { file } = useAudioContext();
  const { addFeedback } = useProjectContext();

  const [error, setError] = useState<string>('');
  const [input, setInput] = useState<{ text: string; timestamp?: string }>({
    text: '',
  });

  useEffect(() => {
    if (!isVisible) {
      setInput({ text: '' });
      setError('');
    }
  }, [isVisible]);

  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      timestamp: timestamp ? formatSeconds(timestamp).toString() : undefined,
    }));
  }, [timestamp]);

  const handleInput = (type: 'timestamp' | 'comment', value: string) => {
    setInput((prev) => {
      if (type === 'timestamp') {
        const rawTime = formatTimeInput(value);
        const error = checkError(rawTime);

        setError(error);
        return { ...prev, timestamp: rawTime };
      }

      return { ...prev, text: value };
    });
  };

  const checkError = (value: string) => {
    if (value.length === 0) return '';
    if (!REGEX.timestamp.test(value))
      return 'Timestamp in input must be format mm:ss';

    const [minutes, seconds] = value.split(':').map(Number);
    const timestamp = minutes * 60 + seconds;
    if (timestamp > file?.duration!)
      return 'Timestamp is outside of song duration.';

    return '';
  };

  const postComment = () => {
    const { text, timestamp } = input;
    addFeedback({
      text,
      timestamp: timestamp ? formattedTimeToNumber(timestamp) : undefined,
    });
    if (onRequestClose) onRequestClose();
  };

  return (
    <DialogModal
      onRequestClose={onRequestClose}
      className={cn(className)}
      isVisible={isVisible}
    >
      <div className="space-y-4">
        <article className="prose">
          <h3 className="font-medium text-white text-sm">{'Add comment'}</h3>
          <p className="text-white/60 -mt-2 text-xs">
            {'Including a timestamp is optional'}
          </p>
        </article>
        <div className="flex w-full space-x-2">
          <input
            value={input.text}
            onInput={({ currentTarget: { value } }) =>
              handleInput('comment', value)
            }
            className="textarea textarea-bordered bg-transparent w-full max-h-44"
            placeholder="e.g I love the bass!"
          />
          <input
            value={input.timestamp || undefined}
            onInput={({ currentTarget: { value } }) =>
              handleInput('timestamp', value)
            }
            className={cn(
              'textarea textarea-bordered text-center bg-transparent w-20 max-h-44'
            )}
            placeholder="00:12"
            pattern="^[0-5][0-9]\:[0-5][0-9]\.[0-9]{1,3}$"
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn btn-outline text-white/60"
              onClick={onRequestClose}
            >
              {'Close'}
            </button>
            <button
              disabled={input.text.trim().length < 1}
              onClick={postComment}
              className="btn btn-primary ml-2"
            >
              {'Post'}
            </button>
          </form>
        </div>
        {error && (
          <article className="prose mt-2 -mb-2">
            <p
              className={cn(
                'text-red-500/90 text-sm opacity-0',
                error && 'opacity-1'
              )}
            >
              {error || '1'}
            </p>
          </article>
        )}
      </div>
    </DialogModal>
  );
}
