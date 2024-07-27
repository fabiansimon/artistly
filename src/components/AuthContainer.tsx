'use client';

import { MenuOption } from '@/types';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

enum AUTH_TYPE {
  google,
}

export default function AuthContainer() {
  const options: MenuOption[] = [
    {
      text: 'Sign in with Google',
      icon: (
        <Image
          width={20}
          height={20}
          alt="google icon"
          src={'/google-icon.svg'}
        />
      ),
      onClick: () => signIn('google'),
    },
    {
      text: 'Sign in with Apple',
      icon: (
        <Image
          width={20}
          height={20}
          alt="apple icon"
          src={'/apple-icon.svg'}
        />
      ),
      onClick: () => signIn('google'),
    },
    {
      text: 'Sign in with Github',
      icon: (
        <Image
          width={20}
          height={20}
          alt="github icon"
          src={'/github-icon-dark.svg'}
        />
      ),
      onClick: () => signIn('google'),
    },
  ];

  return (
    <div className="border border-white/10 mx-2 w-full md:max-w-screen-sm bg-neutral-950/80 rounded-lg p-8">
      <article className="prose mb-4">
        <h2 className="text-white font-medium">Login to get started</h2>
        <p className="text-white/60 text-sm -mt-4">
          Share Your Sound, Get Real Feedback - Refine Your Tracks with
          Precision and Ease
        </p>
      </article>
      <div className="space-y-2">
        {options.map(({ icon, onClick, text }, index) => {
          return (
            <button
              key={index}
              onClick={onClick}
              className="btn bg-white hover:bg-white/80 text-black/80 font-normal grow w-full"
            >
              {icon}
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
