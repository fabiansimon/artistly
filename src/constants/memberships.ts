export const MEMBERSHIP = {
  free: 'free',
  tier1: 'tier_1',
  tier2: 'tier_2',
} as const;

export const MEMBERSHIP_PRICE_ID = {
  [MEMBERSHIP.free]: '',
  [MEMBERSHIP.tier1]: 'price_1PcmlXEsfTIBY629yUymjtA8',
  [MEMBERSHIP.tier2]: '',
};

export function getMembershipById(priceId: string) {
  const entry = Object.entries(MEMBERSHIP_PRICE_ID).find(
    ([_, id]) => id === priceId
  );
  return entry?.[0];
}
