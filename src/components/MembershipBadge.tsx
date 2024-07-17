import { MEMBERSHIP } from '@/constants/memberships';
import { cn } from '@/lib/utils';
import { useUserContext } from '@/providers/UserProvider';
import { MusicNote03Icon, StarsIcon } from 'hugeicons-react';
import { useMemo } from 'react';

export default function MembershipBadge({ className }: { className?: string }) {
  const {
    user: { membership },
  } = useUserContext();

  const { icon, color } = useMemo(() => {
    if (membership === MEMBERSHIP.tier1) {
      return {
        icon: <MusicNote03Icon size={12} />,
        color: 'bg-success',
      };
    }

    return {
      icon: (
        <StarsIcon
          className="fill-white"
          size={12}
        />
      ),
      color: 'bg-primary',
    };
  }, [membership]);

  if (membership === 'free') return;
  return (
    <div
      className={cn(
        'flex items-center justify-center aspect-square rounded-lg p-1',
        color,
        className
      )}
    >
      {icon}
    </div>
  );
}
