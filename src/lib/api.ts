import ToastController from '@/controllers/ToastController';
import { Pagination } from '@/types';
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

function paginationParams(pagination?: Pagination) {
  if (!pagination) return '';
  const { limit, page } = pagination;
  return `?page=${page}&limit=${limit}`;
}

export async function fetchProject(projectId: string) {
  try {
    const res = await _axios.get(`api/project/${projectId}`);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'fetchProject' });
    throw error;
  }
}

export async function sendInvites(projectId: string, invitees: string) {
  try {
    const res = await _axios.post(
      `api/send-invitation?projectId=${projectId}`,
      {
        invitees,
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'sendInvites' });
    throw error;
  }
}

export async function deleteInvite(projectId: string, inviteId: string) {
  try {
    const res = await _axios.post(
      `api/remove-invitation?projectId=${projectId}`,
      {
        inviteId,
      }
    );
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'removeInvite' });
    throw error;
  }
}

export async function fetchInvitation(projectId: string) {
  try {
    const res = await _axios.get(`api/invitation/${projectId}`);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'fetchInvitation' });
    throw error;
  }
}

export async function createProject(data: FormData) {
  try {
    const res = await _axios.post('/api/create-project', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'createProject' });
    throw error;
  }
}

export async function uploadVersion(data: FormData) {
  try {
    const res = await _axios.post('/api/upload-version', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'uploadVersion' });
    throw error;
  }
}

export async function uploadFeedback({
  versionId,
  text,
  timestamp,
  projectId,
}: {
  versionId: string;
  projectId: string;
  text: string;
  timestamp?: number;
}) {
  try {
    const res = await _axios.post('/api/feedback', {
      versionId,
      text,
      timestamp,
      projectId,
    });
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'uploadFeeback' });
    throw error;
  }
}

export async function deleteFeedback({ id }: { id: string }) {
  try {
    const res = await _axios.delete(`/api/feedback/${id}`);
    return res.status;
  } catch (error) {
    handleError({ error, callName: 'deleteFeedback' });
    throw error;
  }
}

export async function getUserProjects({
  pagination,
}: {
  pagination?: Pagination;
}) {
  try {
    const res = await _axios.get(
      `/api/projects${paginationParams(pagination)}`
    );
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'getUserProjects' });
    throw error;
  }
}

export async function joinCollabProject({ id }: { id: string }) {
  try {
    const res = await _axios.post(`/api/join/${id}`);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'joinCollabProject' });
    throw error;
  }
}

export async function openStripSession({ priceId }: { priceId: string }) {
  try {
    const res = await _axios.post(`/api/upgrade-plan/${priceId}`);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'openStripSession' });
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    await _axios.post('/api/cancel-plan');
    return true;
  } catch (error) {
    handleError({ error, callName: 'cancelSubscription' });
    throw error;
  }
}

export async function fetchInitSummary() {
  try {
    const res = await _axios.get('/api/init-summary');
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'fetchInitSummary' });
    throw error;
  }
}

export async function createShareable({
  projectId,
  onlyRecentVersion,
  unlimitedVisits,
}: {
  projectId: string;
  onlyRecentVersion: boolean;
  unlimitedVisits: boolean;
}) {
  try {
    const res = await _axios.post('/api/share', {
      projectId,
      onlyRecentVersion,
      unlimitedVisits,
    });
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'createShareable' });
    throw error;
  }
}

export async function fetchShareable(id: string) {
  try {
    const res = await _axios.get(`/api/share/${id}`);
    return res.data;
  } catch (error) {
    handleError({
      error,
      callName: 'fetchShareable',
      showError: false,
    });
    throw error;
  }
}

export async function deleteShareable(id: string) {
  try {
    await _axios.delete(`/api/share/${id}`);
    return true;
  } catch (error) {
    handleError({ error, callName: 'deleteShareable' });
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    await _axios.delete(`/api/delete-project/${id}`);
    return true;
  } catch (error) {
    handleError({ error, callName: 'deleteProject' });
    throw error;
  }
}

export async function deleteCollab(projectId: string, userId: string) {
  try {
    await _axios.delete(`/api/remove-collab/${projectId}/${userId}`);
    return true;
  } catch (error) {
    handleError({ error, callName: 'deleteCollab' });
    throw error;
  }
}

export async function fetchInvitations() {
  try {
    const res = await _axios.get('/api/invitations');
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleError({ error, callName: 'deleteCollab' });
    throw error;
  }
}
