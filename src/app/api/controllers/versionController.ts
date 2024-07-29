import { supabase } from '@/lib/supabaseClient';
import { VersionUpload } from '@/types';

const TABLE = 'versions';
export async function createVersion(version: VersionUpload) {
  const { title, fileUrl, notes, projectId, creatorId } = version;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        title,
        file_url: fileUrl,
        notes,
        project_id: projectId,
        creator_id: creatorId,
      },
    ])
    .single();

  if (error) {
    throw new Error(`Error creating version: ${error.message}`);
  }

  return data;
}

export async function fetchVersionsByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, created_at, title, file_url, notes')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching versions: ${error.message}`);
  }

  return data;
}

export async function deleteVersionsByIds(ids: string[]) {
  const { error } = await supabase.from(TABLE).delete().in('id', ids);

  if (error) {
    throw new Error(`Error deleting versions: ${error.message}`);
  }

  return true;
}

export async function fetchVersionsWithFeedbackByProjectId(projectId: string) {
  const versions = await fetchVersionsByProjectId(projectId);

  const res = await Promise.all(
    versions.map(async (version) => {
      const { data, error } = await supabase
        .from('comments')
        .select('id, timestamp, text, creator_id')
        .eq('version_id', version.id);

      if (error) {
        throw new Error(
          `Error fetching feedback for version ${version.id}: ${error.message}`
        );
      }

      return {
        ...version,
        feedback: data,
      };
    })
  );

  return res;
}
