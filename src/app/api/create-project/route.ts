import { createProject } from '../controllers/projectController';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = form.get('title') as string;
    const description = form.get('description') as string;
    const invitees = form.get('invitees') as string;

    const project = await createProject({ title, description });

    return NextResponse.json({
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
