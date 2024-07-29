import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

export async function storeFile({ file }: { file: File }) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileId = uuidv4();
  const contentType = file.type;
  const path = `uploads/${fileId}`;
  const { data, error } = await supabase.storage
    .from(bucket!)
    .upload(path, buffer, {
      contentType,
    });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
  console.log(bucket);
  console.log(data);

  const {
    data: { publicUrl: fileUrl },
  } = supabase.storage.from(bucket!).getPublicUrl(path);

  console.log(fileUrl);
  return { fileUrl };
}
