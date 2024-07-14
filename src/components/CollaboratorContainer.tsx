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
  if (!project || !project.authors || !project.collaborators) return;
  const { authors, collaborators } = project;

  return (
    <div
      className={cn(
        'flex cursor-pointer bg-neutral-950 border-white/10 border rounded-full items-start justify-between p-2 -space-x-2',
        className
      )}
    >
      {authors.map(({ image_url, first_name, last_name, email, id }) => (
        <Avatar
          key={id}
          size={18}
          src={image_url}
          className="border-2 border-primary rounded-full"
        />
      ))}
      {collaborators.map(({ image_url, first_name, last_name, email, id }) => (
        <Avatar
          key={id}
          size={18}
          src={image_url}
          className="border-2 border-transparent rounded-full"
        />
      ))}
    </div>
  );
  return (
    <div
      className={cn('flex space-x-4 items-start justify-between', className)}
    >
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-1">
          <PaintBrush01Icon
            size={12}
            className="text-white/70"
          />
          <p className="text-xs text-white/70">Authors</p>
        </div>
        <div className="flex -space-x-1">
          {authors.map(({ image_url, first_name, last_name, email, id }) => (
            <Avatar
              key={id}
              size={18}
              src={image_url}
              className="border border-primary rounded-full"
            />
          ))}
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
          {collaborators.map(
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
