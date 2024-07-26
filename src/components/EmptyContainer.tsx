import { cn } from '@/lib/utils';
import { SearchRemoveIcon } from 'hugeicons-react';

export default function EmptyContainer({
  text = "It's lonely here",
  className,
  button,
}: {
  text?: string;
  className?: string;
  button?: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div className="flex space-x-2 items-center">
        <SearchRemoveIcon
          size={13}
          className="text-white/60"
        />
        <p className="text-xs text-white/60">{text}</p>
      </div>
      {button && button}
    </div>
  );
}
