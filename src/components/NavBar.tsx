'use client';

import { route, ROUTES } from '@/constants/routes';
import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils';
import { Navigation, NavOption } from '@/types';
import {
  AddCircleIcon,
  Home06Icon,
  MusicNote03Icon,
  Settings02Icon,
  UserIcon,
} from 'hugeicons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import DialogController from '@/controllers/DialogController';
import UploadContainer from './UploadContainer';

function NavBar({ className }: { className?: string }): JSX.Element {
  const { isSmall } = useWindowSize();
  const path = usePathname();

  const options: Navigation[] = useMemo(
    () => [
      {
        title: 'Projects',
        options: [
          {
            title: 'Home',
            route: route(ROUTES.home),
            icon: <Home06Icon size={16} />,
          },
          {
            title: 'Projects',
            route: route(ROUTES.projects),
            icon: <MusicNote03Icon size={16} />,
          },
          {
            title: 'Upload',
            icon: (
              <AddCircleIcon
                size={14}
                className="text-white"
              />
            ),
            onClick: () =>
              DialogController.showCustomDialog(<UploadContainer />),
          },
        ],
      },
      {
        title: 'Profile',
        options: [
          {
            title: 'Settings',
            icon: <Settings02Icon size={16} />,
            onClick: () => console.log('hello'),
          },
          {
            title: 'Projects',
            icon: <UserIcon size={16} />,
            onClick: () => console.log('hello'),
          },
        ],
      },
    ],
    []
  );

  return (
    <nav
      className={cn(
        'rounded-md bg-neutral-900 px-1 border border-neutral-800/70 md:min-w-64',
        className
      )}
    >
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
}: {
  option: NavOption;
  className?: string;
  active: boolean;
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
      {!isSmall && (
        <article className="prose">
          <p className="text text-white text-sm">{title}</p>
        </article>
      )}
    </div>
  );
}

export default NavBar;
