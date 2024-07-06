import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Toast from '@/components/Toast';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/providers/NextAuthProvider';
import AudioProvider from '@/providers/AudioProvider';
import Dialog from '@/components/Dialog';
import NavBar from '@/components/NavBar';
import DataLayerProvider from '@/providers/DataLayerProvider';

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
    <html lang="en">
      <body className={inter.className}>
        {/* <NextAuthProvider session={session}> */}
        <AudioProvider>
          <DataLayerProvider>
            <div className="flex w-full bg-neutral-950 min-h-screen space-x-2 p-2 fixed">
              <NavBar />
              <main className="flex bg-neutral-900 w-full border border-neutral-800/70 rounded-md">
                {children}
                <Toast />
                <Dialog />
              </main>
            </div>
          </DataLayerProvider>
        </AudioProvider>
        {/* </NextAuthProvider> */}
      </body>
    </html>
  );
}
