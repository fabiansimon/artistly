import { Project } from '@/types';
import {
  fetchProjectById,
  projectIncludesUser,
} from '../../controllers/projectController';
import { fetchVersionWithFeedbackByProjectId } from '../../controllers/versionController';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = '4f0f6512-2b24-4d15-a058-8af776af0409';

    const { id } = params;
    if (!userId || !id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing project ID' },
        { status: 400 }
      );
    }

    const projectId = Array.isArray(id) ? id[0] : id;
    const project = await fetchProjectById(projectId);

    if (
      project.creator_id !== userId &&
      (await projectIncludesUser(id, userId))
    ) {
      return NextResponse.json(
        { error: 'User is not a member of this project.' },
        { status: 400 }
      );
    }

    const versions = await fetchVersionWithFeedbackByProjectId(projectId);

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
