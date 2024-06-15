import { supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, trackFile, email } = req.body;

  if (!title || !trackFile || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Upload track to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('tracks')
      .upload(`public/${trackFile.name}`, trackFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    // const trackUrl = storageData.path;

    // const { data: dbData, error: dbError } = await supabase
    //   .from('tracks')
    //   .insert([{ title, trackUrl, email }]);

    // if (dbError) {
    //   throw new Error(dbError.message);
    // }

    res
      .status(200)
      .json({ message: 'Track uploaded and email sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
