import AlertController from '@/controllers/AlertController';
import { _, cn } from '@/lib/utils';
import { MenuOption } from '@/types';
import { MoreHorizontalIcon } from 'hugeicons-react';

export default function DropDown({
  options,
  className,
}: {
  options: MenuOption[];
  className?: string;
}) {
  return (
    <div className={cn('dropdown dropdown-left', className)}>
      <div
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
        role="button"
      >
        <MoreHorizontalIcon />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-xl z-[10] p-1 shadow"
      >
        {options.map(({ icon, onClick, text, confirm, optimistic }, i) => (
          <li
            key={i}
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              confirm
                ? AlertController.show({ callback: onClick, optimistic })
                : onClick();
            }}
          >
            <div>
              {icon}
              <p className="prose text-xs text-white/60">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
