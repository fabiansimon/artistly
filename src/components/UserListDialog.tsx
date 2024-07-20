import { useProjectContext } from '@/providers/ProjectProvider';
import { MenuOption, User } from '@/types';
import Avatar from './Avatar';
import { cn, concatName } from '@/lib/utils';
import { Delete01Icon, PaintBrush01Icon, UserGroupIcon } from 'hugeicons-react';
import DropDown from './Dropdown';
import { useMemo } from 'react';
import AlertController from '@/controllers/AlertController';

export default function UserListDialog() {
  const { project } = useProjectContext();

  if (!project || !project.authors || !project.collaborators) return;
  const { authors, collaborators } = project;

  return (
    <div className="flex flex-col w-full">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Users with access</h3>
      </article>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <div className="flex space-x-2 items-center">
          <PaintBrush01Icon size={14} />
          <p className="prose text-white text-xs font-medium">Authors</p>
        </div>
        {authors.map((author) => (
          <UserTile
            key={author.id}
            user={author}
          />
        ))}
        <div className="flex space-x-2 items-center pt-5">
          <UserGroupIcon size={14} />
          <p className="prose text-white text-xs font-medium">Collaborators</p>
        </div>
        {collaborators.map((collaborator) => (
          <UserTile
            removable
            key={collaborator.id}
            user={collaborator}
          />
        ))}
      </div>
    </div>
  );
}

function UserTile({
  user,
  className,
  removable,
}: {
  user: User;
  removable?: boolean;
  className?: string;
}) {
  const { first_name, last_name, email, image_url } = user;

  const options: MenuOption[] = useMemo(
    () => [
      {
        icon: (
          <Delete01Icon
            size={14}
            className="text-white/70"
          />
        ),
        text: 'Remove',
        confirm: true,
        onClick: () =>
          AlertController.show({ callback: () => console.log('he') }),
      },
    ],
    []
  );

  return (
    <div
      className={cn(
        'px-2 rounded-xl flex w-full h-14 p-2 justify-between',
        className
      )}
    >
      <div className="flex space-x-2 items-center">
        <Avatar
          src={image_url}
          className="size-8"
        />
        <div className="">
          <article className="prose">
            <p className="text-sm text-white">
              {concatName(first_name, last_name)}
            </p>
            <p className="text-xs -mt-4 text-white/50">{email}</p>
          </article>
        </div>
      </div>
      {removable && <DropDown options={options} />}
    </div>
  );
}
