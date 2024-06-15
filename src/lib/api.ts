import ToastController from '@/controllers/ToastController';

const FALLBACK_ERROR_MESSAGE = {
  title: 'Sorry, something went wrong',
  description: 'This is on us. Please try again later.',
};

function handleError({
  error,
  callName,
  showError = true,
}: {
  error: unknown;
  callName: string;
  showError?: boolean;
}) {
  console.error(`Failed request at function [${callName}]`, error);

  if (!showError) return;

  let errorTitle = FALLBACK_ERROR_MESSAGE.title;
  let errorDescription = FALLBACK_ERROR_MESSAGE.description;

  ToastController.showErrorToast(errorTitle, errorDescription);
}

export async function uploadTrack(data: FormData) {
  try {
    const res = await fetch('/api/uploadTrack', {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      throw new Error('Failed to upload track');
    }

    return await res.json();
  } catch (error) {
    console.error('Error uploading track:', error);
    handleError({ error, callName: 'uploadTrack' });
    throw error;
  }
}
