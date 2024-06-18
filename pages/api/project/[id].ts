import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { fetchProjectById } from '../../controllers/projectController';
import { Project, Version } from '@/types';
import {
  fetchVersionsByProjectId,
  fetchVersionWithFeedbackByProjectId,
} from '../../controllers/versionController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Bad Request: Missing project ID' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const project = await fetchProjectById(id);
    const versions = await fetchVersionWithFeedbackByProjectId(id);

    // Construct the project object
    const data: Project = {
      ...project,
      versions,
      collaborators: [],
    };

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching project:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
