import { supabase } from '@/lib/supabaseClient';
import { getPaginationRange } from '@/lib/utils';
import { Pagination } from '@/types';

const TABLE = 'projects';

export async function createProject({
  title,
  description,
  userId,
}: {
  title: string;
  description: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ title, description, creator_id: userId }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }

  return data;
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (!data) throw new Error('No project with that ID found.');
  if (error) throw new Error(`Error fetching project: ${error.message}`);
  return data;
}

export async function fetchAuthorProjects(
  userId: string,
  pagination?: Pagination
) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      *,
      versions(*)
    `,
      { count: 'exact' }
    )
    .eq('creator_id', userId)
    .range(...getPaginationRange(pagination));

  if (error) {
    throw new Error(`Error fetching author projects: ${error.message}`);
  }

  return data;
}

export async function deleteProjectById(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting project: ${error.message}`);
  }

  return true;
}
