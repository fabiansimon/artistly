import { storeFile } from '../controllers/fileController';
import { createProject } from '../controllers/projectController';
import { createVersion } from '../controllers/versionController';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('tracks') as File;
    const title = form.get('title') as string;
    const feedbackNotes = form.get('feedbackNotes') as string;
    const emailList = form.get('emailList') as string;

    if (!file)
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });

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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
