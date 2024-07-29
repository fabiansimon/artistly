import { cn } from '@/lib/utils';
import { ArrowLeft02Icon, ReloadIcon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';
import SimpleButton from './SimpleButton';
import useWindowSize from '@/hooks/useWindowSize';

export default function Container({
  className,
  children,
  onRefresh,
  isLoading,
  skeleton,
  omitPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  skeleton?: React.ReactNode;
  isLoading?: boolean;
  onRefresh?: () => void;
  omitPadding?: boolean;
}) {
  const { isSmall } = useWindowSize();

  return (
    <div
      className={cn(
        'flex grow w-full flex-col pr-4',
        !omitPadding && 'px-4',
        className
      )}
    >
      {isLoading && skeleton ? (
        skeleton
      ) : (
        <>
          <div
            className={cn(
              'flex justify-between mb-2 mt-4',
              omitPadding && 'px-4'
            )}
          >
            {!isSmall && <BackButton />}
            {!isSmall && onRefresh && <RefreshButton onClick={onRefresh} />}
          </div>
          {children}
        </>
      )}
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
          className="text-white/60"
          size={16}
        />
      }
    />
  );
}
