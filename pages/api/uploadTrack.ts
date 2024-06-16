import { supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // Log the parsed form data
    console.log('Fields:', fields);
    console.log('Files:', files);

    const file = files['trackBlob'][0];
    const filePath = file.path;
    const fileName = file.originalFilename;
    const fileContent = fs.readFileSync(filePath);
    const mimeType = mime.lookup(fileName);

    // Check if mimeType is valid
    if (!mimeType) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket!)
      .upload(`uploads/${fileName}`, fileContent, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return res
        .status(500)
        .json({ error: 'Error uploading file to Supabase' });
    }

    // Optionally, you can get the public URL of the uploaded file
    const url = supabase.storage
      .from(bucket!)
      .getPublicUrl(`uploads/${fileName}`);
    console.log(url);

    res
      .status(200)
      .json({ message: 'File uploaded successfully', url: 'publicURL' });
  });
}
