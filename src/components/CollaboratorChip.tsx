import { Cancel01Icon } from 'hugeicons-react';

export default function CollaboratorChip({
  email,
  onDelete,
}: {
  email: string;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onDelete}
      className="flex cursor-pointer bg-neutral-950/70 rounded-md px-2 py-1 items-center space-x-2"
    >
      <article className="prose">
        <p className="prose text-xs font-medium text-white/70">{email}</p>
      </article>
      <Cancel01Icon size={14} />
    </div>
  );
}
