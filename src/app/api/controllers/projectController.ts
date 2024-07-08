import { supabase } from '@/lib/supabaseClient';
import { getPaginationRange } from '@/lib/utils';
import { Pagination } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_TABLE = 'projects';
const COLLAB_TABLE = 'collaborators';

export async function createProject({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const creatorId = uuidv4(); // for now

  const { data, error } = await supabase
    .from(PROJECT_TABLE)
    .insert([{ title, description, creator_id: creatorId }])
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
export async function fetchCollabProjects(
  userId: string,
  pagination?: Pagination
) {
  const { data, error } = await supabase
    .from(COLLAB_TABLE)
    .select(
      `
      project_id,
      projects(
        *,
        versions(*)
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .range(...getPaginationRange(pagination));

  if (error) {
    throw new Error(`Error fetching collab projects: ${error.message}`);
  }

  return data.map((collab) => collab.projects);
}

export async function projectIncludesUser(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  // PGRST116 is the code for no rows found in Supabase
  if (error && error.code !== 'PGRST116')
    throw new Error(`Error checking for user in project: ${error.message}`);

  return data !== null;
}

export async function joinCollabProject(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from(COLLAB_TABLE)
    .insert([{ project_id: projectId, user_id: userId }]);

  if (error) throw new Error(`Error joining collab project: ${error.message}`);

  return data;
}
