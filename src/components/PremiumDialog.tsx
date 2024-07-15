import { getUsage, getUsageLimit } from '@/lib/utils';
import { UsageLimit } from '@/types';
import { useMemo } from 'react';

export default function PremiumDialog({
  usageLimit,
}: {
  usageLimit?: UsageLimit;
}) {
  const { title, description } = useMemo(() => {
    return usageLimit !== undefined ? PREMIUM_INFO[usageLimit] : DEFAULT_INFO;
  }, [usageLimit]);

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">{title}</h3>
        <p className="text-white text-xs text-center">{description}</p>
      </article>
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
