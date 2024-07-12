import { Project } from '@/types';
import { fetchProjectById } from '../../controllers/projectController';
import { fetchVersionWithFeedbackByProjectId } from '../../controllers/versionController';
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchCollaboratorsByProject,
  projectIncludesUser,
} from '../../controllers/collabController';
import { getUserData } from '../../controllers/userController';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing project ID' },
        { status: 400 }
      );
    }

    const projectId = Array.isArray(id) ? id[0] : id;
    const project = await fetchProjectById(projectId);

    if (
      project.creator_id !== userId &&
      !(await projectIncludesUser(id, userId))
    ) {
      return NextResponse.json(
        { error: 'User is not a member of this project.' },
        { status: 400 }
      );
    }

    const versions = await fetchVersionWithFeedbackByProjectId(projectId);
    const collaboratorsId = await fetchCollaboratorsByProject(project.id);

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
