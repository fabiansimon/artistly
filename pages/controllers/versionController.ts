import { supabase } from '@/lib/supabaseClient';
import { Version } from '@/types';

export async function createVersion(version: Version) {
  const { title, fileUrl, feedbackNotes, projectId } = version;

  console.log('feedbackNotes', feedbackNotes);
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
