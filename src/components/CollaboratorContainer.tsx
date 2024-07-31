import { cn, concatName } from '@/lib/utils';
import { useProjectContext } from '@/providers/ProjectProvider';
import Avatar from './Avatar';
import { PaintBrush01Icon, UserGroupIcon } from 'hugeicons-react';
import { useState } from 'react';
import { User } from '@/types';
import { motion } from 'framer-motion';
import ModalController from '@/controllers/ModalController';
import UserListDialog from './UserListDialog';

export default function CollaboratorContainer({
  className,
}: {
  className?: string;
}) {
  const [hovered, setHovered] = useState<boolean>(false);

  const { project } = useProjectContext();
  if (!project || !project.author || !project.collaborators) return;
  const { author, collaborators } = project;

  return (
    <div
      className={cn(
        'flex bg-neutral-950 border-white/10 border rounded-full items-start justify-between p-2',
        className
      )}
    >
      <div
        onClick={() => ModalController.show(<UserListDialog />)}
        className="hover:bg-neutral-900 cursor-pointer border border-white/10 rounded-full size-[26px] justify-center items-center flex mr-1"
      >
        <UserGroupIcon
          size={12}
          className="text-white/60"
        />
      </div>
      <div
        className="-space-x-2 -mb-2 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(true)}
      >
        <Avatar
          size={18}
          src={author.image_url}
          className="rounded-full"
        />
        {collaborators.map(({ image_url, id }) => (
          <Avatar
            key={id}
            size={18}
            src={image_url}
            className="rounded-full"
          />
        ))}
      </div>
      {hovered && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute z-20 bg-neutral-950 p-3 rounded-lg shadow shadow-black right-0 top-10 overflow-hidden"
        >
          <div className="flex items-center mb-2 space-x-1">
            <PaintBrush01Icon
              size={15}
              className="text-white/60"
            />
            <p className="prose text-xs text-white/60 font-medium">Author</p>
          </div>
          <div className="space-y-2">
            <UserTile
              isAuthor
              user={author}
            />
          </div>
          <div className="divider my-2"></div>
          <div className="flex items-center mb-2 space-x-1">
            <UserGroupIcon
              size={15}
              className="text-white/60"
            />
            <p className="prose text-xs text-white/60 font-medium">
              Collaborators
            </p>
          </div>
          <div className="space-y-2">
            {collaborators.map((user) => (
              <UserTile
                user={user}
                key={user.id}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function UserTile({ user, isAuthor }: { user: User; isAuthor?: boolean }) {
  const { image_url, first_name, last_name, email } = user;
  return (
    <div className="flex items-center space-x-2">
      <Avatar
        size={18}
        src={image_url}
        className={cn(
          'border-2 size-7 rounded-full',
          false ? 'border-primary' : 'border-transparent'
        )}
      />
      <div className="flex flex-col">
        <p className="prose text-xs text-white">
          {concatName(first_name, last_name)}
        </p>
        <p className="prose text-xs -mt-1 text-white/60">{email}</p>
      </div>
    </div>
  );
}
