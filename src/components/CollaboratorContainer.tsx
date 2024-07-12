import { cn } from '@/lib/utils';
import { useProjectContext } from '@/providers/ProjectProvider';
import Avatar from './Avatar';
import { PaintBrush01Icon, UserGroupIcon } from 'hugeicons-react';

export default function CollaboratorContainer({
  className,
}: {
  className?: string;
}) {
  const { project } = useProjectContext();
  if (!project) return;
  const { authors, collaborators } = project;
  return (
    <div className={cn('flex space-x-4 items-start', className)}>
      <div className="flex flex-col justify-center space-y-1">
        <div className="flex items-center space-x-1">
          <PaintBrush01Icon
            size={12}
            className="text-white/70"
          />
          <p className="text-xs text-white/70">Authors</p>
        </div>
        <div className="flex -space-x-1">
          {[...authors, ...authors, ...authors].map(
            ({ image_url, first_name, last_name, email, id }) => (
              <Avatar
                key={id}
                size={18}
                src={image_url}
                className="border border-primary rounded-full"
              />
            )
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-1">
        <div className="flex items-center space-x-1">
          <UserGroupIcon
            size={12}
            className="text-white/70"
          />
          <p className="text-xs text-white/70">Collaborators</p>
        </div>
        <div className="flex -space-x-1">
          {[...collaborators, ...collaborators, ...collaborators].map(
            ({ image_url, first_name, last_name, email, id }) => (
              <Avatar
                key={id}
                size={18}
                src={image_url}
                className="rounded-full"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
