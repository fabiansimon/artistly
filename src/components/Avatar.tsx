import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Avatar({
  className,
  hoverText,
  size = 14,
  src,
}: {
  size?: number;
  className?: string;
  src?: string;
  hoverText?: string;
}) {
  return (
    <div
      className={cn('avatar', hoverText && 'tooltip tooltip-right ')}
      data-tip={hoverText}
    >
      <div className={cn('mask mask-squircle', className)}>
        <Image
          width={size}
          height={size}
          src={
            src ||
            'https://img.daisyui.com/tailwind-css-component-profile-2@56w.png'
          }
          alt="Avatar Tailwind CSS Component"
        />
      </div>
    </div>
  );

  return (
    <div className="avatar">
      <div className={cn('mask mask-squircle', className)}>
        <Image
          width={size}
          height={size}
          src={
            src ||
            'https://img.daisyui.com/tailwind-css-component-profile-2@56w.png'
          }
          alt="Avatar Tailwind CSS Component"
        />
      </div>
    </div>
  );
}
