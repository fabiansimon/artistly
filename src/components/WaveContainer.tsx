import { cn } from '@/lib/utils';

export default function WaveContainer({
  intervals,
  className,
  amplifyBy,
}: {
  intervals: number[];
  className?: string;
  amplifyBy?: number;
}) {
  const AMPLIFY_BY = amplifyBy || 100;
  return (
    <div className={cn('flex w-full items-center space-x-1', className)}>
      {intervals.map((peak, index) => (
        <div
          key={index}
          style={{ height: peak * AMPLIFY_BY, flex: 1 }}
          className="flex-grow w-full min-w-[0.3px] max-w-2 bg-slate-50 rounded-full"
        />
      ))}
    </div>
  );
}
