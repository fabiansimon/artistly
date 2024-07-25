import { MEMBERSHIP_OPTIONS } from '@/constants/memberships';
import { convertPrice, cn } from '@/lib/utils';
import { MembershipType } from '@/types';

export default function MembershipCarousel({
  className,
  onClick,
  selected,
}: {
  onClick: (membership: MembershipType) => void;
  selected: MembershipType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'my-4 carousel carousel-center bg-neutral-950 rounded-box space-x-2 p-2 border border-neutral-950',
        className
      )}
    >
      {MEMBERSHIP_OPTIONS.map((option, index) => {
        const { description, membership, summary, title, price } = option;
        return (
          <div
            onClick={() => onClick(membership)}
            key={index}
            className={cn(
              'carousel-item w-52 hover:scale-[102%] cursor-pointer rounded-lg bg-neutral-900 p-3 border border-transparent transition-transform duration-200 ease-in-out opacity-70',
              selected === membership &&
                'border-primary/50 shadow-md shadow-primary/20 opacity-1'
            )}
          >
            <article className="prose justify-between flex flex-col">
              <h3 className="text-sm text-white">{title}</h3>
              <p className="text-sm text-white/60">{description}</p>
              <p className="text-xs font-medium text-white/60">
                {convertPrice(price)}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
