import { cn, formatSeconds, ordinalString } from '@/lib/utils';
import {
  ArrowReloadHorizontalIcon,
  Comment01Icon,
  Layers01Icon,
  Time04Icon,
} from 'hugeicons-react';
import { useMemo } from 'react';

interface VersionInformation {
  commentsNumber: number;
  versionNumber: number;
  duration: number;
  looping: boolean;
}

export default function AudioInfoBox({
  className,
  information,
}: {
  information: VersionInformation;
  className?: string;
}) {
  const info = useMemo(() => {
    const { commentsNumber, duration, looping, versionNumber } = information;
    return [
      {
        icon: (
          <Comment01Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: `${commentsNumber} comments`,
      },
      {
        icon: (
          <Layers01Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: `${ordinalString(versionNumber)} version`,
      },
      {
        icon: (
          <Time04Icon
            size={12}
            className="text-white/60"
          />
        ),
        title: formatSeconds(duration),
      },
      {
        icon: (
          <ArrowReloadHorizontalIcon
            size={12}
            className="text-white/60"
          />
        ),
        title: 'looping',
        disabled: !looping,
      },
    ];
  }, [information]);

  return (
    <div
      className={cn(
        'flex-grow bg-black/20 w-full flex justify-between items-center px-4 py-2 rounded-md',
        className
      )}
    >
      {info.map(({ icon, title, disabled }, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center justify-center space-x-1',
            disabled && 'opacity-10'
          )}
        >
          {icon}
          <article className="prose text-white/60">
            <p className="text-xs">{title}</p>
          </article>
        </div>
      ))}
    </div>
  );
}
