import DialogController from '@/controllers/DialogController';
import { _ } from '@/lib/utils';
import { MenuOption } from '@/types';
import { MoreHorizontalIcon } from 'hugeicons-react';

export default function DropDown({ options }: { options: MenuOption[] }) {
  return (
    <div className="dropdown dropdown-left">
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
        {options.map(({ icon, onClick, text, confirm }, i) => (
          <li
            key={i}
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              confirm ? DialogController.showDialog(_, _, onClick) : onClick();
            }}
          >
            <div>
              {icon}
              <p className="prose text-xs text-white/70">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
