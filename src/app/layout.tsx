import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Toast from '@/components/Toast';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/providers/NextAuthProvider';
import AudioProvider from '@/providers/AudioProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Artistly',
  description: 'For Julia',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession();

  return (
    <html
      lang="en"
      data-theme="sunset"
    >
      <body className={inter.className}>
        {/* <NextAuthProvider session={session}> */}
        <AudioProvider>
          <main className="flex min-h-screen flex-col items-center justify-between">
            {children}
            <Toast />
          </main>
        </AudioProvider>
        {/* </NextAuthProvider> */}
      </body>
    </html>
  );
}
