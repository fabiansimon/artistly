import Toast from '@/components/Toast';
import UploadPage from '../../pages/upload';
import AudioProvider from '@/providers/AudioProvider';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <UploadPage />
      <Toast />
    </main>
  );
}
