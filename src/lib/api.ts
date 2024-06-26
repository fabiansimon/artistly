import ToastController from '@/controllers/ToastController';
import { Project } from '@/types';
import axios from 'axios';

const _axios = axios.create({
  baseURL: 'http://localhost:3000/',
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
    const res = await _axios.post('/api/project/uploadTrack', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (error) {
    handleError({ error, callName: 'uploadTrack' });
    throw error;
  }
}

export async function fetchProject(projectId: string) {
  try {
    const res = await _axios.get<Project>(`api/project/${projectId}`);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'fetchProject' });
    throw error;
  }
}

export async function uploadFeeback({
  versionId,
  text,
  timestamp,
}: {
  versionId: string;
  text: string;
  timestamp?: number;
}) {
  try {
    const res = await _axios.post<any>('/api/project/uploadFeedback', {
      versionId,
      text,
      timestamp,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'uploadFeeback' });
    throw error;
  }
}
