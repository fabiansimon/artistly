import ToastController from '@/controllers/ToastController';
import axios from 'axios';

const _axios = axios.create({
  baseURL: '/api',
  headers: { 'Access-Control-Allow-Origin': '*' },
});

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
    const res = await _axios.post('/uploadTrack', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('res', res);

    return res.data;
  } catch (error) {
    handleError({ error, callName: 'uploadTrack' });
    throw error;
  }
}