'use client';

import { useSession } from 'next-auth/react';
import Dialog from './Dialog';
import NavBar from './NavBar';
import Toast from './Toast';
import { useEffect } from 'react';
import { route, ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';

export default function InitRoot({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push(route(ROUTES.auth));
  }, [status, router]);

  return (
    <div className="flex w-full bg-neutral-950 min-h-screen space-x-2 p-2 fixed">
      <NavBar />
      <main className="flex bg-neutral-900 w-full border border-neutral-800/70 rounded-md">
        {children}
        <Toast />
        <Dialog />
      </main>
    </div>
  );
}
