import { supabase } from '@/lib/supabaseClient';
import { FeedbackUpload } from '@/types';

export async function createFeedback(feedback: FeedbackUpload) {
  const { creatorId, text, timestamp, versionId } = feedback;

  const { data, error } = await supabase
    .from('comments')
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
