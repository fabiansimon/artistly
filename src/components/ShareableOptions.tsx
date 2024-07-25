import { cn, pluralize } from '@/lib/utils';
import { ShareableProject } from '@/types';
import {
  Alert02Icon,
  MusicNoteSquare01Icon,
  Playlist02Icon,
} from 'hugeicons-react';
import { useMemo } from 'react';

export default function ShareableOptions({
  project,
  className,
}: {
  project: ShareableProject;
  className?: string;
}) {
  const options = useMemo(() => {
    if (!project) return [];
    const { only_recent_version, unlimited_visits, versions } = project;
    return [
      {
        icon: (
          <Alert02Icon
            size={12}
            className="text-error"
          />
        ),
        text: 'One time listen',
        bg: 'bg-error/30',
        textColor: 'text-error',
        visible: !unlimited_visits,
        helpText: 'lorem epsum',
      },
      {
        icon: (
          <Alert02Icon
            size={12}
            className="text-success"
          />
        ),
        bg: 'bg-success/30',
        text: 'Unlimited listens',
        textColor: 'text-success',
        visible: unlimited_visits,
        helpText: 'lorem epsum',
      },
      {
        icon: (
          <MusicNoteSquare01Icon
            size={14}
            className="text-primary"
          />
        ),
        bg: 'bg-primary/30',
        text: 'Most recent version',
        textColor: 'text-primary',
        visible: only_recent_version,
        helpText: 'lorem epsum',
      },
      {
        icon: (
          <Playlist02Icon
            size={14}
            className="text-primary"
          />
        ),
        bg: 'bg-primary/30',
        textColor: 'text-primary',
        text: pluralize(versions?.length, 'version'),
        visible: versions && !only_recent_version,
        helpText: 'lorem epsum',
      },
    ];
  }, [project]);

  return (
    <div className={cn('flex space-x-1', className)}>
      {options.map(
        ({ text, icon, visible, bg, textColor, helpText }, index) => {
          if (!visible) return;
          return (
            <div
              data-tip={helpText}
              className={cn(
                'tooltip tooltip-top cursor-pointer flex px-2 h-7 rounded-lg space-x-1 items-center',
                bg
              )}
              key={index}
            >
              {icon}
              <p className={cn('prose text-[11px]', textColor)}>{text}</p>
            </div>
          );
        }
      )}
    </div>
  );
}
