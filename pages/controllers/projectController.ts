import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function createProject({ title }: { title: string }) {
  const creatorId = uuidv4(); // for now

  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, creator_id: creatorId }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }

  return data;
}
