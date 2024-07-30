import { ROUTES } from '@/constants/routes';
import { supabase } from '@/lib/supabaseClient';

const TABLE = 'shareables';

export async function createShareable({
  projectId,
  onlyRecentVersion,
  unlimitedVisits,
}: {
  projectId: string;
  onlyRecentVersion: boolean;
  unlimitedVisits: boolean;
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        project_id: projectId,
        only_recent_version: onlyRecentVersion,
        unlimited_visits: unlimitedVisits,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating shareable: ${error.message}`);
  }

  return data;
}

export async function archiveShareable(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ archived: true })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Error archiving shareable: ${error.message}`);
  }

  return data;
}

export async function deleteShareable(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting shareable: ${error.message}`);
  }
}

export async function deleteShareablesByProjectId(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('project_id', id);

  if (error) {
    throw new Error(`Error deleting shareable by Project ID: ${error.message}`);
  }

  return true;
}

export async function fetchShareableById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  console.log(data);
  if (error)
    throw new Error(`Error fetching shareable by ID: ${error.message}`);

  return data;
}

export async function incrementOpenedCount(id: string) {
  const { data, error } = await supabase.rpc('increment_opened', {
    item_id: id,
  });

  if (error) {
    throw new Error(`Error incrementing opened count: ${error.message}`);
  }

  return data;
}

export async function fetchShareableByProjectId(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('project_id', id)
    .single();

  if (error && error.code !== 'PGRST116')
    throw new Error(`Error fetching shareable by project ID: ${error.message}`);

  return data;
}

export async function fetchShareablesByProjectIds(id: string[]) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .in('project_id', id)
    .select();

  if (error && error.code !== 'PGRST116')
    throw new Error(
      `Error fetching shareables by project IDs: ${error.message}`
    );

  return data;
}

export function generateShareableURL(id: string) {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}/${ROUTES.listen}/${id}`;
}
