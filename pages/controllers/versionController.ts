import { supabase } from '@/lib/supabaseClient';
import { Version, VersionUpload } from '@/types';

export async function createVersion(version: VersionUpload) {
  const { title, fileUrl, feedbackNotes, projectId } = version;

  const { data, error } = await supabase
    .from('versions')
    .insert([
      {
        title,
        file_url: fileUrl,
        notes: feedbackNotes,
        project_id: projectId,
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
    .from('versions')
    .select('id, created_at, title, file_url, notes')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Error fetching versions: ${error.message}`);
  }

  return data;
}

export async function fetchVersionWithFeedbackByProjectId(projectId: string) {
  const versions = await fetchVersionsByProjectId(projectId);

  return await Promise.all(
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
}
