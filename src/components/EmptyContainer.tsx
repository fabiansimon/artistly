import { cn } from '@/lib/utils';
import { FastWindIcon } from 'hugeicons-react';

interface EmptyContainerProps {
  title?: string;
  description?: string;
  className?: string;
}
export default function EmptyContainer({
  title = "It's lonely here",
  description = 'Nothing to be found',
  className,
}: EmptyContainerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <article className="prose text-center space-y-0 items-center flex flex-col">
        <FastWindIcon
          size={26}
          className="mb-3 text-white"
        />
        <h4 className="text-white">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
      </article>
    </div>
  );
}
