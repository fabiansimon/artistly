import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';

export default function VersionControl({ className }: { className?: string }) {
  const { project, version, handleVersionChange } = useAudioContext();
  if (!project || !version) return;

  const { versions } = project;

  const handleClick = (step: number) => {
    let index = version.index;
    if (step < 0) index = Math.max(0, index + step);
    else index = Math.min(versions.length - 1, index + step);
    handleVersionChange(versions[index].id);
  };

  return (
    <div className={cn('join bg-transparent', className)}>
      {version.index !== 0 && (
        <button
          onClick={() => handleClick(-1)}
          className="join-item btn bg-black/20"
        >
          «
        </button>
      )}
      <button className="join-item text-xs btn bg-black/20">
        <div className="flex flex-col space-y-1">
          <p className="text-xs text-white/70 font-medium">{version.title}</p>
          <p className="text-[10px] text-white/40 font">Version</p>
        </div>
      </button>
      {version.index !== versions.length - 1 && (
        <button
          onClick={() => handleClick(1)}
          className="join-item btn bg-black/20"
        >
          »
        </button>
      )}
    </div>
  );
}
