import { cn } from '@/lib/utils';

export default function SimpleButton({
  icon,
  text,
  className,
  condensed,
  iconPosition = 'right',
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  iconPosition?: 'left' | 'right';
  condensed?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'cursor-pointer hover:bg-neutral-800 py-2 px-3 rounded-full space-x-2 flex items-center border border-neutral-700/50',
        className,
        condensed && 'py-1'
      )}
      onClick={onClick}
    >
      {iconPosition === 'left' && icon}
      <p className="prose text-white/60 text-xs">{text}</p>
      {iconPosition === 'right' && icon}
    </button>
  );
}