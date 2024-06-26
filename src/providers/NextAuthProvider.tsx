'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface NextAuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

function NextAuthProvider({ children, session }: NextAuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default NextAuthProvider;
