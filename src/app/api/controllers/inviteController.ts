import { supabase } from '@/lib/supabaseClient';

export async function createInvites(projectId: string, emails: string[]) {
  const invites = emails.map((email) => ({
    project_id: projectId,
    email,
  }));

  const { data, error } = await supabase.from('invites').insert(invites);

  if (error) {
    console.log(error);
    throw new Error(`Error adding invites: ${error.message}`);
  }

  return data;
}
