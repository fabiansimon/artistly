import Toast from '@/components/Toast';
import UploadPage from '../../pages/upload';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <UploadPage />
      <Toast />
    </main>
  );
}
