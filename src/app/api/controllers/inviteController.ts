import { supabase } from '@/lib/supabaseClient';
import { INVITE_EXPIRATION_DURATION_DAYS } from '../config';

const TABLE = 'invites';

export async function createInvites(projectId: string, emails: string[]) {
  const invites = emails.map((email) => ({
    project_id: projectId,
    email,
  }));

  const { data, error } = await supabase.from(TABLE).insert(invites);

  if (error) {
    throw new Error(`Error adding invites: ${error.message}`);
  }

  return data;
}

export async function deleteInvite(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting invite: ${error.message}`);
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
