'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext } from 'react';

interface UserContextType {
  userId: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  const userId = data?.user?.id || '';
  const value = { userId };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context)
    throw new Error('useUserContext must be used within a DataLayerProvider');

  return context;
}
