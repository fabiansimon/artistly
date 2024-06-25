import { NextApiRequest, NextApiResponse } from 'next';
import { createFeedback } from '../controllers/feedbackController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allow' });
  }

  try {
    const { versionId, text, timestamp } = req.body;

    const feedback = await createFeedback({
      creatorId: 'f6ad275a-f4f0-4ff5-8729-de8a99a4be5d',
      text,
      versionId,
      timestamp,
    });

    return res.status(200).json({
      message: 'Feedback uploaded',
      feedback,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
