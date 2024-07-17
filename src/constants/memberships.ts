export const MEMBERSHIP = {
  free: 'free',
  tier1: 'tier_1',
  tier2: 'tier_2',
} as const;

export const MEMBERSHIP_PRICE_ID = {
  [MEMBERSHIP.free]: '',
  [MEMBERSHIP.tier1]: 'price_1PcmlXEsfTIBY629yUymjtA8',
  [MEMBERSHIP.tier2]: 'price_1PdSkgEsfTIBY629T9BJtdVl',
};

export function getMembershipById(priceId: string) {
  const entry = Object.entries(MEMBERSHIP_PRICE_ID).find(
    ([_, id]) => id === priceId
  );
  return entry?.[0];
}

export const MEMBERSHIP_OPTIONS = [
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
