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

export async function deleteFeedbackByIds(ids: string[]) {
  const { error } = await supabase.from(TABLE).delete().in('id', ids);

  if (error) {
    throw new Error(`Error deleting feedbacks: ${error.message}`);
  }

  return true;
}

export async function deleteFeedbackByUserIdInProject({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('creator_id', userId)
    .eq('project_id', projectId);

  if (error) {
    throw new Error(
      `Error deleting feedback by User ID in Project: ${error.message}`
    );
  }

  return true;
}
