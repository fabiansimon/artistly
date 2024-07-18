import { supabase } from '@/lib/supabaseClient';
import { FeedbackUpload } from '@/types';

const TABLE = 'comments';

export async function createFeedback(feedback: FeedbackUpload) {
  const { creatorId, text, timestamp, versionId } = feedback;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        text,
        timestamp,
        version_id: versionId,
        creator_id: creatorId,
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

export async function deleteFeedback(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting feedback: ${error.message}`);
  }
}
