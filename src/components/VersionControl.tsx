import { cn } from '@/lib/utils';
import { useAudioContext } from '@/providers/AudioProvider';

export default function VersionControl() {
  const { project, version, handleVersionChange } = useAudioContext();
  if (!project || !version) return;

  const { versions } = project;

  return (
    <div className="relative mt-4">
      <article className="prose absolute -top-8">
        <p className="font-medium text-sm text-white/70">{'Versions'}</p>
      </article>

      <div className="flex border rounded-md border-neutral-800 max-w-16 overflow-hidden flex-col overflow-y-scroll scrollbar-hide max-h-20">
        {versions.map((v, i) => {
          const { title, id } = v;
          const isLast = i === versions.length - 1;
          const active = version.id === id;
          return (
            <div
              key={id}
              onClick={() => handleVersionChange(id)}
              className={cn(
                'bg-white/40 cursor-pointer min-h-8 flex items-center justify-center px-4',
                active && 'bg-white',
                !isLast && 'border-b border-neutral/40'
              )}
            >
              <p
                className={cn(
                  'text-sm text-black/40 truncate font-medium',
                  active && 'text-black'
                )}
              >
                {title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
