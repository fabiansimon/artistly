import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import { storeFile } from '../controllers/fileController';
import { createProject } from '../controllers/projectController';
import { createVersion } from '../controllers/versionController';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function POST(req: NextApiRequest) {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return NextResponse.json({ message: 'Error parsing form data' });
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

      return NextResponse.json({
        message: 'File uploaded and version created successfully',
        project,
        version,
      });
    } catch (error) {
      console.error('Error handling upload:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
