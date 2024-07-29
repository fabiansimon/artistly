import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../../controllers/userController';
import {
  deleteProjectById,
  fetchProjectById,
} from '../../controllers/projectController';
import {
  deleteVersionsByIds,
  fetchVersionsWithFeedbackByProjectId,
} from '../../controllers/versionController';
import { deleteCollaboratorsByProjectId } from '../../controllers/collabController';
import { deleteInvitesByProjectId } from '../../controllers/inviteController';
import { deleteShareablesByProjectId } from '../../controllers/shareController';
import { deleteFeedbackByIds } from '../../controllers/feedbackController';

export async function DELETE(
  req: NextRequest,
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

    const { userId } = await getUserData(req);
    const project = await fetchProjectById(id);

    if (!userId || userId !== project.creator_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [versions] = await Promise.all([
      fetchVersionsWithFeedbackByProjectId(project.id),
    ]);

    const versionIds = versions.map((version) => version.id);
    const feedbackIds = versions.flatMap((version) =>
      version.feedback.map((f) => f.id)
    );

    await Promise.all([
      deleteInvitesByProjectId(project.id),
      deleteCollaboratorsByProjectId(project.id),
      deleteShareablesByProjectId(project.id),
      deleteFeedbackByIds(feedbackIds),
    ]);

    await deleteVersionsByIds(versionIds);
    await deleteProjectById(project.id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
