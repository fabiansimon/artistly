import { storeFile } from '../controllers/fileController';
import { NextRequest, NextResponse } from 'next/server';
import { createVersion } from '../controllers/versionController';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('track') as File;
    const title = form.get('title') as string;
    const projectId = form.get('projectId') as string;
    const notes = form.get('notes') as string;

    if (!file)
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });

    const { fileUrl } = await storeFile({ file });
    const version = await createVersion({
      title,
      fileUrl,
      notes,
      projectId,
    });

    return NextResponse.json({
      version,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
