import { Project } from '@/types';
import { fetchProjectById } from '../../controllers/projectController';
import { fetchVersionsWithFeedbackByProjectId } from '../../controllers/versionController';
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchCollaboratorsIdsByProjectId,
  projectIncludesUserId,
} from '../../controllers/collabController';
import { fetchUsersByIds, getUserData } from '../../controllers/userController';
import { fetchInvitesByProjectId } from '../../controllers/inviteController';
import {
  fetchShareableByProjectId,
  generateShareableURL,
} from '../../controllers/shareController';

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
      !(await projectIncludesUserId(id, userId))
    ) {
      return NextResponse.json(
        { error: 'User is not a member of this project.' },
        { status: 400 }
      );
    }

    const versions = await fetchVersionsWithFeedbackByProjectId(projectId);
    const collaboratorsIds = await fetchCollaboratorsIdsByProjectId(projectId);
    const users = await fetchUsersByIds([
      project.creator_id,
      ...collaboratorsIds,
    ]);

    const authors = users.filter((u) => u.id === project.creator_id);
    const collaborators = users.filter((u) => u.id !== project.creator_id);

    const openInvites = await fetchInvitesByProjectId(projectId);
    const shareable = await fetchShareableByProjectId(projectId);

    const data: Project = {
      ...project,
      authors,
      versions,
      collaborators,
      openInvites,
      shareableUrl: shareable && generateShareableURL(shareable.id),
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
