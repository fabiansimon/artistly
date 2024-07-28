import { cn } from '@/lib/utils';
import AnimatedText from './AnimatedText';

export default function LoadingView({
  strings,
  className,
}: {
  strings: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full h-full items-center justify-center',
        className
      )}
    >
      <span className="loading translate-x-2 loading-ring text-white bg-white loading-sm"></span>
      <AnimatedText
        className="mt-8"
        strings={strings}
      />
    </div>
  );
}
