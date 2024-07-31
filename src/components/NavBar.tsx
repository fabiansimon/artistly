'use client';

import { route, ROUTES } from '@/constants/routes';
import useWindowSize from '@/hooks/useWindowSize';
import { cn, concatName } from '@/lib/utils';
import { Navigation, NavOption } from '@/types';
import {
  AddCircleIcon,
  Hamburger01Icon,
  Home06Icon,
  Menu01Icon,
  MusicNote03Icon,
  Rocket01Icon,
  Settings02Icon,
  Unlink01Icon,
  UserIcon,
} from 'hugeicons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import UploadContainer from './UploadContainer';
import Avatar from './Avatar';
import { useUserContext } from '@/providers/UserProvider';
import MembershipBadge from './MembershipBadge';
import ModalController from '@/controllers/ModalController';
import { motion } from 'framer-motion';
import PremiumDialog from './PremiumDialog';

function NavBar({ className }: { className?: string }) {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { user } = useUserContext();
  const { isSmall } = useWindowSize();
  const path = usePathname();
  const router = useRouter();

  const options: Navigation[] = useMemo(
    () => [
      {
        title: 'Projects',
        options: [
          {
            title: 'Home',
            route: route(ROUTES.home),
            icon: (
              <Home06Icon
                className="text-white"
                size={16}
              />
            ),
          },
          {
            title: 'Projects',
            route: route(ROUTES.projects),
            icon: (
              <MusicNote03Icon
                className="text-white"
                size={16}
              />
            ),
          },
          {
            title: 'Invites',
            route: route(ROUTES.invites),
            icon: (
              <Unlink01Icon
                className="text-white"
                size={16}
              />
            ),
          },
          {
            title: 'Upload',
            icon: (
              <AddCircleIcon
                size={14}
                className="text-white"
              />
            ),
            onClick: () => ModalController.show(<UploadContainer />),
          },
        ],
      },
      {
        title: 'Profile',
        options: [
          {
            title: 'Account',
            icon: (
              <UserIcon
                className="text-white"
                size={16}
              />
            ),
            route: route(ROUTES.profile),
          },
          {
            title: 'Membership',
            icon: (
              <Rocket01Icon
                className="text-white"
                size={16}
              />
            ),
            onClick: () => ModalController.show(<PremiumDialog />),
          },
        ],
      },
    ],
    []
  );
  const { first_name, last_name, image_url, email } = user;

  if (isSmall)
    return (
      <nav className="bg-black/30 left-0 h-14 right-0 items-center flex backdrop-blur-sm shadow-sm fixed top-0 z-20 overflow-visible">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center"
        >
          {isSmall && <Menu01Icon className="text-white size-6 ml-4" />}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setExpanded(false)}
            className={cn(
              'flex fixed top-0 bottom-0 z-10 left-0 h-[20000%] w-[100%] bg-black/80'
            )}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-neutral-900 dark:bg-neutral-900 w-[50%] opacity-100 p-2"
            >
              <div className="mt-2">
                <div
                  onClick={() => router.push(ROUTES.profile)}
                  className="border rounded-2xl border-white/10 cursor-pointer flex space-x-2 p-2 items-center mt-4 hover:bg-neutral-950 mx-2"
                >
                  <div className="relative flex flex-col-reverse">
                    <Avatar
                      className="bg-red-500"
                      size={32}
                      src={image_url}
                    />
                    <MembershipBadge className="absolute -top-[6px] -right-[6px]" />
                  </div>
                  <article className="prose">
                    <p className="text-sm font-medium text-white">
                      {concatName(first_name, last_name)}
                    </p>
                    <p className="text-xs -mt-4 text-white/60">{email}</p>
                  </article>
                </div>
                {options.map((option, index) => {
                  const { options, title } = option;
                  return (
                    <div key={index}>
                      <p className="text-sm text-white/60 ml-2 mt-6">{title}</p>
                      <div className="mx-3 mt-2 space-y-2 md:space-y-0">
                        {options.map((o, i) => (
                          <MenuItem
                            drawer
                            active={o.route === path}
                            key={i}
                            option={o}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </nav>
    );

  return (
    <nav
      className={cn(
        'rounded-md bg-neutral-900 px-1 border border-neutral-800/70 md:min-w-64',
        className
      )}
    >
      <div
        onClick={() => router.push(ROUTES.profile)}
        className="border rounded-2xl border-white/10 cursor-pointer flex space-x-2 p-2 items-center mt-4 hover:bg-neutral-950 mx-2"
      >
        <div className="relative flex flex-col-reverse">
          <Avatar
            size={32}
            src={image_url}
          />
          <MembershipBadge
            className={!isSmall ? 'absolute -top-[6px] -right-[6px]' : 'mb-1'}
          />
        </div>
        {!isSmall && (
          <article className="prose">
            <p className="text-sm font-medium text-white">
              {concatName(first_name, last_name)}
            </p>
            <p className="text-xs -mt-4 text-white/60">{email}</p>
          </article>
        )}
      </div>
      {options.map((option, index) => {
        const { options, title } = option;
        return (
          <div key={index}>
            {!isSmall && (
              <p className="text-sm text-white/60 ml-2 mt-6">{title}</p>
            )}
            <div className="mx-3 mt-2 space-y-2 md:space-y-0">
              {options.map((o, i) => (
                <MenuItem
                  active={o.route === path}
                  key={i}
                  option={o}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function MenuItem({
  option,
  className,
  active,
  drawer,
}: {
  option: NavOption;
  active: boolean;
  className?: string;
  drawer?: boolean;
}) {
  const router = useRouter();
  const { isSmall } = useWindowSize();
  const { title, icon, onClick, route } = option;

  const handleClick = () => {
    if (onClick) return onClick();
    if (route) router.push(route);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex rounded-lg p-2 cursor-pointer space-x-2 items-center',
        className,
        active
          ? 'bg-neutral-800/60 transition-opacity duration-100'
          : 'opacity-25 hover:opacity-100 transition-opacity duration-100'
      )}
    >
      <div className="md:min-w-6">{icon}</div>
      {(drawer || !isSmall) && (
        <p className="prose text-white text-sm">{title}</p>
      )}
    </div>
  );
}

export default NavBar;
