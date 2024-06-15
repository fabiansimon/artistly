import { cn } from '@/lib/utils';

export default function WaveContainer({
  intervals,
  className,
}: {
  intervals: number[];
  className?: string;
}) {
  const AMPLIFY_BY = 100;
  return (
    <div
      className={cn('flex flex-grow items-center w-full space-x-1', className)}
    >
      {intervals.map((peak, index) => (
        <div
          key={index}
          style={{ height: peak * AMPLIFY_BY }}
          className="flex-grow bg-slate-50 rounded-full"
        />
      ))}
    </div>
  );
}
