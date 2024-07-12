import { cn } from '@/lib/utils';

export default function CollaboratorContainer({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('flex bg-neutral-950 rounded-xl p-3', className)}></div>
  );
}
