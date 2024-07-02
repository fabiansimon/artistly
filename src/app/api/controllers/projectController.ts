import { supabase } from '@/lib/supabaseClient';
import { getPaginationRange } from '@/lib/utils';
import { Pagination } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_TABLE = 'projects';
const COLLAB_TABLE = 'collaborators';

export async function createProject({ title }: { title: string }) {
  const creatorId = uuidv4(); // for now

  const { data, error } = await supabase
    .from(PROJECT_TABLE)
    .insert([{ title, creator_id: creatorId }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }

  return data;
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase
    .from(PROJECT_TABLE)
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
    .from(PROJECT_TABLE)
    .select('*', { count: 'estimated' })
    .eq('creator_id', userId)
    .range(...getPaginationRange(pagination));

  if (error)
    throw new Error(`Error fetching author projects: ${error.message}`);

  return data;
}

export async function fetchCollabProjects(
  userId: string,
  pagination?: Pagination
) {
  const { data, error } = await supabase
    .from(COLLAB_TABLE)
    .select('project_id, projects(*)', { count: 'estimated' })
    .eq('user_id', userId)
    .range(...getPaginationRange(pagination));

  if (error)
    throw new Error(`Error fetching collab projects: ${error.message}`);

  return data.map((collab) => collab.projects);
}
