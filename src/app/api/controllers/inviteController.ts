import { supabase } from '@/lib/supabaseClient';
import { INVITE_EXPIRATION_DURATION_DAYS } from '../config';

const TABLE = 'invites';

export async function createInvites(projectId: string, emails: string[]) {
  const invites = emails.map((email) => ({
    project_id: projectId,
    email,
  }));

  console.log(invites);

  const { data, error } = await supabase.from(TABLE).insert(invites).select();

  if (error) {
    throw new Error(`Error adding invites: ${error.message}`);
  }

  return data;
}

export async function updateInvites(inviteIds: string[]) {
  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .update({ created_at: currentTime })
    .in('id', inviteIds);

  if (error) {
    throw new Error(`Error updating invites: ${error.message}`);
  }

  return data;
}

export async function fetchInvitesByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, email')
    .eq('project_id', projectId);

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking for valid invite: ${error.message}`);
  }

  return data;
}
export async function fetchInvitesByEmail(email: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email);

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking for invites by email: ${error.message}`);
  }

  return data;
}

export async function deleteInvite(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting invite: ${error.message}`);
  }
}

export async function deleteInvitesByProjectId(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting invites by Project ID: ${error.message}`);
  }
}

export async function checkValidInvite(projectId: string, userEmail: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('created_at, id')
    .eq('project_id', projectId)
    .eq('email', userEmail)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking for valid invite: ${error.message}`);
  }

  return data;
}

export function inviteExpired(createdAt: Date) {
  const now = new Date();
  console.log(
    'INVITE_EXPIRATION_DURATION_DAYS',
    INVITE_EXPIRATION_DURATION_DAYS
  );
  const ms = INVITE_EXPIRATION_DURATION_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  const difference = now.getTime() - new Date(createdAt).getTime();

  return difference > ms;
}
