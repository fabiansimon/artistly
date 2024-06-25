import Toast from '@/components/Toast';
import { AppProps } from 'next/app';
import '../src/app/globals.css';
import AudioProvider from '@/providers/AudioProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      data-theme="sunset"
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <AudioProvider>
        <Component {...pageProps} />
      </AudioProvider>
      <Toast />
    </div>
  );
}
