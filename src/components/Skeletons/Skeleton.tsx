import { cn } from '@/lib/utils';

function Skeleton() {
  return null;
}

Skeleton.Container = Container;
Skeleton.Title = Title;
Skeleton.Box = Box;
Skeleton.Tile = Tile;
Skeleton.Horizontal = Horizontal;
Skeleton.Vertical = Vertical;

export default Skeleton;

function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mt-10 flex grow flex-col h-full', className)}>
      {children}
    </div>
  );
}

function Title({ className }: { className?: string }) {
  return <div className={cn('h-8 w-40 skeleton', className)} />;
}

function Box({ className }: { className?: string }) {
  return <div className={cn('min-h-40 min-w-40 skeleton', className)} />;
}

function Tile({ className }: { className?: string }) {
  return <div className={cn('h-24 w-full skeleton', className)} />;
}

function Horizontal({
  className,
  amount,
  shape,
}: {
  className?: string;
  amount: number;
  shape: React.ReactNode;
}) {
  return (
    <div className={cn('flex space-x-4 overflow-x-hidden', className)}>
      {Array.from({ length: amount }).map((_, index) => (
        <div key={index}>{shape}</div>
      ))}
    </div>
  );
}
function Vertical({
  className,
  amount,
  shape,
}: {
  className?: string;
  amount: number;
  shape: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {Array.from({ length: amount }).map((_, index) => (
        <div key={index}>{shape}</div>
      ))}
    </div>
  );
}
