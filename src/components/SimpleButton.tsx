import { cn } from '@/lib/utils';

export default function SimpleButton({
  icon,
  text,
  className,
  textClassName,
  condensed,
  iconPosition = 'right',
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  iconPosition?: 'left' | 'right';
  condensed?: boolean;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'cursor-pointer hover:bg-neutral-800 px-3 max-h-9 h-9 rounded-full space-x-2 flex items-center border border-neutral-700/50',
        className,
        condensed && 'py-1'
      )}
      onClick={onClick}
    >
      {iconPosition === 'left' && icon}
      <p
        className={cn(
          'prose text-white/60 text-xs text-ellipsis line-clamp-1',
          textClassName
        )}
      >
        {text}
      </p>
      {iconPosition === 'right' && icon}
    </button>
  );
}
