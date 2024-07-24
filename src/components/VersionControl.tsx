import { cn } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { useProjectContext } from '@/providers/ProjectProvider';
import { ArrowLeft02Icon, ArrowRight02Icon } from 'hugeicons-react';

export default function VersionControl({ className }: { className?: string }) {
  const {
    project: { data: project },
  } = useDataLayerContext();
  const { version, handleVersionChange } = useProjectContext();
  if (!project || !version) return;

  const { versions } = project;

  const handleClick = (step: number) => {
    let index = version.index;
    if (step < 0) index = Math.max(0, index + step);
    else index = Math.min(versions.length - 1, index + step);
    handleVersionChange(versions[index].id);
  };

  const first = version.index === 0;
  const last = version.index === versions.length - 1;

  return (
    <div
      className={cn(
        'inline-flex justify-between space-x-2 min-w-24 items-center rounded-full px-3 py-2 border border-neutral-700/50 bg-neutral-950/50',
        className
      )}
    >
      <ArrowLeft02Icon
        onClick={() => !first && handleClick(-1)}
        className={cn(
          'text-white cursor-pointer',
          first && 'cursor-not-allowed opacity-50'
        )}
        size={16}
      />
      <p className="text-white font-medium text-xs">{version?.title}</p>
      <ArrowRight02Icon
        onClick={() => !last && handleClick(1)}
        className={cn(
          'text-white cursor-pointer',
          last && 'cursor-not-allowed opacity-50'
        )}
        size={16}
      />
    </div>
  );
}
