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

export async function deleteShareable(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting shareable: ${error.message}`);
  }
}

export async function fetchShareableByID(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Error fetching shareable: ${error.message}`);

  return data;
}

export function generateShareableURL({ id }: { id: string }) {
  const baseUrl = 'www.localhost:3000';
  return `${baseUrl}/share/${id}`;
}
