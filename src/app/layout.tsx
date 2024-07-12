import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/providers/NextAuthProvider';
import AudioProvider from '@/providers/AudioProvider';
import DataLayerProvider from '@/providers/DataLayerProvider';
import InitRoot from '@/components/InitRoot';
import UserProvider from '@/providers/UserProvider';
import ProjectProvider from '@/providers/ProjectProvider';

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
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider session={session}>
          <DataLayerProvider>
            <UserProvider>
              <AudioProvider>
                <ProjectProvider>
                  <InitRoot>{children}</InitRoot>
                </ProjectProvider>
              </AudioProvider>
            </UserProvider>
          </DataLayerProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
