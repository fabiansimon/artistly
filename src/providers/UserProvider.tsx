'use client';

import { User } from '../types/index';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useMemo } from 'react';

interface UserContextType {
  user: User;
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
      };
    }

    const {
      id,
      created_at,
      first_name,
      last_name,
      email,
      image: image_url,
    } = data.user;

    return {
      id,
      created_at,
      first_name,
      last_name,
      email: email || '',
      image_url: image_url || '', // Ensure image_url is defined
    };
  }, [data]);

  const value = { user };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
}
