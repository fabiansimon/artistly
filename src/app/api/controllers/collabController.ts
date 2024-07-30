import { supabase } from '@/lib/supabaseClient';
import { getPaginationRange } from '@/lib/utils';
import { Pagination } from '@/types';

const TABLE = 'collaborators';

export async function fetchCollabProjects(
  userId: string,
  pagination?: Pagination
) {
  const { data, error } = await supabase
    .from(TABLE)
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

export async function projectIncludesUserId(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  // PGRST116 is the code for no rows found in Supabase
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking for userId in project: ${error.message}`);
  }

  return data !== null;
}

export async function joinCollabProject(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ project_id: projectId, user_id: userId }]);

  if (error) {
    throw new Error(`Error joining collab project: ${error.message}`);
  }

  return data;
}

export async function removeCollaboration(projectId: string, userId: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error deleting collaboration: ${error.message}`);
  }

  return true;
}

export async function fetchCollaboratorsIdsByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('user_id')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Error fetching collaborators: ${error.message}`);
  }

  return data.map((user) => user.user_id);
}

export async function fetchCollaboratorsByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Error fetching collaborators: ${error.message}`);
  }

  return data;
}

export async function deleteCollaboratorsByProjectId(projectId: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('project_id', projectId);

  if (error) {
    throw new Error(
      `Error deleting collaborators Project ID: ${error.message}`
    );
  }

  return true;
}
