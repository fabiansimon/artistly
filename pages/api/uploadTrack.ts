import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import { createProject } from '../controllers/projectController';
import { storeFile } from '../controllers/fileController';
import { createVersion } from '../controllers/versionController';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      console.error('Error parsing form data:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      const {
        title: [title],
        feedbackNotes: [feedbackNotes],
        emailList: [emailList],
      } = fields;
      const emails = JSON.parse(emailList);

      const {
        tracks: [file],
      } = files;

      /*
        send emails to emails
      */

      const { fileUrl } = await storeFile({ file });
      const project = await createProject({ title });
      const version = await createVersion({
        title,
        fileUrl,
        feedbackNotes,
        projectId: project.id,
      });

      return res.status(200).json({
        message: 'File uploaded and version created successfully',
        project,
        version,
      });
    } catch (error) {
      console.error('Error handling upload:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
