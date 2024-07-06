import { cn } from '@/lib/utils';
import { ArrowLeft02Icon, ReloadIcon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function Container({
  className,
  children,
  onRefresh,
}: {
  className?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
}) {
  return (
    <div className={cn('flex flex-col w-full px-4', className)}>
      <div className="flex justify-between mb-2 mt-4">
        <BackButton />
        {onRefresh && <RefreshButton onClick={onRefresh} />}
      </div>
      {children}
    </div>
  );
}

function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };

  return (
    <div
      className={cn('cursor-pointer', className)}
      onClick={navigateBack}
    >
      <ArrowLeft02Icon />
    </div>
  );
}

function RefreshButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        'cursor-pointer hover:bg-neutral-800 py-2 px-3 rounded-full space-x-2 flex items-center',
        className
      )}
      onClick={onClick}
    >
      <p className="prose text-white/80 text-xs">Refetch</p>
      <ReloadIcon
        className="text-white/80"
        size={16}
      />
    </div>
  );
}
