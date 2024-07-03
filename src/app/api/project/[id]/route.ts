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
    const userId = 'd22bd5f3-48b0-4db8-bf3f-4e875fd57dfa';

    const { id } = params;
    if (!userId || !id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing project ID' },
        { status: 400 }
      );
    }

    const exists = await projectIncludesUser(id, userId);
    if (!exists)
      return NextResponse.json(
        { error: 'User is not a member of this project.' },
        { status: 400 }
      );

    const projectId = Array.isArray(id) ? id[0] : id;
    const project = await fetchProjectById(projectId);
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
