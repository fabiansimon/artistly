import { supabase } from '@/lib/supabaseClient';
import fs from 'fs';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

interface UploadedFile {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: {
    'content-disposition': string;
    'content-type': string;
  };
  size: number;
}

export async function storeFile({ file }: { file: UploadedFile }) {
  const fileContent = fs.readFileSync(file.path);
  const mimeType = mime.lookup(file.originalFilename); // Type check to for Supabase Storage
  const fileId = uuidv4();

  // Check if mimeType is valid
  if (!mimeType) {
    throw new Error('Invalid file type');
  }

  const { error, data } = await supabase.storage
    .from(bucket!)
    .upload(`uploads/${fileId}`, fileContent, {
      cacheControl: '3600',
      upsert: false,
      contentType: mimeType,
    });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  const {
    data: { publicUrl: fileUrl },
  } = supabase.storage.from(bucket!).getPublicUrl(`uploads/${fileId}`);

  console.log(data, fileUrl);
  return { fileUrl };
}
