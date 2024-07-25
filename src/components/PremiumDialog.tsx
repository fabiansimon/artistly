import ToastController from '@/controllers/ToastController';
import { getUsage } from '@/lib/utils';
import { useUserContext } from '@/providers/UserProvider';
import { MembershipType, UsageLimit } from '@/types';
import { Rocket01Icon } from 'hugeicons-react';
import { useMemo, useState } from 'react';
import MembershipCarousel from './MembershipCarousel';

export default function PremiumDialog({
  preselected,
  usageLimit,
}: {
  usageLimit?: UsageLimit;
  preselected?: MembershipType;
}) {
  const {
    user: { membership: currMembership },
    updateMembership,
  } = useUserContext();
  const [selected, setSelected] = useState<MembershipType>(
    preselected || currMembership
  );
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

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">{title}</h3>
        <p className="text-white/60 text-sm text-center">{description}</p>
      </article>
      <MembershipCarousel
        className="max-w-md"
        onClick={setSelected}
        selected={selected}
      />
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
