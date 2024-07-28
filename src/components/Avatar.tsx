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
      data-tip={hoverText}
      className={cn(
        'mask mask-squircle avatar',
        className,
        hoverText && 'tooltip tooltip-right'
      )}
    >
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
  );
}
