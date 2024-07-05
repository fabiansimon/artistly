import { cn } from '@/lib/utils';
import { ArrowLeft02Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

export default function BackButton({ className }: { className?: string }) {
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
