import { MEMBERSHIP } from '@/constants/memberships';
import ToastController from '@/controllers/ToastController';
import convertPrice, { cn, getUsage } from '@/lib/utils';
import { useUserContext } from '@/providers/UserProvider';
import { MembershipType, UsageLimit } from '@/types';
import { Rocket01Icon, SleepingIcon } from 'hugeicons-react';
import { useMemo, useState } from 'react';

export default function PremiumDialog({
  usageLimit,
}: {
  usageLimit?: UsageLimit;
}) {
  const {
    user: { membership: currMembership },
    updateMembership,
  } = useUserContext();
  const [selected, setSelected] = useState<MembershipType>(currMembership);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { title, description } = useMemo(() => {
    return usageLimit !== undefined ? PREMIUM_INFO[usageLimit] : DEFAULT_INFO;
  }, [usageLimit]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await updateMembership(selected);
    } catch (error) {
      ToastController.showErrorToast(
        'Oh no!',
        'something went wrong when purchasing this package. Please try again!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const MEMBERSHIP_OPTIONS = [
    {
      membership: MEMBERSHIP.free,
      title: 'Free Tier',
      description:
        "Share you passion and get your career rolling. Don't worry about hidden fees.",
      summary:
        'Upload up to 3 projects - with 3 versions each. Up to 2 collaborators per project',
      price: 0,
    },
    {
      membership: MEMBERSHIP.tier1,
      title: 'Tier 1',
      description: 'Premium membership for established artists.',
      summary:
        'Upload up to 6 projects - with 8 versions each. Up to 5 collaborators per project',
      price: 10.99,
      priceId: 'price_1PcmlXEsfTIBY629yUymjtA8',
    },
    {
      membership: MEMBERSHIP.tier2,
      title: 'Professional',
      description: 'Premium membership for established artists.',
      summary:
        'Upload up to 6 projects - with 8 versions each. Up to 5 collaborators per project',
      price: 18.99,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">{title}</h3>
        <p className="text-white/80 text-xs text-center">{description}</p>
      </article>
      <div className="my-4 carousel carousel-center bg-neutral-950 rounded-box max-w-md space-x-2 p-2 border border-neutral-950">
        {MEMBERSHIP_OPTIONS.map((option, index) => {
          const { description, membership, summary, title, price } = option;

          return (
            <div
              onClick={() => setSelected(membership)}
              key={index}
              className={cn(
                'carousel-item w-52 hover:scale-[102%] cursor-pointer rounded-lg bg-neutral-900 p-3 border border-transparent transition-transform duration-200 ease-in-out',
                selected === membership &&
                  'border-primary/50 shadow-md shadow-primary/20'
              )}
            >
              <article className="prose justify-between flex flex-col">
                <h3 className="text-sm text-white">{title}</h3>
                <p className="text-sm text-white/70">{description}</p>
                <p className="text-xs font-medium text-white/70">
                  {convertPrice(price)}
                </p>
              </article>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={currMembership === selected}
        className="btn btn-primary text-white mx-auto mt-4"
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <Rocket01Icon size={18} />
            Upgrade Account
          </>
        )}
      </button>
    </div>
  );
}

const DEFAULT_INFO = {
  title: 'Thank you for considering upgrading and supporting us.',
  description: 'Choose one of the following Premium Tiers to continue.',
};

const PREMIUM_INFO: Record<number, { title: string; description: string }> = {
  [UsageLimit.versions]: {
    title: 'Oh no! You have reached the free limit.',
    description: `To upload up to ${getUsage(
      'MAX_PAID_VERSIONS_AMOUNT'
    )} version, consider supporting us and choosing one of the following Premium Tiers.`,
  },
  [UsageLimit.projects]: {
    title: 'Oh no! You have reached the free limit.',
    description: `To upload up to ${getUsage(
      'MAX_PAID_PROJECTS_AMOUNT'
    )} projects, consider supporting us and choosing one of the following Premium Tiers.`,
  },
};
