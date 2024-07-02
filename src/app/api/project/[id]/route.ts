import { Project } from '@/types';
import { fetchProjectById } from '../../controllers/projectController';
import { fetchVersionWithFeedbackByProjectId } from '../../controllers/versionController';
import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Bad Request: Missing project ID' },
      { status: 400 }
    );
  }

  try {
    const projectId = Array.isArray(id) ? id[0] : id;
    const project = await fetchProjectById(projectId);
    const versions = await fetchVersionWithFeedbackByProjectId(projectId);

    // Construct the project object
    const data: Project = {
      ...project,
      versions,
      collaborators: [],
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
