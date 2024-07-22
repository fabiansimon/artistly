import { supabase } from '@/lib/supabaseClient';
import { Comment, FeedbackUpload } from '@/types';

const TABLE = 'comments';

export async function createFeedback(feedback: FeedbackUpload) {
  const { creatorId, text, timestamp, versionId, projectId } = feedback;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        text,
        timestamp,
        version_id: versionId,
        creator_id: creatorId,
        project_id: projectId,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating feedback: ${error.message}`);
  }

  return data;
}

export async function fetchFeedbackById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching feedback: ${error.message}`);
  }

  return data;
}

export async function fetchLatestFeedbackByProjectIds(projectIds: string[]) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching latest feedback: ${error.message}`);
  }

  const latestMap = new Map<string, Comment>();

  for (const feedback of data) {
    const { project_id } = feedback;
    if (!latestMap.has(project_id)) {
      latestMap.set(project_id, feedback);
    }
  }

  return latestMap;
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting feedback: ${error.message}`);
  }
}
