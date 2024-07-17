import { cn } from '@/lib/utils';
import { ArrowLeft02Icon, ReloadIcon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';
import SimpleButton from './SimpleButton';

export default function Container({
  className,
  children,
  onRefresh,
  omitPadding = false,
}: {
  className?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  omitPadding?: boolean;
}) {
  return (
    <div
      className={cn('flex flex-col w-full', !omitPadding && 'px-4', className)}
    >
      <div
        className={cn('flex justify-between mb-2 mt-4', omitPadding && 'px-4')}
      >
        <BackButton />
        {onRefresh && <RefreshButton onClick={onRefresh} />}
      </div>
      {children}
    </div>
  );
}

export function BackButton({ className }: { className?: string }) {
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
    <SimpleButton
      text="Refetch"
      onClick={onClick}
      className={className}
      icon={
        <ReloadIcon
          className="text-white/80"
          size={16}
        />
      }
    />
  );
}
