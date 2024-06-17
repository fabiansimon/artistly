import { supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
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
    const { title, feedbackNotes, emailList } = fields;

    const emails = JSON.parse(emailList[0]);

    for (const email of emails) console.log(email);

    const file = files['tracks'][0];
    const filePath = file.path;
    const fileName = file.originalFilename;
    const fileContent = fs.readFileSync(filePath);
    const mimeType = mime.lookup(fileName);
    const fileId = uuidv4();

    const creatorId = uuidv4();

    // Check if mimeType is valid
    if (!mimeType) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Create a new project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{ title: title[0], creator_id: creatorId }])
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      return res.status(500).json({ error: 'Error creating project' });
    }

    // Upload the file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from(bucket!)
      .upload(`uploads/${fileId}`, fileContent, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType,
      });

    if (storageError) {
      console.error('Error uploading file:', storageError);
      return res
        .status(500)
        .json({ error: 'Error uploading file to Supabase' });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket!).getPublicUrl(`uploads/${fileId}`);

    // Step 3: Create a new version associated with the project
    const { data: versionData, error: versionError } = await supabase
      .from('versions')
      .insert([
        {
          title: title[0],
          file_url: publicUrl,
          notes: feedbackNotes[0],
          project_id: projectData.id,
        },
      ])
      .single();

    if (versionError) {
      console.error('Error creating version:', versionError);
      return res.status(500).json({ error: 'Error creating version' });
    }

    return res.status(200).json({
      message: 'File uploaded and version created successfully',
      project: projectData,
      version: versionData,
    });
  });
}
