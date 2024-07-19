'use client';

import { useSession } from 'next-auth/react';
import Modal from './Modal';
import NavBar from './NavBar';
import Toast from './Toast';
import AuthPage from '@/app/auth/page';
import Alert from './Alert';

export default function InitRoot({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === 'unauthenticated') return <AuthPage />;

  return (
    <div className="flex w-full bg-neutral-950 min-h-screen space-x-2 p-2 fixed">
      <NavBar />
      <main className="flex bg-neutral-900 w-full border border-neutral-800/70 rounded-md">
        {children}
        <Toast />
        <Modal />
        <Alert />
      </main>
    </div>
  );
}
