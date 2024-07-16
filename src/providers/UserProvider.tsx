'use client';

import { MEMBERSHIP, MEMBERSHIP_PRICE_ID } from '@/constants/memberships';
import { MembershipType, User } from '../types/index';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { upgradeMembership } from '@/lib/api';

interface UserContextType {
  user: User;
  updateMembership: (membership: MembershipType) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  const user = useMemo(() => {
    if (!data?.user) {
      return {
        id: '',
        created_at: new Date(),
        first_name: '',
        last_name: '',
        email: '',
        image_url: '',
        membership: MEMBERSHIP.free,
      };
    }

    const {
      id,
      created_at,
      first_name,
      last_name,
      email,
      image: image_url,
      membership,
    } = data.user;

    return {
      id,
      created_at,
      first_name,
      last_name,
      email: email || '',
      image_url: image_url || '',
      membership,
    };
  }, [data]);

  const updateMembership = useCallback(async (membership: MembershipType) => {
    try {
      await upgradeMembership({ priceId: MEMBERSHIP_PRICE_ID[membership] });
    } catch (error) {
      throw new Error(error.message);
    }
  }, []);

  const value = { user, updateMembership };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
}
