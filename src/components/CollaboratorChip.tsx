import { cn } from '@/lib/utils';
import { Cancel01Icon } from 'hugeicons-react';

export default function CollaboratorChip({
  email,
  onDelete,
}: {
  email: string;
  onDelete?: () => void;
}) {
  return (
    <div
      onClick={onDelete}
      className={cn(
        'flex bg-neutral-800 rounded-md px-2 py-1 items-center space-x-2 border border-white/10',
        onDelete && 'cursor-pointer'
      )}
    >
      <article className="prose">
        <p className="prose text-xs font-medium text-white/60">{email}</p>
      </article>
      {onDelete && <Cancel01Icon size={14} />}
    </div>
  );
}
