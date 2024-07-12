import { fetchProjectById } from '../../controllers/projectController';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUserById } from '../../controllers/userController';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing project ID' },
        { status: 400 }
      );
    }

    const projectId = Array.isArray(id) ? id[0] : id;
    const project = await fetchProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found.' },
        { status: 400 }
      );
    }

    const author = await fetchUserById(project.creator_id);

    return NextResponse.json({
      ...project,
      author,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
