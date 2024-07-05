import { cn } from '@/lib/utils';
import BackButton from './BackButton';

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col w-full px-4', className)}>
      <BackButton className="mb-2 mt-4" />
      {children}
    </div>
  );
}
